import amqp from 'amqplib';
import nodemailer from 'nodemailer';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  // Pastikan Anda memuat kredensial DB di .env consumer Anda
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const init = async () => {
  try {
    const connection = await amqp.connect(
      `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`
    );
    const channel = await connection.createChannel();
    const QUEUE_NAME = 'application_created';

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    channel.consume(QUEUE_NAME, async (message) => {
      if (message !== null) {
        const { application_id } = JSON.parse(message.content.toString());

        const query = `
          SELECT 
            u_owner.email AS owner_email,
            u_pelamar.email AS pelamar_email,
            u_pelamar.name AS pelamar_nama,
            a.created_at AS tanggal_lamaran
          FROM applications a
          JOIN jobs j ON a.job_id = j.id
          JOIN companies c ON j.company_id = c.id
          JOIN users u_owner ON c.user_id = u_owner.id
          JOIN users u_pelamar ON a.user_id = u_pelamar.id
          WHERE a.id = $1
        `;

        const result = await pool.query(query, [application_id]);

        if (result.rows.length > 0) {
          const data = result.rows[0];

          const mailOptions = {
            from: process.env.MAIL_USER,
            to: data.owner_email, 
            subject: 'Notifikasi Lamaran Baru - OpenJob',
            html: `
              <h2>Halo, Ada kandidat baru yang melamar pekerjaan Anda!</h2>
              <p>Berikut adalah rincian pelamar:</p>
              <ul>
                <li><strong>Nama Pelamar:</strong> ${data.pelamar_nama}</li>
                <li><strong>Email Pelamar:</strong> ${data.pelamar_email}</li>
                <li><strong>Tanggal Lamaran:</strong> ${new Date(data.tanggal_lamaran).toLocaleString('id-ID')}</li>
              </ul>
            `,
          };

          await transporter.sendMail(mailOptions);
        }

        channel.ack(message);
      }
    });
  } catch (error) {
    console.error('Consumer Error:', error);
  }
};

init();