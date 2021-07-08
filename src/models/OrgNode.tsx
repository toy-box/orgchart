import React from 'react'
import {
  batch,
  define,
  observable,
} from '@formily/reactive'
import { uid } from '@formily/shared'
import { Node } from '@antv/x6'
import { OrgChart } from './OrgChart'
import { OrgNodeCom } from '../components/org-node'
import { OrgEdge } from './OrgEdge'

const OrgNodes = new Map<string, OrgNode>()

const removeNode = (node: OrgNode) => {
  if (node.parent) {
    node.parent.children = node.parent.children.filter(
      (child) => child !== node
    )
  }
}

const resetNodesParent = (nodes: OrgNode[], parent: OrgNode) => {
  const newNodes = nodes.map(node => {
    if (node.parent) {
      node.parent.children = node.parent.children.filter(child => child.id !== node.id)
    }
    node.parent = parent
    if (!OrgNodes.has(node.id)) {
      OrgNodes.set(node.id, node)
    }
    return node
  })
  parent.children = parent.children.concat(...newNodes)
  return newNodes
}

export interface INodeProps {
  x: number
  y: number
  width: number
  height: number
  label: string
}

export interface IOrgNode {
  id?: string
  name: string
  type: string
  selectable?: boolean
  parent?: IOrgNode
  root?: IOrgNode
  contentProps?: Record<string, any>
}

export class OrgNode {
  id: string
  name: string
  type: string
  selectable?: boolean
  children: OrgNode[] = []
  parent?: OrgNode
  root: OrgNode
  mounted?: boolean
  visible?: boolean
  x: number
  y: number
  orgChart: OrgChart
  contentProps?: Record<string, any>

  constructor(node: IOrgNode, parent?: OrgNode, orgChart?: OrgChart) {
    this.id = node.id || uid()
    this.name = node.name
    this.type = node.type
    this.selectable = node.selectable
    this.parent = parent
    this.root = parent?.root || this
    this.orgChart = orgChart || this.root.orgChart
    this.contentProps = node.contentProps
    this.mounted = false
    this.visible = false
    OrgNodes.set(this.id, this)
    this.makeObservable()
  }

  protected makeObservable() {
    define(this, {
      id: observable.ref,
      name: observable.ref,
      type: observable.ref,
      selectable: observable.ref,
      contentProps: observable.deep,
      x: observable.ref,
      y: observable.ref,
      nodeMeta: observable.computed,
      setPostion: batch,
      appendNodes: batch,
      mount: batch,
    })
  }

  get nodeMeta() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      shape: 'react-shape',
      component(node: Node) {
        return <OrgNodeCom name={node.id} />
      },
    }
  }

  mount() {
    if (!this.mounted) {
      this.orgChart.mountNode(this)
      this.mounted = true
    }
  }

  appendNodes(nodes: IOrgNode[]) {
    nodes.forEach((child) => {
      const newNode = new OrgNode(child, this)
      this.children.push(newNode)
      this.orgChart.appendNode(newNode)
      this.orgChart.appendEdge(new OrgEdge({
        source: this.id,
        target: newNode.id,
      }, this.orgChart))
    })
  }

  addChildren(nodes: OrgNode[]) {
    this.children.concat(...nodes.filter(n => this.children.some(child => child === n)))
  }

  setPostion(x: number, y: number) {
    this.x = x
    this.y = y
    console.log('pos', this.x, this.y)
    this.orgChart.setNodePosition(this)
  }

  contains(...nodes: OrgNode[]) {
    return nodes.some((node) => node === this)
  }


  remove() {
    removeNode(this)
  }

  resetParent(parent: OrgNode) {
    resetNodesParent([this], parent)
  }
}