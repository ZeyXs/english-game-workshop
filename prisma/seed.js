import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const brandsPath = join(process.cwd(), 'data', 'brands.json')
  const brandsFile = JSON.parse(readFileSync(brandsPath, 'utf-8'))
  const brands = Array.isArray(brandsFile.brands) ? brandsFile.brands : []

  if (!brands.length) {
    console.warn('⚠️  No brands found in data/brands.json, skipping seed.')
    return
  }

  const brandNames = brands.map((brand) => brand.name)

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { name: brand.name },
      update: {
        domain: brand.domain,
        category: brand.category,
        difficulty: brand.difficulty,
        description: brand.description,
        hint: brand.hint,
      },
      create: {
        name: brand.name,
        domain: brand.domain,
        category: brand.category,
        difficulty: brand.difficulty,
        description: brand.description,
        hint: brand.hint,
      },
    })
  }

  console.log(`✅ Synced ${brands.length} brands from data/brands.json`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
