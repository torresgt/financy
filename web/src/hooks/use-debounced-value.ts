import { useEffect, useState } from 'react'

/** Retorna `value` somente depois de `delay` ms sem mudanças (ex.: campo de busca). */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debounced
}
