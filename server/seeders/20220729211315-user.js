"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    

    await queryInterface.bulkInsert(
      "users",
      [
        {
          email: "admin@gmail.com",
          password:
            "$2b$10$CRs2Au70twz6vZGSdY0UlujFnDn7NCrbgUfW5ZUsZnn7GgKvXtP42",
          fullname: "admin",
          status: "admin",
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    
  },
};