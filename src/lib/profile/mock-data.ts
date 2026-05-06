/** Mock profil & riwayat akun — tanpa backend */

export type UserProfile = {
  displayName: string
  username: string
  passwordDisplay: string
  email: string
  phone: string
  role: string
  address: string
  /** URL gambar custom (mock) atau null = pakai avatar deterministik */
  avatarSrc: string | null
}

export const MOCK_USER_PROFILE: UserProfile = {
  displayName: "Christoforus Indra",
  username: "cchristo_",
  passwordDisplay: "christo1234",
  email: "christoforus@gmail.com",
  phone: "081234567890",
  role: "Kasir",
  address: "Jl. Sudirman No. 1, Jakarta",
  avatarSrc: null,
}

export type AccountHistoryAction = "LOG IN" | "CREATE" | "DELETE" | "UPDATE"

export type AccountHistoryRow = {
  id: string
  at: string
  router: string
  description: string
  action: AccountHistoryAction
}

export const MOCK_ACCOUNT_HISTORY: AccountHistoryRow[] = Array.from(
  { length: 48 },
  (_, i) => {
    const actions: AccountHistoryAction[] = [
      "LOG IN",
      "CREATE",
      "DELETE",
      "UPDATE",
    ]
    const desc = [
      "User masuk ke sistem",
      "User melakukan transaksi",
      "User menghapus data pelanggan",
      "User mengubah stok barang",
    ]
    const routers = ["Kasir", "Penjualan", "Pelanggan", "Persediaan"]
    return {
      id: `log-${i}`,
      at: `2024/02/04 ${String(10 + (i % 8)).padStart(2, "0")}:${String(i % 60).padStart(2, "0")}:00`,
      router: routers[i % routers.length],
      description: desc[i % desc.length],
      action: actions[i % actions.length],
    }
  }
)

export const ACCOUNT_HISTORY_PAGE_SIZES = [10, 25, 50] as const
