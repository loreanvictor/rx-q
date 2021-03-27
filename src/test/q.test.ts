/* eslint-disable @typescript-eslint/no-shadow */
import test from 'tape'
import { Subject } from 'rxjs'
import { take } from 'rxjs/operators'

import { queue } from '../q'


test('queue()', test => {
  test.test('it should serve observers one by one.', test => {
    const src = new Subject()
    const r1: any[] = []
    const r2: any[] = []
    const r3: any[] = []

    const queued = src.pipe(queue)
    queued.pipe(take(2)).subscribe(v => r1.push(v))
    queued.pipe(take(3)).subscribe(v => r2.push(v))
    queued.pipe(take(2)).subscribe(v => r3.push(v))

    src.next(1)
    src.next(2)
    src.next(3)
    src.next(4)
    src.next(5)
    src.next(6)
    src.next(7)
    src.next(8)

    test.deepEquals(r1, [1, 2])
    test.deepEquals(r2, [3, 4, 5])
    test.deepEquals(r3, [6, 7])

    test.end()
  })

  test.test('it should notify all queued observers when source errors.', test => {
    const src = new Subject()
    const queued = queue(src)

    const _Err = {}

    queued.subscribe(() => {}, () => {})
    queued.subscribe({
      next: () => test.fail('should not have called this handler'),
      error: err => {
        test.equals(err, _Err)
        test.end()
      }
    })

    src.next(1)
    src.error(_Err)
  })

  test.test('it should notify all queued observers when source completes.', test => {
    const src = new Subject()
    const queued = queue(src)

    queued.subscribe(() => {}, () => {})
    queued.subscribe({
      next: () => test.fail('should not have called this handler'),
      complete: () => test.end()
    })

    src.next(1)
    src.complete()
  })
})
