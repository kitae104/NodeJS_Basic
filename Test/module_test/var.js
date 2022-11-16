const odd = "홀수 입니다.";
const even = "짝수 입니다.";

exports.odd = odd;          // 각각을 export 하기
exports.even = even;

module.exports = {          // module.exports 를 사용하면 위의 표현을 사용할 수 없음.
    odd,
    even,
};