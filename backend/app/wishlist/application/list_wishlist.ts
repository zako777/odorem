import type { WishlistRepository, WishlistEntry } from '../domain/wishlist_repository.js'

export type ListWishlistQuery = {
  userId: number
  page?: number | null
  perPage?: number | null
}

export class ListWishlist {
  constructor(private readonly repository: WishlistRepository) {}

  execute({ userId, page, perPage }: ListWishlistQuery): Promise<{
    items: WishlistEntry[]
    total: number
    page: number
    perPage: number
  }> {
    const resolvedPage = Math.max(page ?? 1, 1)
    const resolvedPerPage = Math.min(Math.max(perPage ?? 20, 1), 50)
    return this.repository
      .listWishlist(userId, resolvedPage, resolvedPerPage)
      .then((result) => ({ ...result, page: resolvedPage, perPage: resolvedPerPage }))
  }
}
