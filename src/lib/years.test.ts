import { describe, expect, it } from 'vitest'
import { CAREER_START, yearsSince } from './years'

const at = (y: number, m: number, d: number) => new Date(y, m - 1, d, 12)

describe('yearsSince', () => {
  it('starts on 17 Feb 2022', () => {
    expect(CAREER_START).toEqual({ y: 2022, m: 2, d: 17 })
  })
  it('rolls over exactly on the 17th of February', () => {
    expect(yearsSince(CAREER_START, at(2026, 2, 16))).toBe(3)
    expect(yearsSince(CAREER_START, at(2026, 2, 17))).toBe(4)
  })
  it('counts whole years only', () => {
    expect(yearsSince(CAREER_START, at(2026, 10, 27))).toBe(4)
    expect(yearsSince(CAREER_START, at(2022, 2, 17))).toBe(0)
  })
  it('never goes negative', () => {
    expect(yearsSince(CAREER_START, at(2021, 1, 1))).toBe(0)
  })
})
