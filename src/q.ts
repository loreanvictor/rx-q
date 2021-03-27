import { Observable, Observer, Subscription } from 'rxjs'


export function queue<T>(src: Observable<T>) {
  const Q: Observer<T>[] = []
  let sub: Subscription

  return new Observable<T>(observer => {
    if (Q.length === 0) {
      sub = src.subscribe({
        next: v => {
          while(Q[0] && Q[0].closed) {
            Q.shift()
          }

          if (Q[0]) {
            Q[0].next(v)
          } else {
            sub.unsubscribe()
          }
        },
        error: err => Q.forEach(o => o.error(err)),
        complete: () => Q.forEach(o => o.complete()),
      })
    }

    Q.push(observer)
  })
}
