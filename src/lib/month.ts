/** "2026-10-25T…" -> "2026.10": catalog-style, identical on server and client in every locale. */
export const yearMonth = (iso: string) => iso.slice(0, 7).replace('-', '.')
