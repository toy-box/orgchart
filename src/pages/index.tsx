import React from 'react'
import { OrgCanvas } from '../components/org-canvas'
import { Engine } from '../models'
import { EngineContext } from '../shared/context'

const engine = new Engine({})

export default function Index() {
  return (
    <div>
      <EngineContext.Provider value={engine}>
        <OrgCanvas />
      </EngineContext.Provider>
    </div>
  )
}
