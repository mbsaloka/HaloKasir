import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatRupiah } from "@/lib/cashier/format-rupiah"
import type { SalesTransaction } from "@/lib/sales/types"

type TransactionTableProps = {
  rows: SalesTransaction[]
}

/** Tabel riwayat — kolom mengikuti Figma */
export function TransactionTable({ rows }: TransactionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>ID Transaksi</TableHead>
          <TableHead>Tanggal Transaksi</TableHead>
          <TableHead>ID Pelanggan</TableHead>
          <TableHead>Kasir</TableHead>
          <TableHead>Metode Pembayaran</TableHead>
          <TableHead className="text-right">Subtotal</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-medium tabular-nums">{row.id}</TableCell>
            <TableCell className="tabular-nums">{row.transactionAt}</TableCell>
            <TableCell className="tabular-nums">{row.customerId}</TableCell>
            <TableCell>{row.cashier}</TableCell>
            <TableCell>{row.paymentMethod}</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatRupiah(row.subtotal)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
