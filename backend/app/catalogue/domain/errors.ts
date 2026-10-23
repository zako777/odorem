export class PerfumeNotFoundError extends Error {
  constructor(id: number) {
    super(`Perfume with id "${id}" was not found.`)
    this.name = 'PerfumeNotFoundError'
  }
}
