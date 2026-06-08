import pkg from 'pg';
import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import redisClient from '../../../utils/redis.js'; // Wajib import redisClient

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
    // 1. Cek apakah data ada di cache Redis
    const cachedCompany = await redisClient.get(`companies:${id}`);
    
    if (cachedCompany) {
      // 2. Jika ada, kembalikan data dari cache beserta flag fromCache = true
      return {
        data: JSON.parse(cachedCompany),
        fromCache: true,
      };
    }

    // 3. Jika tidak ada di cache, kueri ke Database
    const query = {
      text: 'SELECT * FROM companies WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);
    const companyData = result.rows[0];

    if (companyData) {
      // 4. Syarat Advanced: Simpan ke Redis dengan masa berlaku 1 jam (3600 detik)
      await redisClient.setEx(`companies:${id}`, 3600, JSON.stringify(companyData));
    }

    // Kembalikan data dari DB dengan flag fromCache = false
    return {
      data: companyData,
      fromCache: false,
    };
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