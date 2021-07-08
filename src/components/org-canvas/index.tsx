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
    }])
    console.log('nodes', orgChart.nodes[0])
    orgChart.nodes[0].appendNodes([{
      id: '124',
      name: '124',
      type: 'node',
    }, {
      id: '125',
      name: '125',
      type: 'node',
    }])
  }, [])

  return <div id="org-canvas" style={style}></div>
}