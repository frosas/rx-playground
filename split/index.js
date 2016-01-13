const fs = require('fs');
const Rx = require('rx');
const RxNode = require('rx-node');

const SEPARATOR = {};

const split$ = (data$, separator) => {
    const chunks$ = 
        // 'a\nb' -- 'c\nd'
        data$.
        // → 'a' -- SEPARATOR -- 'b' -- 'c' -- SEPARATOR -- 'd'
        concatMap(datum => {
            return Rx.Observable.from(String(datum).split(separator)).
                concatMap((chunk, i) => (i ? [SEPARATOR] : []).concat(chunk));
        }).
        share();
    return chunks$.
        // → 'a' -- 'b' -- 'c' -- 'd'
        filter(chunk => chunk !== SEPARATOR).
        // → ['a'] -- ['b', 'c'] -- ['d']
        buffer(chunks$.filter(chunk => chunk === SEPARATOR)).
        // → 'a' -- 'bc' -- 'd'
        map(lineChunks => lineChunks.join(''));
};

const file = process.argv[2];
RxNode.fromReadableStream(fs.createReadStream(file)).
    let(data$ => split$(data$, '\n')).
    subscribe(line => console.log(`> ${line}`));
