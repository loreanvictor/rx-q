/* eslint-disable @typescript-eslint/no-shadow */
import test from 'tape'
import { take } from 'rxjs/operators'

import { KeyedQueue } from '../keyed-q'


test('KeyedQueue', test => {
  test.test('should provide separate queues for each key.', test => {
    const Q = new KeyedQueue<string>(x => x[0])
    const r1: any[] = []
    const r2: any[] = []
    const r3: any[] = []
    const r4: any[] = []

    Q.for('a').pipe(take(2)).subscribe(v => r1.push(v))
    Q.for('b').pipe(take(3)).subscribe(v => r2.push(v))
    Q.for('a').pipe(take(3)).subscribe(v => r3.push(v))
    Q.for('b').pipe(take(1)).subscribe(v => r4.push(v))

    Q.next('and')
    Q.next('ant')
    Q.next('xavier')
    Q.next('ankle')
    Q.next('angle')
    Q.next('angel')
    Q.next('antwerp')
    Q.next('bar')
    Q.next('beer')
    Q.next('boran')
    Q.next('borat')
    Q.next('boris')

    test.deepEquals(r1, ['and', 'ant'])
    test.deepEquals(r2, ['bar', 'beer', 'boran'])
    test.deepEquals(r3, ['ankle', 'angle', 'angel'])
    test.deepEquals(r4, ['borat'])

    test.end()
  })

  test.test('it should notify all queued observers when source errors.', test => {
    const Q = new KeyedQueue<string>(x => x[0])

    const _Err = {}

    Q.for('a').subscribe(() => {}, () => {})
    Q.for('a').subscribe({
      next: () => test.fail('should not have called this handler'),
      error: err => {
        test.equals(err, _Err)
        test.end()
      }
    })

    Q.next('asphalt')
    Q.error(_Err)
  })

  test.test('it should notify all queued observers when source completes.', test => {
    const Q = new KeyedQueue<string>(x => x[0])


    Q.for('a').subscribe(() => {}, () => {})
    Q.for('a').subscribe({
      next: () => test.fail('should not have called this handler'),
      complete: () => test.end()
    })

    Q.next('asphalt')
    Q.complete()
  })
})
