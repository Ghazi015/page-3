import { useEffect, useRef, useState } from 'react'
import { createInquiry } from '../data/mock'

export function useInquiry() {
  const [state, setState] = useState({ status: 'idle', error: null, result: null })
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])
  const submit = async (payload) => {
    setState({ status: 'submitting', error: null, result: null })
    try {
      const result = await createInquiry(payload)
      if (mounted.current) setState({ status: 'success', error: null, result })
    } catch (error) {
      if (mounted.current) setState({ status: 'error', error: error.message, result: null })
    }
  }
  return { ...state, submit, reset: () => setState({ status: 'idle', error: null, result: null }), mounted }
}
