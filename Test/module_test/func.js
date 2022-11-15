const {odd, even} = require('./var');
//import {odd, even} from './var';
console.log(odd, even);

function checkOddOrEven(number) {
    if(number % 2){
        return odd;
    } else {
        return even;
    }
}

module.exports = checkOddOrEven;
//export default checkOddOrEven;
