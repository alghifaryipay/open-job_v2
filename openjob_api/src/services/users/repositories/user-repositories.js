import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import redisClient from '../../../utils/redis.js';

class UserRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async createUser({ name, email, password, role}) {
    const id = nanoid(16);
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date().toDateString();
    const updatedAt = new Date().toDateString();

    const query = {
      text: 'INSERT INTO users (id, name, email, password, role, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, name, email, hashedPassword, role, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getUserById(id) {
    const cacheKey = `users:${id}`;
    
    // Cek Redis Cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return {
        fromCache: true,
        data: JSON.parse(cachedData),
      };
    }

    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };
    
    const result = await this.pool.query(query);
    const user = result.rows[0];

    if (user) {
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(user));
    }

    return {
      fromCache: false,
      data: user,
    };
  }

  async verifyNewEmail(email) {
    const query = {
      text: 'SELECT email FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async verifyUserCredential(email, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this.pool.query(query);

    if (result.rows.length == 0) {
      return null;
    }

    const { id, password: hashedPassword } = result.rows[0];
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordMatch) return null;

    return id;
  }
}

export default new UserRepositories();