import { useEffect, useState } from 'react'

export function usePersistentState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    const fromStorage = localStorage.getItem(key)
    if (!fromStorage) return initial
    try {
      return JSON.parse(fromStorage) as T
    } catch {
      return initial
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState] as const
}
