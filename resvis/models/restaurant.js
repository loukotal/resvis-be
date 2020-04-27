'use strict';
module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define('Restaurant', {
    name: DataTypes.STRING,
    rating: DataTypes.DECIMAL,
  }, {});
  Restaurant.associate = function(models) {
    // associations can be defined here
    Restaurant.belongsTo(models.User)
    Restaurant.hasMany(models.Visit)
  };
  return Restaurant;
};