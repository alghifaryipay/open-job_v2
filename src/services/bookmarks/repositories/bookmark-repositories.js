import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class BookmarkRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async createBookmark({ user_id, job_id }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const query = {
      text: 'INSERT INTO bookmarks (id, user_id, job_id, created_at) VALUES ($1, $2, $3, $4) RETURNING id',
      values: [id, user_id, job_id, createdAt],
    };
    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getBookmarksByUserId(user_id) {
    const query = {
      text: 'SELECT * FROM bookmarks WHERE user_id = $1',
      values: [user_id],
    };
    const result = await this.pool.query(query);
    return result.rows;
  }

  async getBookmarkById(id) {
    const query = {
      text: 'SELECT * FROM bookmarks WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async deleteBookmarkByJobId({ user_id, job_id }) {
    const query = {
      text: 'DELETE FROM bookmarks WHERE user_id = $1 AND job_id = $2 RETURNING id',
      values: [user_id, job_id],
    };
    const result = await this.pool.query(query);
    return result.rows[0];
  }
}

export default new BookmarkRepositories();
