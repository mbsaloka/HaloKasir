import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    username: text("username"),
    phone: text("phone"),
    role: text("role").notNull().default("Kasir"),
    address: text("address"),
  },
  (table) => [
    index("user_name_idx").on(table.name),
  ]
)

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("session_user_id_idx").on(table.userId),
  ]
)

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("account_user_id_idx").on(table.userId),
    index("account_provider_idx").on(table.providerId, table.accountId),
  ]
)

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
)

export const products = pgTable(
  "products",
  {
    id: text("id").primaryKey(),
    sku: text("sku").notNull(),
    stockId: text("stock_id").notNull(),
    itemId: text("item_id").notNull(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    price: integer("price").notNull(),
    cost: integer("cost").notNull().default(0),
    stock: integer("stock").notNull().default(0),
    imageSrc: text("image_src").notNull().default("/placeholder-product.svg"),
    reorderLevel: integer("reorder_level").notNull().default(10),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("products_sku_idx").on(table.sku),
    uniqueIndex("products_stock_id_idx").on(table.stockId),
    uniqueIndex("products_item_id_idx").on(table.itemId),
    index("products_category_idx").on(table.category),
  ]
)

export const members = pgTable(
  "members",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email").notNull(),
    tier: text("tier").notNull().default("regular"),
    points: integer("points").notNull().default(0),
    status: text("status").notNull().default("active"),
    address: text("address"),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("members_email_idx").on(table.email),
    index("members_tier_idx").on(table.tier),
    index("members_status_idx").on(table.status),
  ]
)

export const suppliers = pgTable(
  "suppliers",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    phone: text("phone"),
    email: text("email"),
    address: text("address"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex("suppliers_name_idx").on(table.name)]
)

export const appSettings = pgTable("app_settings", {
  id: text("id").primaryKey(),
  pointEarnRateBps: integer("point_earn_rate_bps").notNull().default(100),
  goldPointMultiplierBps: integer("gold_point_multiplier_bps")
    .notNull()
    .default(15000),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const salesTransactions = pgTable(
  "sales_transactions",
  {
    id: text("id").primaryKey(),
    transactionAt: timestamp("transaction_at").notNull().defaultNow(),
    memberId: text("member_id").references(() => members.id, {
      onDelete: "set null",
    }),
    customerId: text("customer_id").notNull().default("Walk-in"),
    cashierId: text("cashier_id").references(() => user.id, {
      onDelete: "set null",
    }),
    cashierName: text("cashier_name").notNull(),
    paymentMethod: text("payment_method").notNull(),
    subtotal: integer("subtotal").notNull(),
    discount: integer("discount").notNull().default(0),
    tax: integer("tax").notNull().default(0),
    total: integer("total").notNull(),
    paidAmount: integer("paid_amount").notNull().default(0),
    changeAmount: integer("change_amount").notNull().default(0),
    status: text("status").notNull().default("Selesai"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("sales_transaction_at_idx").on(table.transactionAt),
    index("sales_member_id_idx").on(table.memberId),
    index("sales_cashier_id_idx").on(table.cashierId),
  ]
)

export const salesTransactionItems = pgTable(
  "sales_transaction_items",
  {
    id: text("id").primaryKey(),
    transactionId: text("transaction_id")
      .notNull()
      .references(() => salesTransactions.id, { onDelete: "cascade" }),
    productId: text("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    productName: text("product_name").notNull(),
    sku: text("sku").notNull(),
    category: text("category").notNull(),
    unitPrice: integer("unit_price").notNull(),
    unitCost: integer("unit_cost").notNull().default(0),
    quantity: integer("quantity").notNull(),
    lineTotal: integer("line_total").notNull(),
    lineProfit: integer("line_profit").notNull().default(0),
  },
  (table) => [
    index("sales_items_transaction_id_idx").on(table.transactionId),
    index("sales_items_product_id_idx").on(table.productId),
  ]
)

export const purchaseRecords = pgTable(
  "purchase_records",
  {
    id: text("id").primaryKey(),
    invoiceNo: text("invoice_no").notNull(),
    supplierId: text("supplier_id").references(() => suppliers.id, {
      onDelete: "set null",
    }),
    supplierName: text("supplier_name").notNull(),
    purchasedAt: timestamp("purchased_at").notNull().defaultNow(),
    status: text("status").notNull().default("Received"),
    subtotal: integer("subtotal").notNull(),
    discount: integer("discount").notNull().default(0),
    grandTotal: integer("grand_total").notNull(),
    notes: text("notes"),
    paymentMethod: text("payment_method").notNull().default("Tunai"),
    cashPaid: integer("cash_paid").notNull().default(0),
    createdByUserId: text("created_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("purchase_invoice_no_idx").on(table.invoiceNo),
    index("purchase_purchased_at_idx").on(table.purchasedAt),
    index("purchase_supplier_id_idx").on(table.supplierId),
  ]
)

export const purchaseLines = pgTable(
  "purchase_lines",
  {
    id: text("id").primaryKey(),
    purchaseId: text("purchase_id")
      .notNull()
      .references(() => purchaseRecords.id, { onDelete: "cascade" }),
    productId: text("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    barcode: text("barcode").notNull(),
    productName: text("product_name").notNull(),
    unitPrice: integer("unit_price").notNull(),
    qty: integer("qty").notNull(),
    expiry: text("expiry").notNull(),
  },
  (table) => [
    index("purchase_lines_purchase_id_idx").on(table.purchaseId),
    index("purchase_lines_product_id_idx").on(table.productId),
  ]
)

export const accountHistory = pgTable(
  "account_history",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    at: timestamp("at").notNull().defaultNow(),
    router: text("router").notNull(),
    description: text("description").notNull(),
    action: text("action").notNull(),
  },
  (table) => [
    index("account_history_user_id_idx").on(table.userId),
    index("account_history_at_idx").on(table.at),
  ]
)

export type ProductRow = typeof products.$inferSelect
export type MemberRow = typeof members.$inferSelect
export type SupplierRow = typeof suppliers.$inferSelect
export type AppSettingsRow = typeof appSettings.$inferSelect
export type SalesTransactionRow = typeof salesTransactions.$inferSelect
export type PurchaseRecordRow = typeof purchaseRecords.$inferSelect
export type UserRow = typeof user.$inferSelect
