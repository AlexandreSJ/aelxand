export type Ymd = { y: number; m: number; d: number }

/** First day working as a developer. The site shows whole years as "N+". */
export const CAREER_START: Ymd = { y: 2022, m: 2, d: 17 }

/** Whole years elapsed, rolling over on the anniversary day in the viewer's calendar. */
export function yearsSince(start: Ymd, now: Date): number {
  const beforeAnniversary = now.getMonth() + 1 < start.m || (now.getMonth() + 1 === start.m && now.getDate() < start.d)
  return Math.max(0, now.getFullYear() - start.y - (beforeAnniversary ? 1 : 0))
}
