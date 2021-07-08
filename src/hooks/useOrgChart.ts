import { useEngine } from './useEngine'

export const useOrgChart = () => {
  const engine = useEngine()
  return engine.orgChart
}
