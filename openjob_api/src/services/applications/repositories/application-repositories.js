import { Pool } from "pg";
import { nanoid } from "nanoid";
import redisClient from "../../../utils/redis.js";

class ApplicationRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async createApplication({ user_id, job_id, status }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    const query = {
      text: `
        INSERT INTO applications
        (
          id,
          user_id,
          job_id,
          status,
          created_at,
          updated_at
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6
        )
        RETURNING id
      `,
      values: [id, user_id, job_id, status, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);

    // Invalidate cache list
    await redisClient.del(`applications:user:${user_id}`);
    await redisClient.del(`applications:job:${job_id}`);

    return result.rows[0];
  }

  async getApplications() {
    const query = {
      text: `
      SELECT
        a.id,
        a.user_id,
        a.job_id,
        a.status,
        a.created_at,
        a.updated_at,
        j.title AS job_title,
        j.company_id,
        j.category_id,
        j.job_type,
        j.experience_level,
        j.location_type,
        j.status AS job_status
      FROM applications a
      JOIN jobs j
        ON a.job_id = j.id
    `,
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async getApplicationById(id) {
    const cacheKey = `application:${id}`;

    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return {
        fromCache: true,
        data: JSON.parse(cachedData),
      };
    }

    const query = {
      text: `
        SELECT *
        FROM applications
        WHERE id = $1
      `,
      values: [id],
    };

    const result = await this.pool.query(query);

    const application = result.rows[0];

    if (application) {
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(application));
    }

    return {
      fromCache: false,
      data: application,
    };
  }

  async getApplicationsByUserId(user_id) {
    const cacheKey = `applications:user:${user_id}`;

    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return {
        fromCache: true,
        data: JSON.parse(cachedData),
      };
    }

    const query = {
      text: `
      SELECT *
      FROM applications
      WHERE user_id = $1
    `,
      values: [user_id],
    };

    const result = await this.pool.query(query);

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(result.rows));

    return {
      fromCache: false,
      data: result.rows,
    };
  }

  async getApplicationsByJobId(job_id) {
    const cacheKey = `applications:job:${job_id}`;

    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return {
        fromCache: true,
        data: JSON.parse(cachedData),
      };
    }

    const query = {
      text: `
      SELECT *
      FROM applications
      WHERE job_id = $1
    `,
      values: [job_id],
    };

    const result = await this.pool.query(query);

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(result.rows));

    return {
      fromCache: false,
      data: result.rows,
    };
  }

  async updateApplication(id, { status }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: `
        UPDATE applications
        SET
          status = $1,
          updated_at = $2
        WHERE id = $3
        RETURNING id,
                  user_id,
                  job_id
      `,
      values: [status, updatedAt, id],
    };

    const result = await this.pool.query(query);

    if (result.rows.length > 0) {
      await redisClient.del(`application:${id}`);

      await redisClient.del(`applications:user:${result.rows[0].user_id}`);

      await redisClient.del(`applications:job:${result.rows[0].job_id}`);
    }

    return result.rows[0];
  }

  async deleteApplication(id) {
    const query = {
      text: `
        DELETE FROM applications
        WHERE id = $1
        RETURNING id,
                  user_id,
                  job_id
      `,
      values: [id],
    };

    const result = await this.pool.query(query);

    if (result.rows.length > 0) {
      await redisClient.del(`application:${id}`);

      await redisClient.del(`applications:user:${result.rows[0].user_id}`);

      await redisClient.del(`applications:job:${result.rows[0].job_id}`);
    }

    return result.rows[0];
  }

  async saveDocument(application_id, file_name) {
    const id = nanoid(16);

    const query = {
      text: `
        INSERT INTO documents
        (
          id,
          application_id,
          file_name
        )
        VALUES
        (
          $1,
          $2,
          $3
        )
        RETURNING id
      `,
      values: [id, application_id, file_name],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }
}

export default new ApplicationRepositories();
