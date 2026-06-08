import amqp from 'amqplib';

const QUEUE_NAME =
  'application_created';

export const sendToQueue =
  async (applicationId) => {
    const connection =
      await amqp.connect(
        `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
      );

    const channel =
      await connection.createChannel();

    await channel.assertQueue(
      QUEUE_NAME,
      {
        durable: true,
      },
    );

    channel.sendToQueue(
      QUEUE_NAME,
      Buffer.from(
        JSON.stringify({
          application_id:
            applicationId,
        }),
      ),
    );

    await channel.close();
    await connection.close();
  };