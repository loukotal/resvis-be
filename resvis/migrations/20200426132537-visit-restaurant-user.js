'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   return Promise.all([
     queryInterface.addColumn(
       "Visits",
       "UserId",
       {
         type: Sequelize.INTEGER,
         references: {
           model: "Users",
           key: "id"
         },
         onUpdate: "CASCADE",
         onDelete: "CASCADE"
       }
     ),
     queryInterface.addColumn(
      "Visits",
      "RestaurantId",
      {
        type: Sequelize.INTEGER,
        references: {
          model: "Restaurants",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      }
    )
   ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   return Promise.all([
     queryInterface.removeColumn(
       "Visits",
       "UserId"
     ),
     queryInterface.removeColumn(
      "Visits",
      "RestaurantId"
    )
   ])
  }
};
