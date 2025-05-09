module.exports = {
  async up(queryInterface, Sequelize) {
    const items = [{
      "quantity": 4,
      "categoryId": 3,
      "brandId": 3
    }];

    items.forEach(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
    });

    await queryInterface.bulkInsert('Products', items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};