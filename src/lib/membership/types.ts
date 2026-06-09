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
