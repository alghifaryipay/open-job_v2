import pkg from 'pg';
import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class CategoryRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async createCategory(name) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO categories VALUES($1, $2, $3, $4) returning id',
      values: [id, name, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getCategories() {
    const query = {
      text: 'SELECT * FROM categories',
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getCategoryById(id) {
    const query = {
      text: 'SELECT * FROM categories WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async editCategory({ id, name }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE categories SET name = $1, updated_at = $2 WHERE id = $3 RETURNING id',
      values: [name, updatedAt, id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async deleteCategory(id) {
    const query = {
      text: 'DELETE FROM categories WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }
}

export default new CategoryRepositories();
