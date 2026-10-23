export type ConcentrationRecord = {
  id: number
  code: string
  label: string
}

export class ConcentrationEntity {
  constructor(
    public readonly id: number,
    public readonly code: string,
    public readonly label: string
  ) {}

  static fromPersistence(record: ConcentrationRecord) {
    return new ConcentrationEntity(record.id, record.code, record.label)
  }
}
