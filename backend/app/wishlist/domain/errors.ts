export class WishlistItemNotFoundError extends Error {
  constructor(id: number) {
    super(`Wishlist item with id "${id}" was not found.`)
    this.name = 'WishlistItemNotFoundError'
  }
}
