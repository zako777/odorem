export const POSSESSION_CONDITIONS = ['new', 'opened', 'finished'] as const
export type PossessionCondition = (typeof POSSESSION_CONDITIONS)[number]

export type PossessionRecord = {
  id: number
  userId: number
  productId: number
  quantity: number
  condition: PossessionCondition
  rating: number | null
  comment: string | null
}

export class PossessionEntity {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly productId: number,
    public readonly quantity: number,
    public readonly condition: PossessionCondition,
    public readonly rating: number | null,
    public readonly comment: string | null
  ) {}

  static fromPersistence(record: PossessionRecord) {
    return new PossessionEntity(
      record.id,
      record.userId,
      record.productId,
      record.quantity,
      record.condition,
      record.rating,
      record.comment
    )
  }
}
