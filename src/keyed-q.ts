import { Observable, Observer } from 'rxjs'


export class KeyedQueue<T> implements Observer<T> {
  closed = false
  queue: {[key: string]: Observer<T>[]} = {}

  constructor(readonly key: (value: T) => string) { }

  for(key: string) {
    return new Observable<T>(observer => {
      (this.queue[key] || (this.queue[key] = [])).push(observer)
    })
  }

  next(value: T) {
    const key = this.key(value)
    if (this.queue[key]) {
      const queue = this.queue[key]
      while (queue[0] && queue[0].closed) {
        queue.shift()
      }

      if (queue[0]) {
        queue[0].next(value)
      } else {
        delete this.queue[key]
      }
    }
  }

  error(err: any) {
    this.closed = true
    Object.values(this.queue).forEach(queue => queue.forEach(observer => observer.error(err)))
  }

  complete() {
    this.closed = true
    Object.values(this.queue).forEach(queue => queue.forEach(observer => observer.complete()))
  }
}
