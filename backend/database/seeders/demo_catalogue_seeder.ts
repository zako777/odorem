import { BaseSeeder } from '@adonisjs/lucid/seeders'

import Barcode from '#models/barcode'
import Concentration from '#models/concentration'
import Perfume from '#models/perfume'
import Product from '#models/product'

/**
 * Demo catalogue for local development and the private iPhone builds.
 * Barcode codes are fictitious: never treat them as real EANs.
 */
export default class extends BaseSeeder {
  async run() {
    const edt = await Concentration.firstOrCreate(
      { code: 'edt' },
      { code: 'edt', label: 'Eau de toilette' }
    )
    const edp = await Concentration.firstOrCreate(
      { code: 'edp' },
      { code: 'edp', label: 'Eau de parfum' }
    )
    await Concentration.firstOrCreate(
      { code: 'extrait' },
      { code: 'extrait', label: 'Extrait de parfum' }
    )

    const catalogue = [
      {
        name: 'Sauvage',
        brand: 'Dior',
        concentration: edp,
        volumeMl: 100,
        barcode: '0000000000001',
      },
      {
        name: 'Bleu de Chanel',
        brand: 'Chanel',
        concentration: edp,
        volumeMl: 100,
        barcode: '0000000000002',
      },
      {
        name: "Terre d'Hermès",
        brand: 'Hermès',
        concentration: edt,
        volumeMl: 100,
        barcode: '0000000000003',
      },
    ]

    for (const entry of catalogue) {
      const perfume = await Perfume.firstOrCreate(
        { name: entry.name, brand: entry.brand },
        { name: entry.name, brand: entry.brand }
      )
      const product = await Product.firstOrCreate(
        {
          perfumeId: perfume.id,
          concentrationId: entry.concentration.id,
          volumeMl: entry.volumeMl,
        },
        {
          perfumeId: perfume.id,
          concentrationId: entry.concentration.id,
          volumeMl: entry.volumeMl,
        }
      )
      await Barcode.firstOrCreate(
        { code: entry.barcode },
        { code: entry.barcode, productId: product.id }
      )
    }
  }
}
