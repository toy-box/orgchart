import { uid } from '@toy-box/toybox-shared'
import { IEngineProps } from '../types'
import { EventBus } from '../shared/event'
import { OrgChart } from './OrgChart'


/**
 * 设计器引擎
 */
export class Engine extends EventBus {
  id: string

  props: IEngineProps<EventBus>

  orgChart: OrgChart

  constructor(props: IEngineProps<EventBus>) {
    super(props)
    this.props = props
    this.id = uid()
    this.orgChart = new OrgChart(this)
  }

  mount() {
    this.attachEvents(window)
  }

  unmount() {
    this.destroy()
  }
}
