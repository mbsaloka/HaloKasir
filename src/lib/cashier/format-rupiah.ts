/** Format angka ke string Rupiah (mock UI, tanpa locale backend) */
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatRupiahCompact(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`
}
