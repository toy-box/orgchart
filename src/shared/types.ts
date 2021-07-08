import { getType } from '@toy-box/toybox-shared'
export * from '@toy-box/toybox-shared'

export const isType =
  <T>(type: string | string[]) =>
    (obj: unknown): obj is T =>
      obj != null &&
      (Array.isArray(type) ? type : [type]).some(
        (t) => getType(obj) === `[object ${t}]`
      )

export const isWindow = isType<Window>('Window')

