export class PerfumeNotFoundError extends Error {
  constructor(id: number) {
    super(`Perfume with id "${id}" was not found.`)
    this.name = 'PerfumeNotFoundError'
  }
}

export class ProductNotFoundError extends Error {
  constructor(id: number) {
    super(`Product with id "${id}" was not found.`)
    this.name = 'ProductNotFoundError'
  }
}
