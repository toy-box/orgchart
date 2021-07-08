import { uid } from '@toy-box/toybox-shared'
import { IEngineProps } from '../types'
import { EventBus } from '../shared/event'
import { OrgChart } from './OrgChart'


/**
 * 设计器引擎
 */
export class Engine extends EventBus {
  id: string

  props: IEngineProps<Engine>

  orgChart: OrgChart

  constructor(props: IEngineProps<Engine>) {
    super(props)
    this.props = props
    this.init()
    this.id = uid()
  }

  init() {
    this.orgChart = new OrgChart(this)
  }

  mount() {
    this.attachEvents(window)
  }

  unmount() {
    this.destroy()
  }
}
