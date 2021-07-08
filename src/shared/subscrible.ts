import { isFn } from '@toy-box/toybox-shared'

const UNSUBSCRIBE_ID_SYMBOL = Symbol('UNSUBSCRIBE_ID_SYMBOL')

/**
 * 订阅回调方法
 */
export interface ISubscriber<Payload = any> {
  (payload: Payload): void
}

type unsubscribeType = (() => void) & {
  [UNSUBSCRIBE_ID_SYMBOL]?: number | string
}

export class Subscrible<ExtendsType = any> {
  private subscribers: {
    index: number
    [key: number]: ISubscriber
  } = { index: 0 }

  dispatch<T extends ExtendsType>(event: T, context?: any) {
    for (const key in this.subscribers) {
      if (isFn(this.subscribers[key])) {
        (event as any)['context'] = context
        this.subscribers[key](event)
      }
    }
  }

  subscribe(subscriber: ISubscriber) {
    let id = this.subscribers.index + 1
    if (isFn(subscriber)) {
      this.subscribers[id] = subscriber
      this.subscribers.index ++
    }

    const unsubscribe = () => {
      this.unsubscribe(id)
    }

    unsubscribe[UNSUBSCRIBE_ID_SYMBOL] = id

    return unsubscribe
  }

  unsubscribe = (id?: number | string | unsubscribeType) => {
    if (id === undefined || id === null) {
      for (const key in this.subscribers) {
        this.unsubscribe(key)
      }
      return
    }
    if (!isFn(id)) {
      delete this.subscribers[id]
    } else {
      delete this.subscribers[id[UNSUBSCRIBE_ID_SYMBOL]]
    }
  }
}
