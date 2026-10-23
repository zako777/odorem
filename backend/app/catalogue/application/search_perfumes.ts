import type { CatalogueRepository, PerfumesPage } from '../domain/catalogue_repository.js'

// shortcut: plafond 50 fixe, à rendre configurable si un client légitime en demande plus
const MAX_PER_PAGE = 50
const DEFAULT_PER_PAGE = 20

export type SearchPerfumesInput = {
  search?: string | null
  page?: number | null
  perPage?: number | null
}

export class SearchPerfumes {
  constructor(private readonly repository: CatalogueRepository) {}

  async execute(input: SearchPerfumesInput): Promise<PerfumesPage> {
    const search = input.search?.trim() || null
    const page = Math.max(1, input.page ?? 1)
    const perPage = Math.min(Math.max(1, input.perPage ?? DEFAULT_PER_PAGE), MAX_PER_PAGE)

    const result = await this.repository.searchPerfumes({ search, page, perPage })
    return { ...result, page, perPage }
  }
}
