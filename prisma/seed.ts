import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

interface BrandData {
  name: string
  domain: string
  category: string
  difficulty: number
  description: string
  hint: string
}

interface BrandsFile {
  brands: BrandData[]
}

async function main() {
  console.log('🌱 Seeding database...')
  
  // Read brands from JSON file
  const brandsPath = join(process.cwd(), 'data', 'brands.json')
  const brandsFile: BrandsFile = JSON.parse(readFileSync(brandsPath, 'utf-8'))
  
  // Delete existing brands
  await prisma.brand.deleteMany()
  
  // Create brands from JSON
  for (const brand of brandsFile.brands) {
    await prisma.brand.create({
      data: {
        name: brand.name,
        domain: brand.domain,
        category: brand.category,
        difficulty: brand.difficulty,
        description: brand.description,
        hint: brand.hint
      }
    })
  }
  
  console.log(`✅ Created ${brandsFile.brands.length} brands from data/brands.json`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
