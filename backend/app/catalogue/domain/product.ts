import { ConcentrationEntity } from './concentration.js'

export type ProductRecord = {
  id: number
  perfumeId: number
  volumeMl: number
  concentration: { id: number; code: string; label: string }
}

export class ProductEntity {
  constructor(
    public readonly id: number,
    public readonly perfumeId: number,
    public readonly volumeMl: number,
    public readonly concentration: ConcentrationEntity
  ) {}

  static fromPersistence(record: ProductRecord) {
    return new ProductEntity(
      record.id,
      record.perfumeId,
      record.volumeMl,
      ConcentrationEntity.fromPersistence(record.concentration)
    )
  }
}
