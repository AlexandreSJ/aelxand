import { useSyncExternalStore } from 'react'
import { CAREER_START, yearsSince } from '../lib/years'

const noop = () => () => {}

/**
 * Whole years since the career start. Pre-rendered HTML carries the value at
 * build time; after hydration the browser's own date takes over, so the count
 * rolls over on 17 Feb even when the site has not been rebuilt since.
 */
export function useYears(): number {
  return useSyncExternalStore(
    noop,
    () => yearsSince(CAREER_START, new Date()),
    () => yearsSince(CAREER_START, new Date(__BUILD_TIME__)),
  )
}
