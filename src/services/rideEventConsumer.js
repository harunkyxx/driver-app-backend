const amqp = require("amqplib");

const startRideEventConsumer = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    const queue = "ride_events";

    await channel.assertQueue(queue, {
      durable: true,
    });

    console.log("Ride event consumer started");

    channel.consume(queue, (message) => {
      if (message) {
        const event = JSON.parse(message.content.toString());

        console.log("RabbitMQ event received:");
        console.log(event);

        channel.ack(message);
      }
    });
  } catch (error) {
    console.error(
      "Ride event consumer error:",
      error.message
    );
  }
};

module.exports = {
  startRideEventConsumer,
};