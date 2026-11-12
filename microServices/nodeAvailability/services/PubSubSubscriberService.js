const fs = require("fs");
const { PubSub } = require("@google-cloud/pubsub");
const log4js = require("log4js");
const { processInventoryUpdate } = require("./InventoryUpdateProcessorService");

const logger = log4js.getLogger("PubSubSubscriberService");

class PubSubSubscriberService {
  constructor() {
    this.pubsubClient = null;
    this.subscription = null;
    this.isListening = false;
    this.boundMessageHandler = this.IVUpdatesMessageReceiver.bind(this);
    this.boundErrorHandler = this.handleSubscriptionError.bind(this);
  }

  /**
   * Valida la configuración de entorno requerida para Pub/Sub
   * @returns {boolean} True si la configuración es válida, false en caso contrario
   */
  validateConfig() {
    const projectId = process.env.GCP_PROJECT_ID;
    const subscriptionName = process.env.PUBSUB_SUBSCRIPTION_IV;
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    let hasErrors = false;

    if (!projectId || String(projectId).trim() === "") {
      logger.error(
        "[PubSubSubscriberService] Configuración incompleta: la variable 'GCP_PROJECT_ID' no está definida o está vacía.",
      );
      hasErrors = true;
    }

    if (!subscriptionName || String(subscriptionName).trim() === "") {
      logger.error(
        "[PubSubSubscriberService] Configuración incompleta: la variable 'PUBSUB_SUBSCRIPTION_IV' no está definida o está vacía.",
      );
      hasErrors = true;
    }

    if (credentialsPath && String(credentialsPath).trim() !== "") {
      if (!fs.existsSync(credentialsPath)) {
        logger.error(
          `[PubSubSubscriberService] Archivo de credenciales no encontrado en la ruta especificada por GOOGLE_APPLICATION_CREDENTIALS: '${credentialsPath}'.`,
        );
        hasErrors = true;
      }
    } else {
      logger.warn(
        "[PubSubSubscriberService] 'GOOGLE_APPLICATION_CREDENTIALS' no está definida.",
      );
    }

    return !hasErrors;
  }

  /**
   * Inicializa el cliente Pub/Sub y el listener para la suscripción
   */
  initSubscriber() {
    if (!this.validateConfig()) {
      logger.error(
        "[PubSubSubscriberService] No se pudo inicializar el Subscriber de Pub/Sub debido a errores en las variables de entorno.",
      );
      return;
    }

    if (this.isListening) {
      logger.warn(
        "[PubSubSubscriberService] El Subscriber ya se encuentra inicializado y escuchando mensajes.",
      );
      return;
    }

    try {
      const pubsubOptions = {
        projectId: process.env.GCP_PROJECT_ID,
      };

      // El SDK de Google Cloud lee automáticamente la variable de entorno
      // GOOGLE_APPLICATION_CREDENTIALS mediante Application Default Credentials (ADC).
      this.pubsubClient = new PubSub(pubsubOptions);
      this.subscription = this.pubsubClient.subscription(process.env.PUBSUB_SUBSCRIPTION_IV);

      // Limpiar listeners existentes para evitar handlers duplicados
      this.subscription.removeListener("message", this.boundMessageHandler);
      this.subscription.removeListener("error", this.boundErrorHandler);

      // Registrar listener para recepción de mensajes y errores
      this.subscription.on("message", this.boundMessageHandler);
      this.subscription.on("error", this.boundErrorHandler);

      this.isListening = true;
      logger.info(
        `[PubSubSubscriberService] Subscriber iniciado exitosamente para la suscripción '${process.env.PUBSUB_SUBSCRIPTION_IV}' en el proyecto '${process.env.GCP_PROJECT_ID}'.`,
      );
    } catch (error) {
      logger.error(
        `[PubSubSubscriberService] Error inesperado al inicializar el Subscriber de Pub/Sub: ${error.message}`,
      );
    }
  }

  /**
   * Manejador de errores del stream de la suscripción
   * @param {Error} error Error emitido por la suscripción
   */
  handleSubscriptionError(error) {
    logger.error(
      `[PubSubSubscriberService] Error en la suscripción de Pub/Sub '${process.env.PUBSUB_SUBSCRIPTION_IV}': ${error.message || error}`,
    );
  }

  /**
   * Procesa cada mensaje recibido desde la suscripción de Google Cloud Pub/Sub
   * Orden de procesamiento:
   * 1. Procesar inventario
   * 2. Almacenar en BD
   * 3. Registrar auditoría en consola / logs
   * Confirma siempre con ack() registrando errores si ocurren.
   *
   * @param {Object} message Mensaje de Pub/Sub
   */
   async IVUpdatesMessageReceiver(message) {
     try {
       await processInventoryUpdate(message.data);
     } catch (error) {
       logger.error(
         `[PubSubSubscriberService] Error durante el procesamiento del mensaje: ${error.message}`,
       );
     } finally {
      // Se confirma el mensaje con ack() así ocurra un error en el procesamiento
      try {
        message.ack();
        logger.info(
          "[PubSubSubscriberService] Mensaje confirmado con ack().",
        );
      } catch (ackError) {
        logger.error(
          `[PubSubSubscriberService] Error al confirmar con ack(): ${ackError.message}`,
        );
      }
    }
  }

  /**
   * Cierra de forma ordenada la suscripción y libera recursos
   */
  async close() {
    if (this.subscription) {
      logger.info("[PubSubSubscriberService] Cerrando suscripción de Pub/Sub...");
      this.subscription.removeListener("message", this.boundMessageHandler);
      this.subscription.removeListener("error", this.boundErrorHandler);
      try {
        await this.subscription.close();
        logger.info("[PubSubSubscriberService] Suscripción cerrada correctamente.");
      } catch (closeError) {
        logger.error(
          `[PubSubSubscriberService] Error al cerrar suscripción: ${closeError.message}`
        );
      }
      this.isListening = false;
    }
  }
}

// Exportar una instancia singleton del servicio
module.exports = new PubSubSubscriberService();
