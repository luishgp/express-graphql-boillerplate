export const Migration = {
  up(queryInterface: any, Sequelize: any) {
    return queryInterface.createTable('todo', {
      id: Sequelize.DataType.INT,
      text: Sequelize.DataType.STRING,
    });
  },
  down(queryInterface: any, Sequelize: any) {
    return queryInterface.dropTable('todo');
  },
};
