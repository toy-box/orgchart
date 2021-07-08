import {
  batch,
  define,
  observable,
} from '@formily/reactive'
import { uid } from '@formily/shared'
import { OrgChart } from './OrgChart'
import { OrgNode } from './OrgNode'

export interface IOrgEdge {
  source: string
  target: string
}


export class OrgEdge {
  id: string
  orgChart: OrgChart
  source: OrgNode
  target: OrgNode
  mounted?: boolean
  constructor(props: IOrgEdge, orgChart: OrgChart) {
    this.id = uid()
    this.orgChart = orgChart
    this.source = this.orgChart.getNodeById(props.source)
    this.target = this.orgChart.getNodeById(props.target)
    this.mounted = false
  }

  protected makeObservable() {
    define(this, {
      id: observable.ref,
      orgChart: observable.ref,
      source: observable.ref,
      target: observable.ref,
      sourceId: observable.computed,
      targetId: observable.computed,
    })
  }

  get sourceId() {
    return this.source.id
  }

  get targetId() {
    return this.target.id
  }

  mount() {
    if (!this.mounted) {
      this.orgChart.mountEdge(this)
      this.mounted = true
    }
  }
}