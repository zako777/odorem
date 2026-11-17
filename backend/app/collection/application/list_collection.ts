import type { CollectionRepository, CollectionEntry } from '../domain/collection_repository.js'

export type ListCollectionQuery = {
  userId: number
  page?: number | null
  perPage?: number | null
}

export class ListCollection {
  constructor(private readonly repository: CollectionRepository) {}

  execute({ userId, page, perPage }: ListCollectionQuery): Promise<{
    items: CollectionEntry[]
    total: number
    page: number
    perPage: number
  }> {
    const resolvedPage = Math.max(page ?? 1, 1)
    const resolvedPerPage = Math.min(Math.max(perPage ?? 20, 1), 50)
    return this.repository
      .listCollection(userId, resolvedPage, resolvedPerPage)
      .then((result) => ({ ...result, page: resolvedPage, perPage: resolvedPerPage }))
  }
}
