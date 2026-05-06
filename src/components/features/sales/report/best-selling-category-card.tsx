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
import type { BestSellingCategory } from "@/lib/sales/mock-data"
import { formatSalesMetric } from "@/lib/sales/format"

type BestSellingCategoryCardProps = {
  categories: BestSellingCategory[]
}

export function BestSellingCategoryCard({
  categories,
}: BestSellingCategoryCardProps) {
  return (
    <Card size="sm" className="shadow-xs">
      <CardHeader className="border-border border-b pb-4">
        <CardTitle>Best Selling Category</CardTitle>
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
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Turn Over</TableHead>
              <TableHead className="text-right">Increase By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.category}>
                <TableCell className="font-medium">{c.category}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatSalesMetric(c.turnOver)}
                </TableCell>
                <TableCell className="text-right font-medium text-emerald-600 tabular-nums">
                  {c.increasePercent.toLocaleString("id-ID", {
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
