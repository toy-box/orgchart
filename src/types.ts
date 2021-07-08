import { IEventProps } from './shared/event'

export type AnyFunction = (...args: any[]) => any

export enum LifeCycleTypes {
  ON_ORG_CHART_INIT = 'onOrgChartInit',
  ON_ORG_CHART_MOUNT = 'onOrgChartMount',
  ON_ORG_CHART_UNMOUNT = 'onOrgChartUnmount',
  ON_ORG_CHART_EDITABLE = 'onOrgChartEditable',

  ON_NODES_APPEND = 'onNodesAppend',
}

export type LifeCycleHandler<T> = (payload: T, context: any) => void

export type LifeCyclePayload<T> = (
  params: {
    type: string
    payload: T
  },
  context: any
) => void


export type IEngineProps<T = Event> = IEventProps<T> & {
}