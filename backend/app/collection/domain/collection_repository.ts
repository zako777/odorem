import type { PossessionEntity } from './possession.js'
import type { PossessionCondition } from './possession.js'

export type CollectionEntry = {
  possession: PossessionEntity
  perfumeName: string
  brand: string
  concentrationCode: string
  volumeMl: number
}

export type UpdatePossessionChanges = {
  quantity?: number
  condition?: PossessionCondition
  rating?: number | null
  comment?: string | null
}

export interface CollectionRepository {
  listCollection(
    userId: number,
    page: number,
    perPage: number
  ): Promise<{ items: CollectionEntry[]; total: number }>
  addOrIncrement(userId: number, productId: number): Promise<PossessionEntity>
  update(
    userId: number,
    possessionId: number,
    changes: UpdatePossessionChanges
  ): Promise<PossessionEntity | null>
  remove(userId: number, possessionId: number): Promise<boolean>
}
