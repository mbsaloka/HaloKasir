export type UserProfile = {
  displayName: string
  username: string
  passwordDisplay: string
  email: string
  phone: string
  role: string
  address: string
  avatarSrc: string | null
}

export type AccountHistoryAction = "LOG IN" | "CREATE" | "DELETE" | "UPDATE"

export type AccountHistoryRow = {
  id: string
  at: string
  router: string
  description: string
  action: AccountHistoryAction
}

export const ACCOUNT_HISTORY_PAGE_SIZES = [10, 25, 50] as const
