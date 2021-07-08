import { Edge, Graph, Node } from '@antv/x6'
import dagre from 'dagre'
import {
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
  }

  protected makeObservable() {
    define(this, {
      initialized: observable.ref,
      mounted: observable.ref,
      unmounted: observable.ref,
      editable: observable.ref,
      nodes: observable.shallow,
      appendRootNodes: batch,
      appendChildNode: batch,
      appendNode: batch,
      setNodePosition: batch,
      setNodeVisble: batch,
      mountNode: batch,
      setEdgeVertices: batch,
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

  addGraphEdge = (edge: Edge) => {
    this.graph.unfreeze()
    this.graph.addEdge(edge)
    this.graph.freeze()
  }

  resetGraphEdge = (edge: Edge) => {
    this.graph.unfreeze()
    this.graph.removeEdge(edge.id)
    this.graph.addEdge(edge)
    this.graph.freeze()
  }

  setNodePosition = (node: OrgNode) => {
    const nodeInGraph = this.graph.getCellById(node.id)
    if (nodeInGraph) {
      this.graph.unfreeze()
      nodeInGraph.isNode() && (nodeInGraph as Node).setPosition(node.x, node.y)
      this.graph.freeze()
    } else {
      this.addGraphNode(node.nodeMeta)
    }
  }

  setNodeVisble = (node: OrgNode) => {
    this.graph.unfreeze()
    const nodeInGraph = this.graph.getCellById(node.id)
    if (nodeInGraph && nodeInGraph.isNode()) {
      (nodeInGraph as Node).setVisible(node.visible)
    }
    this.graph.freeze()
  }

  setEdgeVertices = (edge: Edge, source: OrgNode, target: OrgNode) => {
    const gap = target.y - source.y - source.height
    edge.setVertices([
      {
        x: source.x + source.width / 2,
        y: source.y + source.height + gap / 2,
      },
      {
        x: target.x + target.width / 2,
        y: source.y + source.height + gap / 2,
      }
    ])
    if (!this.graph.getCellById(edge.id)) {
      this.addGraphEdge(edge)
    } else {
      this.resetGraphEdge(edge)
    }
  }

  mountNode = (node: OrgNode) => {
    this.dg.setNode(node.id, { width: 120, height: 180 })
    dagre.layout(this.dg)
    this.dg.nodes().forEach(id => {
      const node = this.nodes.find(n => n.id === id)
      const pos = this.dg.node(id)
      node.setPostion(pos.x, pos.y)
    })
    this.dg.edges().forEach(edge => {
      const orgEdge = this.edges.find(e => e.sourceId === edge.v && e.targetId === edge.w)
      const source = this.getNodeById(orgEdge.sourceId)
      const target = this.getNodeById(orgEdge.targetId)
      const graphEdge = this.graph.getCellById(orgEdge.id)
      graphEdge?.isEdge() && this.setEdgeVertices(graphEdge, source, target)
    })
  }

  appendRootNodes = (nodes: IOrgNode[]) => {
    nodes.forEach(node => {
      this.appendNode(new OrgNode(node, undefined, this))
    })
  }

  appendNode = (node: OrgNode) => {
    if (!this.nodes.some(n => n === node)) {
      this.nodes.push(node)
      this.dg.setNode(node.id, { width: node.width, height: node.height })
      this.layout()
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

  // appendEdge = (edge: OrgEdge) => {
  //   if (!this.edges.some(e => e === edge)) {
  //     this.edges.push(edge)
  //     edge.mount()
  //   }
  // }

  appendChildNode = (child: OrgNode, parent: OrgNode,) => {
    if (!this.nodes.some(n => n === child)) {
      this.nodes.push(child)
      const edge = new OrgEdge({
        source: parent.id,
        target: child.id
      }, this)
      this.edges.push(edge)
      this.dg.setNode(child.id, { width: child.width, height: child.height })
      this.dg.setEdge(edge.sourceId, edge.targetId, { id: edge.id })
      this.layout()
    }
  }

  layout = () => {
    dagre.layout(this.dg)
    this.dg.nodes().forEach(id => {
      const node = this.nodes.find(n => n.id === id)
      console.log('id', id, this.dg.nodes())
      const pos = this.dg.node(id)
      node.setPostion(pos.x, pos.y)
    })
    this.dg.edges().forEach(dgEdge => {
      const edge = this.edges.find(e => e.sourceId === dgEdge.v && e.targetId === dgEdge.w)
      if (!edge.mounted) {
        const graphEdge = this.graph.createEdge({
          id: edge.id,
          shape: 'org-edge',
          source: { cell: edge.sourceId },
          target: { cell: edge.targetId },
        })
        this.setEdgeVertices(graphEdge, edge.source, edge.target)
      } else {
        const graphEdge = this.graph.getCellById(edge.id)
        graphEdge?.isEdge() && this.setEdgeVertices(graphEdge, edge.source, edge.target)
      }
    })
  }

  getNodeById = (id: string) => {
    return this.nodes.find(node => node.id === id)
  }

  getEdgeById = (id: string) => {
    return this.edges.find(edge => edge.id === id)
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
