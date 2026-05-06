"use client"

import { PencilIcon, Trash2Icon } from "lucide-react"

import { MemberAvatar } from "@/components/features/membership/shared/member-avatar"
import { MembershipBadge } from "@/components/features/membership/shared/membership-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import {
  MEMBER_STATUS_LABELS,
  type Member,
} from "@/lib/membership/mock-data"

export type MemberTableRowProps = {
  member: Member
  onEdit: (member: Member) => void
  onDelete: (member: Member) => void
}

export function MemberTableRow({
  member,
  onEdit,
  onDelete,
}: MemberTableRowProps) {
  return (
    <TableRow>
      <TableCell className="min-w-[200px]">
        <div className="flex items-center gap-3">
          <MemberAvatar name={member.name} src={member.avatarUrl} />
          <span className="font-medium text-foreground">{member.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">{member.phone}</TableCell>
      <TableCell className="text-muted-foreground">{member.email}</TableCell>
      <TableCell>
        <MembershipBadge tier={member.tier} />
      </TableCell>
      <TableCell className="tabular-nums font-medium">
        {member.points.toLocaleString("id-ID")}
      </TableCell>
      <TableCell>
        <Badge
          variant={member.status === "active" ? "secondary" : "outline"}
          className={
            member.status === "active"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100"
              : "text-muted-foreground"
          }
        >
          {MEMBER_STATUS_LABELS[member.status]}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(member)}
            aria-label={`Ubah ${member.name}`}
          >
            <PencilIcon className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(member)}
            aria-label={`Hapus ${member.name}`}
          >
            <Trash2Icon className="size-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
