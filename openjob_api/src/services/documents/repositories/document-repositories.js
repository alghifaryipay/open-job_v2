import { Pool } from "pg";
import { nanoid } from "nanoid";

class DocumentRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async createDocument(application_id, file_name) {
    const id = nanoid(16);

    const query = {
      text: `
        INSERT INTO documents (id, application_id, file_name)
        VALUES ($1, $2, $3)
        RETURNING id, application_id, file_name
      `,
      values: [id, application_id, file_name],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getAllDocuments() {
    const query = {
      text: `SELECT * FROM documents`,
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getDocumentById(id) {
    const query = {
      text: `SELECT * FROM documents WHERE id = $1`,
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async deleteDocument(id) {
    const query = {
      text: `DELETE FROM documents WHERE id = $1 RETURNING id, file_name`,
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }
}

export default new DocumentRepositories();