import { Pool } from "pg";
import { nanoid } from "nanoid";

class BookmarkRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async createBookmark({ user_id, job_id }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const query = {
      text: "INSERT INTO bookmarks (id, user_id, job_id, created_at) VALUES ($1, $2, $3, $4) RETURNING id",
      values: [id, user_id, job_id, createdAt],
    };
    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getBookmarksByUserId(user_id) {
    const query = {
      text: `
      SELECT
        b.id,
        b.user_id,
        b.job_id,
        b.created_at,

        j.title,
        j.description,
        j.job_type,
        j.experience_level,
        j.location_type,
        j.location_city,
        j.salary_min,
        j.salary_max,
        j.is_salary_visible,
        j.status,
        j.company_id,
        j.category_id,

        c.name AS company_name,
        j.created_at AS job_created_at

      FROM bookmarks b
      JOIN jobs j
        ON b.job_id = j.id
      JOIN companies c
        ON j.company_id = c.id

      WHERE b.user_id = $1
    `,
      values: [user_id],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async getBookmarkById(id) {
    const query = {
      text: "SELECT * FROM bookmarks WHERE id = $1",
      values: [id],
    };
    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async deleteBookmarkByJobId({ user_id, job_id }) {
    const query = {
      text: "DELETE FROM bookmarks WHERE user_id = $1 AND job_id = $2 RETURNING id",
      values: [user_id, job_id],
    };
    const result = await this.pool.query(query);
    return result.rows[0];
  }
}

export default new BookmarkRepositories();
