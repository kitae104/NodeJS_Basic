module.exports = (sequelize, DataTypes) => {
  const newPurchase = sequelize.define('new_purchase', {
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    book_name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    purchase_date: {
      type: 'TIMESTAMP',
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
  }, {
    freezeTableName: true,  // 모델명을 단수, 테이블을 복수로 만드는데 복수로 만들지 않을 때 true
    timestamps: false
  });
};