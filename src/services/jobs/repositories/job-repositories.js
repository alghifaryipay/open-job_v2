import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class JobRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async createJob({
    title,
    description,
    jobType,
    experienceLevel,
    locationType,
    locationCity,
    salaryMin,
    salaryMax,
    isSalaryVisible,
    status,
    companyId,
    categoryId,
  }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    const query = {
      text: `
      INSERT INTO jobs(
        id, title, description, job_type, experience_level,
        location_type, location_city, salary_min, salary_max,
        is_salary_visible, status, company_id, category_id,
        created_at, updated_at
      )
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING id
    `,
      values: [
        id,
        title,
        description,
        jobType,
        experienceLevel,
        locationType,
        locationCity,
        salaryMin,
        salaryMax,
        isSalaryVisible,
        status,
        companyId,
        categoryId,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getJobs({ title, company_name } = {}) {
    const conditions = [];
    const values = [];
    let i = 1;

    if (title) { conditions.push(`LOWER(j.title) LIKE $${i++}`); values.push(`%${title.toLowerCase()}%`); }
    if (company_name) { conditions.push(`LOWER(c.name) LIKE $${i++}`); values.push(`%${company_name.toLowerCase()}%`); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = {
      text: `SELECT j.*, c.name AS company_name FROM jobs j JOIN companies c ON j.company_id = c.id ${where}`,
      values,
    };
    const result = await this.pool.query(query);
    return result.rows;
  }

  async getJobsByCompanyId(companyId) {
    const query = {
      text: 'SELECT * FROM jobs WHERE company_id = $1',
      values: [companyId],
    };
    const result = await this.pool.query(query);
    return result.rows;
  }

  async getJobByCategoryId(categoryId) {
    const query = {
      text: 'SELECT * FROM jobs WHERE category_id = $1',
      values: [categoryId],
    };
    const result = await this.pool.query(query);
    return result.rows;
  }

  async getJobById(id) {
    const query = {
      text: 'SELECT * FROM jobs WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getJobByTItle(title) {
    const query = {
      text: 'SELECT * FROM jobs WHERE title ILIKE $1',
      values: [`${title}%`],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async updateJob(id, fields) {
    const updatedAt = new Date().toISOString();

    const columnMap = {
      jobType: 'job_type',
      experienceLevel: 'experience_level',
      locationType: 'location_type',
      locationCity: 'location_city',
      salaryMin: 'salary_min',
      salaryMax: 'salary_max',
      isSalaryVisible: 'is_salary_visible',
      companyId: 'company_id',
      categoryId: 'category_id',
      title: 'title',
      description: 'description',
      status: 'status',
    };

    const setClauses = [];
    const values = [];
    let i = 1;

    for (const [key, col] of Object.entries(columnMap)) {
      if (fields[key] !== undefined) {
        setClauses.push(`${col} = $${i++}`);
        values.push(fields[key]);
      }
    }

    setClauses.push(`updated_at = $${i++}`);
    values.push(updatedAt);
    values.push(id);

    const query = {
      text: `UPDATE jobs SET ${setClauses.join(', ')} WHERE id = $${i} RETURNING id`,
      values,
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async deleteJob(id) {
    const query = {
      text: 'DELETE FROM jobs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }
}

export default new JobRepositories();
