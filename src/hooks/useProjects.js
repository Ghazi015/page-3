import { useEffect, useState } from 'react'
import { fetchProjects } from '../data/mock'

export function useProjects() {
  const [state, setState] = useState({ status: 'loading', data: [], error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setState((previous) => ({ ...previous, status: 'loading', error: null }))
    fetchProjects({ signal: controller.signal, attempt })
      .then((data) => setState({ status: 'success', data, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ status: 'error', data: [], error: error.message })
      })
    return () => controller.abort()
  }, [attempt])

  return { ...state, retry: () => setAttempt((value) => value + 1) }
}
