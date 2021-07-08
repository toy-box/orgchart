import { useContext } from 'react'
import { EngineContext } from '../shared/context'

export const useEngine = () => {
  const engine = useContext(EngineContext)
  if (!engine) {
    throw new Error('Can not found orgChart instance from context.')
  }
  return engine
}
