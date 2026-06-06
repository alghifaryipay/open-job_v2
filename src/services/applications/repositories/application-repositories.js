import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class ApplicationRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async createApplication({ user_id, job_id, status }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    const query = {
      text: `INSERT INTO applications (id, user_id, job_id, status, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      values: [id, user_id, job_id, status, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getApplications() {
    const result = await this.pool.query('SELECT * FROM applications');
    return result.rows;
  }

  async getApplicationById(id) {
    const query = {
      text: 'SELECT * FROM applications WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getApplicationsByUserId(user_id) {
    const query = {
      text: 'SELECT * FROM applications WHERE user_id = $1',
      values: [user_id],
    };
    const result = await this.pool.query(query);
    return result.rows;
  }

  async getApplicationsByJobId(job_id) {
    const query = {
      text: 'SELECT * FROM applications WHERE job_id = $1',
      values: [job_id],
    };
    const result = await this.pool.query(query);
    return result.rows;
  }

  async updateApplication(id, { status }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE applications SET status = $1, updated_at = $2 WHERE id = $3 RETURNING id',
      values: [status, updatedAt, id],
    };
    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async deleteApplication(id) {
    const query = {
      text: 'DELETE FROM applications WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this.pool.query(query);
    return result.rows[0];
  }
}

export default new ApplicationRepositories();
