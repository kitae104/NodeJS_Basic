const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const min = 2;
let primes = [];

function findPrimes(start, range) {
    let isPrime = true;
    const end = start + range;
    for (let i = start; i < end; i++) {
        for (let j = min; j < Math.sqrt(end); j++) {
            if (i !== j && i % j === 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) {
            primes.push(i);
        }
        isPrime = true;
    }
}

if (isMainThread) {
    const max = 10_000_000;
    const threadCount = 8;          // 스레스 수
    const threads = new Set();      // 집합으로 생성
    const range = Math.floor((max - min) / threadCount);
    let start = min;
    console.time('prime');
    for (let i = 0; i < threadCount - 1; i++) {
        const wStart = start;
        threads.add(new Worker(__filename, { workerData: { start: wStart, range } }));          // 스레드 추가
        start += range;
    }
    threads.add(new Worker(__filename, { workerData: { start, range: max - start } }));
    for (let worker of threads) {
        worker.on('error', (err) => {                   // 에러가 발생한 경우 처리
            throw err;
        });
        worker.on('exit', () => {
            threads.delete(worker);                     // 스레드 제거
            if (threads.size === 0) {
                console.timeEnd('prime');
                console.log(primes.length);
            }
        });
        worker.on('message', (msg) => {
            primes = primes.concat(msg);
        });
    }
} else {
    findPrimes(workerData.start, workerData.range);
    parentPort.postMessage(primes);
}
