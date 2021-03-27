# Queue Operators for RxJS Observables

[![tests](https://img.shields.io/github/workflow/status/loreanvictor/rx-q/Test%20and%20Report%20Coverage?label=tests&logo=mocha&logoColor=green&style=flat-square)](https://github.com/loreanvictor/rx-q/actions?query=workflow%3A%22Test+and+Report+Coverage%22)
[![coverage](https://img.shields.io/codecov/c/github/loreanvictor/rx-q?logo=codecov&style=flat-square)](https://codecov.io/gh/loreanvictor/rx-q)
[![version](https://img.shields.io/npm/v/rx-queue-operator?logo=npm&style=flat-square)](https://www.npmjs.com/package/rx-queue-operator)


```bash
npm i rx-queue-operator
```

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

A _queued observable_, on the other hand, will put its observers in a queue and only send data to the first one until it unsubscribes:

```js
import { queue } from 'rx-queue-operator'

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
