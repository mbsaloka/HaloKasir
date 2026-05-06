/** Data statis untuk UI dashboard (mock) */

export const MOCK_USER_NAME = "Christo"

export const MOCK_WELCOME_DATE = "05 Mei 2026"

export const MOCK_REVENUE_TODAY = "Rp1.000.000.000,00"

export type MemberRow = {
  id: string
  name: string
  points: number
}

export const MOCK_TOP_MEMBERS: MemberRow[] = [
  { id: "0089686010824", name: "Saloka Cooper", points: 1500 },
  { id: "0089686010825", name: "Warren Dwinanda", points: 1400 },
  { id: "0089686010826", name: "Member A", points: 1350 },
  { id: "0089686010827", name: "Member B", points: 1200 },
  { id: "0089686010828", name: "Member C", points: 1100 },
]

export type TransactionRow = {
  dateLabel: string
  memberName: string
  memberId: string
  amountLabel: string
}

export const MOCK_RECENT_TRANSACTIONS: TransactionRow[] = [
  {
    dateLabel: "05 Mei 2024, 14:22",
    memberName: "Member X",
    memberId: "0089686010824",
    amountLabel: "+ Rp10.500",
  },
  {
    dateLabel: "05 Mei 2024, 13:10",
    memberName: "Walk-in",
    memberId: "—",
    amountLabel: "+ Rp125.000",
  },
  {
    dateLabel: "05 Mei 2024, 11:45",
    memberName: "Saloka Cooper",
    memberId: "0089686010824",
    amountLabel: "+ Rp44.000",
  },
  {
    dateLabel: "04 Mei 2024, 18:02",
    memberName: "Member Y",
    memberId: "0089686010999",
    amountLabel: "+ Rp8.750",
  },
  {
    dateLabel: "04 Mei 2024, 16:30",
    memberName: "Warren Dwinanda",
    memberId: "0089686010825",
    amountLabel: "+ Rp210.000",
  },
]
