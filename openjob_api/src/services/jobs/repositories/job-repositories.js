import { Pool } from "pg";
import { nanoid } from "nanoid";

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
        INSERT INTO jobs (
          id,
          title,
          description,
          job_type,
          experience_level,
          location_type,
          location_city,
          salary_min,
          salary_max,
          is_salary_visible,
          status,
          company_id,
          category_id,
          created_at,
          updated_at
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15
        )
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
    let index = 1;

    if (title) {
      conditions.push(`LOWER(j.title) LIKE $${index++}`);
      values.push(`%${title.toLowerCase()}%`);
    }

    if (company_name) {
      conditions.push(`LOWER(c.name) LIKE $${index++}`);
      values.push(`%${company_name.toLowerCase()}%`);
    }

    const where =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    const query = {
      text: `
        SELECT
          j.id,
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
          j.category_id
        FROM jobs j
        JOIN companies c
          ON c.id = j.company_id
        ${where}
      `,
      values,
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getJobsByCompanyId(companyId) {
    const query = {
      text: `
        SELECT
          id,
          title,
          description,
          job_type,
          experience_level,
          location_type,
          location_city,
          salary_min,
          salary_max,
          is_salary_visible,
          status,
          company_id,
          category_id
        FROM jobs
        WHERE company_id = $1
      `,
      values: [companyId],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getJobByCategoryId(categoryId) {
    const query = {
      text: `
        SELECT
          id,
          title,
          description,
          job_type,
          experience_level,
          location_type,
          location_city,
          salary_min,
          salary_max,
          is_salary_visible,
          status,
          company_id,
          category_id
        FROM jobs
        WHERE category_id = $1
      `,
      values: [categoryId],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getJobById(id) {
    const query = {
      text: `
        SELECT
          id,
          title,
          description,
          job_type,
          experience_level,
          location_type,
          location_city,
          salary_min,
          salary_max,
          is_salary_visible,
          status,
          company_id,
          category_id
        FROM jobs
        WHERE id = $1
      `,
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getJobByTitle(title) {
    const query = {
      text: `
        SELECT
          id,
          title,
          description,
          job_type,
          experience_level,
          location_type,
          location_city,
          salary_min,
          salary_max,
          is_salary_visible,
          status,
          company_id,
          category_id
        FROM jobs
        WHERE title ILIKE $1
      `,
      values: [`${title}%`],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async updateJob(id, fields) {
    const updatedAt = new Date().toISOString();

    const columnMap = {
      title: "title",
      description: "description",
      job_type: "job_type",
      experience_level: "experience_level",
      location_type: "location_type",
      location_city: "location_city",
      salary_min: "salary_min",
      salary_max: "salary_max",
      is_salary_visible: "is_salary_visible",
      status: "status",
      company_id: "company_id",
      category_id: "category_id",
    };

    const setClauses = [];
    const values = [];
    let index = 1;

    for (const [key, column] of Object.entries(columnMap)) {
      if (fields[key] !== undefined) {
        setClauses.push(`${column} = $${index++}`);
        values.push(fields[key]);
      }
    }

    if (setClauses.length === 0) {
      return null;
    }

    setClauses.push(`updated_at = $${index++}`);
    values.push(updatedAt);

    values.push(id);

    const query = {
      text: `
        UPDATE jobs
        SET ${setClauses.join(", ")}
        WHERE id = $${index}
        RETURNING id
      `,
      values,
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async deleteJob(id) {
    const query = {
      text: `
        DELETE FROM jobs
        WHERE id = $1
        RETURNING id
      `,
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }
}

export default new JobRepositories();