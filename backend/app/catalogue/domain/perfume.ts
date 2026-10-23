export type PerfumeRecord = {
  id: number
  name: string
  brand: string
  description: string | null
}

export class PerfumeEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly brand: string,
    public readonly description: string | null
  ) {}

  static fromPersistence(record: PerfumeRecord) {
    return new PerfumeEntity(record.id, record.name, record.brand, record.description)
  }
}
