import { Edge, Graph, Node } from '@antv/x6'
import dagre from 'dagre'
import {
  action,
  batch,
  define,
  observable,
} from '@formily/reactive'
import { Engine } from './Engine'
import { Heart } from './Heart'
import { OrgEdge } from './OrgEdge'
import { IOrgNode, OrgNode } from './OrgNode'
import { LifeCycleTypes } from '../types'


export interface IOrgChart {
  rootNodes?: IOrgNode[]
}

export class OrgChart {
  engine: Engine
  graph?: Graph
  dg: dagre.graphlib.Graph
  initialized: boolean
  mounted: boolean
  unmounted: boolean
  editable: boolean
  heart: Heart
  rootNodes: OrgNode[] = []
  disposers: (() => void)[] = []
  nodes: OrgNode[] = []
  edges: OrgEdge[] = []

  constructor(engine: Engine) {
    this.engine = engine
    this.initialized = false
    this.mounted = false
    this.unmounted = false
    this.editable = false
    this.heart = new Heart({ lifecycles: [], context: this })
    this.dg = new dagre.graphlib.Graph()
    this.dg.setGraph({ rankdir: 'TB', nodesep: 16, ranksep: 32 })
    this.dg.setDefaultEdgeLabel(() => ({}))
  }

  protected makeObservable() {
    define(this, {
      initialized: observable.ref,
      mounted: observable.ref,
      unmounted: observable.ref,
      editable: observable.ref,
      nodes: observable.shallow,
      appendRootNodes: batch,
      setNodePosition: batch,
      setNodeVisble: batch,
      mountNode: batch,
      appendNode: batch,
      setGraph: batch,
      notify: batch,
    })
  }

  addGraphNode = (node: Node.Metadata) => {
    this.graph.unfreeze()
    this.graph.addNode(node)
    this.graph.freeze()
  }

  addGraphNodes = (nodes: (Node<Node.Properties> | Node.Metadata)[]) => {
    this.graph.unfreeze()
    this.graph.addNodes(nodes)
    this.graph.freeze()
  }

  addGraphEdge = (edge: OrgEdge) => {
    // this.graph.unfreeze()
    // const graphEdge = this.graph.createEdge({
    //   shape: 'org-edge',
    //   source: { cell: edge.sourceId },
    //   target: { cell: edge.targetId },
    // })
    // this.graph.addEdge(graphEdge)
    // this.graph.freeze()
  }

  setNodePosition = (node: OrgNode) => {
    this.graph.unfreeze()
    const nodeInGraph = this.graph.getCellById(node.id)
    if (nodeInGraph) {
      nodeInGraph.isNode() && (nodeInGraph as Node).setPosition(node.x, node.y)
    } else {
      this.addGraphNode(node.nodeMeta)
    }
    this.graph.freeze()
  }

  setNodeVisble = (node: OrgNode) => {
    this.graph.unfreeze()
    const nodeInGraph = this.graph.getCellById(node.id)
    if (nodeInGraph && nodeInGraph.isNode()) {
      (nodeInGraph as Node).setVisible(node.visible)
    }
    this.graph.freeze()
  }

  mountNode = (node: OrgNode) => {
    console.log('mount node')
    this.dg.setNode(node.id, { width: 120, height: 180 })
    dagre.layout(this.dg)
    console.log('layout ed')
    this.dg.nodes().forEach(id => {
      const node = this.nodes.find(n => n.id === id)
      const pos = this.dg.node(id)
      node.setPostion(pos.x, pos.y)
    })
  }

  mountEdge = (edge: OrgEdge) => {
    this.dg.setEdge(edge.sourceId, edge.targetId)
    this.addGraphEdge(edge)
  }

  appendRootNodes = (nodes: IOrgNode[]) => {
    nodes.forEach(node => {
      this.appendNode(new OrgNode(node, undefined, this))
    })
  }

  appendNode = (node: OrgNode) => {
    if (!this.nodes.some(n => n === node)) {
      this.nodes.push(node)
      !node.mounted && node.mount()
    }
  }

  appendNodes = (nodes: OrgNode[]) => {
    nodes.forEach((node) => {
      if (!this.nodes.some(n => n === node)) {
        this.nodes.push(node)
        !node.mounted && node.mount()
      }
    })
  }

  appendEdge = (edge: OrgEdge) => {
    if (!this.edges.some(e => e === edge)) {
      this.edges.push(edge)
      edge.mount()
    }
  }

  layout = () => {
    // TODO:
  }

  getNodeById = (id: string) => {
    return this.nodes.find(node => node.id === id)
  }

  setGraph = (graph: Graph) => {
    this.graph = graph
    this.onMount()
  }

  notify = (type: string, payload?: any) => {
    this.heart.publish(type, payload ? payload : this)
  }

  /** hooks **/
  onInit = () => {
    this.initialized = true
    this.notify(LifeCycleTypes.ON_ORG_CHART_INIT)
  }

  onMount = () => {
    this.mounted = true
    this.notify(LifeCycleTypes.ON_ORG_CHART_MOUNT)
  }

  onEditable = () => {
    this.editable = true
    this.notify(LifeCycleTypes.ON_ORG_CHART_EDITABLE)
  }
}
