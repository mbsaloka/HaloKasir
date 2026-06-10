import "dotenv/config"

import { assertDatabaseConfigured, db } from "../src/db"
import {
  account,
  accountHistory,
  appSettings,
  members,
  products,
  purchaseLines,
  purchaseRecords,
  salesTransactionItems,
  salesTransactions,
  session,
  suppliers,
  user,
  verification,
} from "../src/db/schema"

assertDatabaseConfigured()

async function cleanDatabase() {
  await db.transaction(async (tx) => {
    await tx.delete(accountHistory)
    await tx.delete(appSettings)
    await tx.delete(purchaseLines)
    await tx.delete(purchaseRecords)
    await tx.delete(salesTransactionItems)
    await tx.delete(salesTransactions)
    await tx.delete(products)
    await tx.delete(suppliers)
    await tx.delete(members)
    await tx.delete(verification)
    await tx.delete(account)
    await tx.delete(session)
    await tx.delete(user)
  })
}

cleanDatabase()
  .then(() => {
    console.log("Database cleaned.")
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
