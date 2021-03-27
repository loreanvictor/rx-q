# Queued Observables

```bash
npm i queued-observable
```

[![tests](https://img.shields.io/github/workflow/status/loreanvictor/rx-q/Test%20and%20Report%20Coverage?label=tests&logo=mocha&logoColor=green&style=flat-square)](https://github.com/loreanvictor/rx-q/actions?query=workflow%3A%22Test+and+Report+Coverage%22)
[![coverage](https://img.shields.io/codecov/c/github/loreanvictor/rx-q?logo=codecov&style=flat-square)](https://codecov.io/gh/loreanvictor/rx-q)
[![version](https://img.shields.io/npm/v/queued-observable?logo=npm&style=flat-square)](https://www.npmjs.com/package/queued-observable)

<br><br>

An [Observable](https://rxjs-dev.firebaseapp.com/guide/observable) typically sends data to all its observers simultaenously: 

```js
import { Subject } from 'rxjs'
import { take } from 'rxjs/operators'

const source = new Subject()

source.pipe(take(2)).subscribe(v => console.log('A: ' + v))
source.pipe(take(3)).subscribe(v => console.log('B: ' + v))

source.next(1)
source.next(2)
source.next(3)
source.next(4)

// A: 1, B: 1
// A: 2, B: 2
// B: 3
```

A _queued observable_ will put its observers in a queue and only send data to the first one until it unsubscribes:

```js
import { queue } from 'queued-observable'

const queued = queue(source)

ququed.pipe(take(2)).subscribe(v => console.log('A: ' + v))
queued.pipe(take(3)).subscribe(v => console.log('B: ' + v))

source.next(1)
source.next(2)
source.next(3)
source.next(4)

// A: 1
// A: 2
// B: 3
// B: 4
```

<br>

## Keyed Queue

If you want to partition incoming data based on some _key_ and then form queues for each key (instead of one for the whole
observable), then use `KeyedQueue` utility:

```ts
import { KeyedQueue } from 'queued-observable'

const queue = new KeyedQueue<string>(x => x[0])

queue.for('a').pipe(take(2)).subscribe(v => console.log('1: ' + v))
queue.for('a').pipe(take(3)).subscribe(v => console.log('2: ' + v))
queue.for('b').pipe(take(2)).subscribe(v => console.log('3: ' + v))

queue.next('alice')
queue.next('bob')
queue.next('amy')
queue.next('ben')
queue.next('anna')

// 1: alice
// 3: bob
// 1: amy
// 3: ben
// 2: anna
```

`KeyedQueue` is an `Observer`, so you can subscribe it to any other observable. The `.for()` method will provide a queued observable for a particular
key.
