export type MembershipTier = "regular" | "silver" | "gold"

export type MemberStatus = "active" | "inactive"

export type Member = {
  id: string
  name: string
  phone: string
  email: string
  tier: MembershipTier
  points: number
  status: MemberStatus
  address?: string
  avatarUrl?: string | null
}

export const MEMBERSHIP_TIER_LABELS: Record<MembershipTier, string> = {
  regular: "Regular",
  silver: "Silver",
  gold: "Gold",
}

export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  active: "Aktif",
  inactive: "Nonaktif",
}

export const MOCK_MEMBERS: Member[] = [
  {
    id: "m-001",
    name: "Dewi Lestari",
    phone: "+62 812-9012-3344",
    email: "dewi.lestari@email.com",
    tier: "gold",
    points: 12_450,
    status: "active",
    address: "Jl. Merdeka No. 12, Bandung",
    avatarUrl: null,
  },
  {
    id: "m-002",
    name: "Budi Santoso",
    phone: "+62 878-2233-4455",
    email: "budi.s@email.com",
    tier: "silver",
    points: 6_200,
    status: "active",
    address: "Perumahan Hijau Blok C/4",
    avatarUrl: null,
  },
  {
    id: "m-003",
    name: "Siti Nurhaliza",
    phone: "+62 821-5566-7788",
    email: "siti.n@email.com",
    tier: "regular",
    points: 890,
    status: "active",
    avatarUrl: null,
  },
  {
    id: "m-004",
    name: "Andi Pratama",
    phone: "+62 813-3344-5566",
    email: "andi.pratama@email.com",
    tier: "silver",
    points: 4_100,
    status: "inactive",
    avatarUrl: null,
  },
  {
    id: "m-005",
    name: "Rina Wijaya",
    phone: "+62 857-9900-1122",
    email: "rina.w@email.com",
    tier: "gold",
    points: 18_900,
    status: "active",
    address: "Jl. Sudirman Kav. 88",
    avatarUrl: null,
  },
  {
    id: "m-006",
    name: "Hendra Gunawan",
    phone: "+62 822-6677-8899",
    email: "hendra.g@email.com",
    tier: "regular",
    points: 320,
    status: "active",
    avatarUrl: null,
  },
  {
    id: "m-007",
    name: "Maya Kartika",
    phone: "+62 858-4455-6677",
    email: "maya.k@email.com",
    tier: "regular",
    points: 150,
    status: "inactive",
    avatarUrl: null,
  },
  {
    id: "m-008",
    name: "Fajar Nugroho",
    phone: "+62 819-7788-9900",
    email: "fajar.n@email.com",
    tier: "gold",
    points: 9_750,
    status: "active",
    avatarUrl: null,
  },
]

export type MemberTierFilter = "all" | MembershipTier

export function filterMembers(
  members: Member[],
  search: string,
  tier: MemberTierFilter
): Member[] {
  const q = search.trim().toLowerCase()
  return members.filter((m) => {
    const tierOk = tier === "all" || m.tier === tier
    if (!tierOk) return false
    if (!q) return true
    return (
      m.name.toLowerCase().includes(q) ||
      m.phone.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q)
    )
  })
}

export type MemberFormState = {
  name: string
  phone: string
  email: string
  tier: MembershipTier
  points: string
  address: string
  status: MemberStatus
}

export function emptyMemberForm(): MemberFormState {
  return {
    name: "",
    phone: "",
    email: "",
    tier: "regular",
    points: "0",
    address: "",
    status: "active",
  }
}

export function memberToFormState(m: Member): MemberFormState {
  return {
    name: m.name,
    phone: m.phone,
    email: m.email,
    tier: m.tier,
    points: String(m.points),
    address: m.address ?? "",
    status: m.status,
  }
}
