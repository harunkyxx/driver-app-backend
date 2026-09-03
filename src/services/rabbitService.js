const amqp = require("amqplib");

let channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);

    channel = await connection.createChannel();

    await channel.assertQueue("ride_events", {
      durable: true,
    });

    console.log("RabbitMQ connected");
  } catch (error) {
    console.error("RabbitMQ connection error:", error.message);
  }
};

const sendRideEvent = (event) => {
  if (!channel) {
    console.log("RabbitMQ channel is not ready");
    return;
  }

  channel.sendToQueue(
    "ride_events",
    Buffer.from(JSON.stringify(event)),
    {
      persistent: true,
    }
  );
};

module.exports = {
  connectRabbitMQ,
  sendRideEvent,
};