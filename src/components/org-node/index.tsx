import React, { FC } from 'react'
import './styles'

export interface IOrgNodeProps {
  name: string
}

export const OrgNodeCom: FC<IOrgNodeProps> = ({ name }) => {
  return <div className="org-chart-node">
    {name}
  </div>
}