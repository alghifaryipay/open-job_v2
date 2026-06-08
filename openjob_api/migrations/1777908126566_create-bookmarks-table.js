export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('bookmarks', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    job_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'jobs(id)',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('bookmarks');
};
