const app = require("./serverinfo");
const pubSubSubscriberService = require("./services/PubSubSubscriberService");
const kafkaSubscriberService = require("./services/KafkaSubscriberService");

const PORT = process.env.PORT || 4015;

const server = app.listen(PORT, () => {
  console.log(
    `Microservicio nodeAvailability corriendo en modo ${process.env.DESC_ENV || "DEV"} en el puerto ${PORT}!`,
  );

  // Inicializar el consumo de mensajes de Pub/Sub
  pubSubSubscriberService.initSubscriber();
  // Kafka se inicia solo cuando su configuración está completa.
  kafkaSubscriberService.initSubscriber();
});

const gracefulShutdown = async (signal) => {
  console.log(`Señal ${signal} recibida. Cerrando microservicio nodeAvailability...`);
  await Promise.all([
    pubSubSubscriberService.close(),
    kafkaSubscriberService.close(),
  ]);
  server.close(() => {
    console.log("Servidor HTTP cerrado exitosamente.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
