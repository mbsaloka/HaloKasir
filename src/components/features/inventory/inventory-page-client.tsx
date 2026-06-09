"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { InventoryStats } from "@/components/features/inventory/inventory-stats"
import { InventoryToolbar } from "@/components/features/inventory/inventory-toolbar"
import { ProductModal } from "@/components/features/inventory/modal/product-modal"
import { InventoryTable } from "@/components/features/inventory/table/inventory-table"
import {
  INVENTORY_PAGE_SIZE,
  filterInventoryProducts,
  type InventoryProduct,
} from "@/lib/inventory/types"
import {
  createInventoryProductAction,
  deleteInventoryProductAction,
  updateInventoryProductAction,
} from "@/lib/actions/inventory"

type InventoryPageClientProps = {
  initialProducts: InventoryProduct[]
}

export function InventoryPageClient({
  initialProducts,
}: InventoryPageClientProps) {
  const router = useRouter()
  const [products, setProducts] = useState<InventoryProduct[]>(initialProducts)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("Semua")
  const [page, setPage] = useState(1)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [editingProduct, setEditingProduct] =
    useState<InventoryProduct | null>(null)

  const [pendingDelete, setPendingDelete] =
    useState<InventoryProduct | null>(null)

  const filtered = useMemo(
    () => filterInventoryProducts(products, search, category),
    [products, search, category]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / INVENTORY_PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageSlice = useMemo(() => {
    const start = (safePage - 1) * INVENTORY_PAGE_SIZE
    return filtered.slice(start, start + INVENTORY_PAGE_SIZE)
  }, [filtered, safePage])

  function openCreate() {
    setEditingProduct(null)
    setModalMode("create")
    setModalOpen(true)
  }

  function openEdit(p: InventoryProduct) {
    setEditingProduct(p)
    setModalMode("edit")
    setModalOpen(true)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <InventoryStats products={products} />

      <InventoryToolbar
        search={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        category={category}
        onCategoryChange={(value) => {
          setCategory(value)
          setPage(1)
        }}
        onAddClick={openCreate}
      />

      <InventoryTable
        products={pageSlice}
        onEdit={openEdit}
        onDelete={setPendingDelete}
      />

      <div className="text-muted-foreground flex flex-col items-stretch justify-between gap-3 text-sm sm:flex-row sm:items-center">
        <p className="tabular-nums">
          Halaman {safePage} dari {totalPages} -{" "}
          {filtered.length.toLocaleString("id-ID")} baris
        </p>
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeftIcon className="size-4" />
            Sebelumnya
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Selanjutnya
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>

      <ProductModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        product={editingProduct}
        onSave={async ({ mode: m, id, values, numericPrice, numericStock }) => {
          if (m === "create") {
            const created = await createInventoryProductAction({
              name: values.name.trim(),
              price: numericPrice,
              stock: numericStock,
              category: values.category,
            })
            setProducts((prev) => [...prev, created])
            router.refresh()
            return
          }

          if (!id) return
          const updated = await updateInventoryProductAction({
            id,
            name: values.name.trim(),
            price: numericPrice,
            stock: numericStock,
            category: values.category,
          })
          setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)))
          router.refresh()
        }}
      />

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus barang?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `"${pendingDelete.name}" akan dihapus dari database.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={async () => {
                if (!pendingDelete) return
                await deleteInventoryProductAction(pendingDelete.id)
                setProducts((prev) =>
                  prev.filter((p) => p.id !== pendingDelete.id)
                )
                setPendingDelete(null)
                router.refresh()
              }}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
