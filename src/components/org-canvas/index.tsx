import { useEffect } from 'react'
import { Graph } from '@antv/x6'
import '@antv/x6-react-shape'
import { useOrgChart } from '../../hooks/useOrgChart'
import { OrgNode } from '../../models/OrgNode'


Graph.registerEdge(
  'org-edge',
  {
    zIndex: -1,
    attrs: {
      line: {
        stroke: '#cfcfcf',
        strokeWidth: 3,
        sourceMarker: null,
        targetMarker: null,
      },
    },
  },
  true,
)

export interface IOrgCanvasProps {
  node: OrgNode
}

export const OrgCanvas = () => {
  const orgChart = useOrgChart()
  const style = {
    width: '1240px',
    height: '960px',
  }

  useEffect(() => {
    const graph = new Graph({
      container: document.getElementById('org-canvas') || undefined,
      scroller: {
        enabled: true,
        pannable: true,
      },
      grid: true,
      background: {
        color: '#fafafa'
      },
      frozen: true
    })
    orgChart.setGraph(graph)
    orgChart.appendRootNodes([{
      id: '123',
      name: '123',
      type: 'node',
    }, {
      id: '122',
      name: '122',
      type: 'node',
    }])
    // orgChart.nodes[0].appendNodes([{
    //   id: '124',
    //   name: '124',
    //   type: 'node',
    // }, {
    //   id: '125',
    //   name: '125',
    //   type: 'node',
    // }, {
    //   id: '126',
    //   name: '126',
    //   type: 'node',
    // }, {
    //   id: '127',
    //   name: '127',
    //   type: 'node',
    // }, {
    //   id: '128',
    //   name: '128',
    //   type: 'node',
    // }])
    // orgChart.nodes[1].appendNodes([{
    //   id: '224',
    //   name: '224',
    //   type: 'node',
    // }, {
    //   id: '225',
    //   name: '225',
    //   type: 'node',
    // }, {
    //   id: '226',
    //   name: '226',
    //   type: 'node',
    // }, {
    //   id: '227',
    //   name: '227',
    //   type: 'node',
    // }, {
    //   id: '228',
    //   name: '228',
    //   type: 'node',
    // }])
  }, [orgChart])

  return <div id="org-canvas" style={style}></div>
}