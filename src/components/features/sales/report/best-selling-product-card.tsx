import Link from "next/link"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { BestSellingProduct } from "@/lib/sales/types"
import { formatSalesMetric } from "@/lib/sales/format"

type BestSellingProductCardProps = {
  products: BestSellingProduct[]
}

export function BestSellingProductCard({ products }: BestSellingProductCardProps) {
  return (
    <Card size="sm" className="shadow-xs">
      <CardHeader className="border-border border-b pb-4">
        <CardTitle>Best Selling Product</CardTitle>
        <CardAction>
          <Link
            href="/inventory"
            className="text-primary text-sm font-medium hover:underline"
          >
            See All
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-4">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Product</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Remaining Quantity</TableHead>
              <TableHead className="text-right">Turn Over</TableHead>
              <TableHead className="text-right">Increase By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.productId}>
                <TableCell className="font-medium">{p.product}</TableCell>
                <TableCell className="tabular-nums">{p.productId}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{p.remainingQty}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatSalesMetric(p.turnOver)}
                </TableCell>
                <TableCell className="text-right font-medium text-emerald-600 tabular-nums">
                  {p.increasePercent.toLocaleString("id-ID", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                  %
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
