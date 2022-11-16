console.log(this);  // this는 전역 객체

console.log(this === module.exports)  // module.exports === this === {}

function a() {
    console.log(this === global);       // 함수 내부에서 this는 global
}
a();