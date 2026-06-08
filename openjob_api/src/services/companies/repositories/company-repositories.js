import pkg from 'pg';
import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class CompanyRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async createCompany({ name, location, description }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO companies VALUES($1, $2, $3, $4, $5, $6) returning id',
      values: [id, name, location, description, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async getCompanies() {
    const query = {
      text: 'SELECT * FROM companies',
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getCompanyById(id) {
    const query = {
      text: 'SELECT * FROM companies WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async editCompany({ id, name, description, location }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE companies SET name = $2, description = $3, location = $4, updated_at = $5 WHERE id = $1 RETURNING id, name, description, location, created_at, updated_at',
      values: [id, name, description, location, updatedAt],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async deleteCompany(id) {
    const query = {
      text: 'DELETE FROM companies WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

 
}

export default new CompanyRepositories();
