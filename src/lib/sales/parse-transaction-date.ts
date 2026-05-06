/** Parse string tanggal dari kolom mock `transactionAt` */
export function parseTransactionAtDisplay(s: string): Date {
  const [datePart, timePart] = s.split(/\s+/)
  const [y, m, d] = datePart.split("/").map(Number)
  const [hh, mm, ss] = timePart.split(":").map(Number)
  return new Date(y, m - 1, d, hh, mm, ss)
}
