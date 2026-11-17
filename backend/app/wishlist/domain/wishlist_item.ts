export type WishlistItemRecord = {
  id: number
  userId: number
  productId: number
}

export class WishlistItemEntity {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly productId: number
  ) {}

  static fromPersistence(record: WishlistItemRecord) {
    return new WishlistItemEntity(record.id, record.userId, record.productId)
  }
}
