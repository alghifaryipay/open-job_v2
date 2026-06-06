/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('jobs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },

    title: {
      type: 'TEXT',
      notNull: true,
    },

    description: {
      type: 'TEXT',
      notNull: true,
    },

    job_type: {
      type: 'VARCHAR(20)',
      notNull: true,
    },

    experience_level: {
      type: 'VARCHAR(20)',
      notNull: true,
    },

    location_type: {
      type: 'VARCHAR(20)',
      notNull: true,
    },

    location_city: {
      type: 'TEXT',
    },

    salary_min: {
      type: 'INTEGER',
    },

    salary_max: {
      type: 'INTEGER',
    },

    is_salary_visible: {
      type: 'BOOLEAN',
      default: true,
    },

    status: {
      type: 'VARCHAR(20)',
      notNull: true,
    },

    company_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'companies(id)',
      onDelete: 'CASCADE',
    },

    category_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'categories(id)',
      onDelete: 'CASCADE',
    },

    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
    },

    updated_at: {
      type: 'TIMESTAMP',
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('jobs');
};
