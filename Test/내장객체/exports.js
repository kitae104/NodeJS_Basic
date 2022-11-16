const {} = require('../module_test/var');

function checkOddOrEven(number) {
    if(number % 2){
        return odd;
    } else {
        return even;
    }
}

module.exports = checkOddOrEven;    // 하나만 모듈로 ㅁ나들때
