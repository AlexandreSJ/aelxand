import { useState, useEffect, useRef } from 'react'

export function useTypewriter(text: string, speed = 50, delay = 0) {
  const [displayed, setDisplayed] = useState(text)
  const [done, setDone] = useState(true)
  const prevTextRef = useRef(text)

  useEffect(() => {
    // If text changed (language switch), show instantly — no animation glitch
    if (prevTextRef.current !== text) {
      setDisplayed(text)
      setDone(true)
      prevTextRef.current = text
      return
    }

    // Initial mount — animate
    setDisplayed('')
    setDone(false)
    let i = 0
    let cancelled = false

    const timeout = setTimeout(() => {
      if (cancelled) return
      const interval = setInterval(() => {
        if (cancelled) return
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1))
          i++
        } else {
          setDone(true)
          clearInterval(interval)
        }
      }, speed)
      // Store for cleanup
      return () => clearInterval(interval)
    }, delay)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [text, speed, delay])

  return { displayed, done }
}
