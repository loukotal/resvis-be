'use strict';
module.exports = (sequelize, DataTypes) => {
  const Visit = sequelize.define('Visit', {
    rating: DataTypes.DECIMAL,
    review: DataTypes.TEXT,
  }, {});
  Visit.associate = function(models) {
    // associations can be defined here
    Visit.belongsTo(models.Restaurant)
    Visit.belongsTo(models.User)
  };
  return Visit;
};