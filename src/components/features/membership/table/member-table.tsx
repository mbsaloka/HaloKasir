"use client"

import { MemberTableRow } from "@/components/features/membership/table/member-table-row"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Member } from "@/lib/membership/types"

export type MemberTableProps = {
  members: Member[]
  onEdit: (member: Member) => void
  onDelete: (member: Member) => void
}

export function MemberTable({ members, onEdit, onDelete }: MemberTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Nama</TableHead>
          <TableHead>Telepon</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Keanggotaan</TableHead>
          <TableHead>Poin</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={7}
              className="text-muted-foreground h-24 text-center text-sm"
            >
              Tidak ada anggota yang cocok dengan filter.
            </TableCell>
          </TableRow>
        ) : (
          members.map((m) => (
            <MemberTableRow
              key={m.id}
              member={m}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </TableBody>
    </Table>
  )
}
