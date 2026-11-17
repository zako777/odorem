import type { Database } from '@adonisjs/lucid/database'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

type UpsertClient = Database | TransactionClientContract

/**
 * Insert a possession or increment its quantity, atomically.
 */
export async function upsertPossession(client: UpsertClient, userId: number, productId: number) {
  await client
    .table('possessions')
    .insert({ user_id: userId, product_id: productId, created_at: new Date() })
    .onConflict(['user_id', 'product_id'])
    .merge({ quantity: client.raw('possessions.quantity + 1'), updated_at: new Date() })
}
