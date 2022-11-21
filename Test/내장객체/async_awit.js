const fs = require('fs').promises;

async function main(){
    let data = await fs.readFile('./readme2.txt');
    console.log('1번', data.toString());
    data = await fs.readFile('./readme2.txt');
    console.log('2번', data.toString());
    data = await fs.readFile('./readme2.txt');
    console.log('3번', data.toString());
}
main();