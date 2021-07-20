import React, { CSSProperties, FC, useCallback } from 'react'
import { observer } from '@formily/reactive-react'
import { uid } from '@toy-box/toybox-shared'
import { OrgNode } from '../../models'
import './styles'

export interface IOrgNodeProps {
  name: string
  orgNode: OrgNode
}

export const OrgNodeContainer: FC<IOrgNodeProps> = observer(({ name, orgNode }) => {
  const style: CSSProperties = {
    width: '120px',
    height: '180px',
    background: 'lightblue',
    textAlign: 'center',
  }
  const append = useCallback(() => {
    const id = uid()
    orgNode.appendNodes([{
      id,
      name: id,
      type: 'node'
    }])
  }, [orgNode])
  return <div className="org-chart-node" style={style}>
    {name}
    <button onClick={append}>add</button>
  </div>
})