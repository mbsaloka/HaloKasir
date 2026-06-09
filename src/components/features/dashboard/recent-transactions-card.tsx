import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { TransactionRow } from "@/lib/dashboard/types"

type RecentTransactionsCardProps = {
  transactions: TransactionRow[]
}

export function RecentTransactionsCard({
  transactions,
}: RecentTransactionsCardProps) {
  return (
    <Card className="flex h-full flex-col shadow-sm lg:min-h-[520px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Transaksi Terkini
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {transactions.map((tx, i) => (
          <div
            key={`${tx.memberId}-${i}`}
            className="border-border bg-card rounded-lg border px-4 py-3 shadow-xs"
          >
            <p className="text-muted-foreground text-xs">{tx.dateLabel}</p>
            <div className="mt-2 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{tx.memberName}</p>
                <p className="text-muted-foreground text-xs">{tx.memberId}</p>
              </div>
              <p className="text-emerald-600 shrink-0 text-sm font-semibold tabular-nums">
                {tx.amountLabel}
              </p>
            </div>
          </div>
        ))}
        {transactions.length === 0 ? (
          <p className="text-muted-foreground py-12 text-center text-sm">
            Belum ada transaksi.
          </p>
        ) : null}
      </CardContent>
      <CardFooter className="mt-auto justify-end border-t pt-4 pb-6">
        <Button
          variant="link"
          className="text-primary hover:text-primary/90 h-auto p-0 font-semibold"
          asChild
        >
          <Link href="/penjualan/transaksi">Semua Penjualan &gt;</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
