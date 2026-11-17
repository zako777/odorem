export class PossessionNotFoundError extends Error {
  constructor(id: number) {
    super(`Possession with id "${id}" was not found.`)
    this.name = 'PossessionNotFoundError'
  }
}
