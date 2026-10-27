import { expect, it } from 'vitest'
import { yearMonth } from './month'

it('formats ISO timestamps as year.month without locale data', () => {
  expect(yearMonth('2026-10-25T13:00:00Z')).toBe('2026.10')
})
