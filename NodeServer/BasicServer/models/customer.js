module.exports = (sequelize, DataTypes) => {
  const newCustomer = sequelize.define("new_customer", {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sex: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    joined_date: {
      type: 'TIMESTAMP',
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
  }, {
    timestamps: false    // createdAt, updatedAt 열을 추가할지 여부 지정 
  });
  return newCustomer;
};