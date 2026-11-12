const { Kafka } = require("kafkajs");
const log4js = require("log4js");
const { processInventoryUpdate } = require("./InventoryUpdateProcessorService");

const logger = log4js.getLogger("KafkaSubscriberService");

const getConfig = () => ({
  brokers: (process.env.KAFKA_BROKERS || "")
    .split(",")
    .map((broker) => broker.trim())
    .filter(Boolean),
  topic: (process.env.KAFKA_TOPIC_IV || "").trim(),
  groupId: (process.env.KAFKA_GROUP_ID || "").trim(),
});

const validateConfig = (config) => {
  let hasErrors = false;

  if (config.brokers.length === 0) {
    logger.error(
      "[KafkaSubscriberService] Configuración incompleta: 'KAFKA_BROKERS' no está definida o está vacía.",
    );
    hasErrors = true;
  }

  if (!config.topic) {
    logger.error(
      "[KafkaSubscriberService] Configuración incompleta: 'KAFKA_TOPIC_IV' no está definida o está vacía.",
    );
    hasErrors = true;
  }

  if (!config.groupId) {
    logger.error(
      "[KafkaSubscriberService] Configuración incompleta: 'KAFKA_GROUP_ID' no está definida o está vacía.",
    );
    hasErrors = true;
  }

  return !hasErrors;
};

const processKafkaMessage = async ({ topic, partition, message }) => {
  try {
    await processInventoryUpdate(message.value);
    logger.info(
      `[KafkaSubscriberService] Mensaje procesado del topic '${topic}', partición ${partition}, offset ${message.offset}.`,
    );
  } catch (error) {
    logger.error(
      `[KafkaSubscriberService] Error al procesar mensaje del topic '${topic}', partición ${partition}, offset ${message.offset}: ${error.message}`,
    );
    // Retornar confirma el offset, igual que ack() en el flujo de Pub/Sub.
  }
};

class KafkaSubscriberService {
  constructor() {
    this.consumer = null;
    this.isListening = false;
  }

  async initSubscriber() {
    const config = getConfig();
    const requiredConfig = [
      process.env.KAFKA_BROKERS,
      process.env.KAFKA_TOPIC_IV,
      process.env.KAFKA_GROUP_ID,
    ];
    const isConfigured = (value) => typeof value === "string" && value.trim() !== "";

    const hasCompleteConfiguration = requiredConfig.every(isConfigured);
    const isValidConfig = validateConfig(config);
    if (!hasCompleteConfiguration || !isValidConfig) {
      logger.error(
        "[KafkaSubscriberService] No se pudo inicializar el consumidor Kafka debido a errores en las variables de entorno.",
      );
      return;
    }

    if (this.isListening) {
      logger.warn(
        "[KafkaSubscriberService] El consumidor ya se encuentra inicializado y escuchando mensajes.",
      );
      return;
    }

    try {
      const kafka = new Kafka({
        clientId: process.env.KAFKA_CLIENT_ID || "node-availability-client-id",
        brokers: config.brokers,
      });

      this.consumer = kafka.consumer({ groupId: config.groupId });
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: config.topic });
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          await processKafkaMessage({ topic, partition, message });
        },
      });
      this.isListening = true;
      logger.info(
        `[KafkaSubscriberService] Consumidor iniciado para el topic '${config.topic}' con el grupo '${config.groupId}'.`,
      );
    } catch (error) {
      logger.error(
        `[KafkaSubscriberService] Error al inicializar el consumidor Kafka: ${error.message}`,
      );
      await this.disconnectAfterInitializationError();
    }
  }

  async disconnectAfterInitializationError() {
    if (!this.consumer) {
      return;
    }

    try {
      await this.consumer.disconnect();
    } catch (error) {
      logger.error(
        `[KafkaSubscriberService] Error al desconectar después de una falla de inicialización: ${error.message}`,
      );
    } finally {
      this.consumer = null;
      this.isListening = false;
    }
  }

  async close() {
    if (!this.consumer) {
      return;
    }

    logger.info("[KafkaSubscriberService] Cerrando consumidor Kafka...");
    try {
      await this.consumer.disconnect();
      logger.info("[KafkaSubscriberService] Consumidor Kafka cerrado correctamente.");
    } catch (error) {
      logger.error(
        `[KafkaSubscriberService] Error al cerrar el consumidor Kafka: ${error.message}`,
      );
    } finally {
      this.consumer = null;
      this.isListening = false;
    }
  }
}

module.exports = new KafkaSubscriberService();
