import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ProductTableRow } from "@/components/features/inventory/table/product-table-row"
import type { InventoryProduct } from "@/lib/inventory/mock-data"

type InventoryTableProps = {
  products: InventoryProduct[]
  onEdit: (product: InventoryProduct) => void
  onDelete: (product: InventoryProduct) => void
}

export function InventoryTable({
  products,
  onEdit,
  onDelete,
}: InventoryTableProps) {
  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[72px]">Gambar</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>ID Item</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Stok</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell
                className="text-muted-foreground p-8 text-center"
                colSpan={8}
              >
                Tidak ada barang yang cocok dengan filter.
              </TableCell>
            </TableRow>
          ) : (
            products.map((p) => (
              <ProductTableRow
                key={p.id}
                product={p}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
