const {sequelize} = require('./models');

const driver = () => {
    sequelize.sync()
        .then(() => {
            console.log("초기화 완료");
        })
        .catch((error) => {
            console.log("초기화 실패");
            console.error(error);
        });
};

driver();