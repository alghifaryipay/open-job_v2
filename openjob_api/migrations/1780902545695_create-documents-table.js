export const up = (pgm) => {
  pgm.createTable('documents', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },

    application_id: {
      type: 'varchar(50)',
      notNull: true,
    },

    file_name: {
      type: 'text',
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('documents');
};