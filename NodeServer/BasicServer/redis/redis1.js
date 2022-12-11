const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1');

// client.get('myKey', (err, value) => {
//   console.log(value);
// });

async function run(){
    await client.connect()
}

run();

async function getVal(key){
    const item = await client.lRange(key, 0, -1);
    console.log(item);
    client.disconnect();
}

getVal("myKey");
