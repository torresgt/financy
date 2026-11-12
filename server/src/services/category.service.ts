import { ConflictError, NotFoundError } from '../errors/app-error.js'
import type { Category, PrismaClient } from '../generated/prisma/client.js'
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator.js'
import { validate } from '../validators/validate.js'

export class CategoryService {
  constructor(private readonly prisma: PrismaClient) {}

  list(userId: string): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: { userId },
      orderBy: { title: 'asc' },
    })
  }

  async findById(userId: string, id: string): Promise<Category> {
    const category = await this.prisma.category.findFirst({ where: { id, userId } })
    if (!category) {
      throw new NotFoundError('Categoria')
    }
    return category
  }

  async create(userId: string, input: unknown): Promise<Category> {
    const data = validate(createCategorySchema, input)
    await this.ensureTitleIsAvailable(userId, data.title)

    return this.prisma.category.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        icon: data.icon,
        color: data.color,
        userId,
      },
    })
  }

  async update(userId: string, id: string, input: unknown): Promise<Category> {
    const data = validate(updateCategorySchema, input)
    const category = await this.findById(userId, id)

    if (data.title && data.title.toLowerCase() !== category.title.toLowerCase()) {
      await this.ensureTitleIsAvailable(userId, data.title, id)
    }

    return this.prisma.category.update({
      where: { id: category.id },
      data: {
        title: data.title,
        description: data.description,
        icon: data.icon,
        color: data.color,
      },
    })
  }

  /**
   * Remove a categoria. As transações vinculadas são mantidas
   * e ficam sem categoria (onDelete: SetNull).
   */
  async delete(userId: string, id: string): Promise<boolean> {
    const category = await this.findById(userId, id)
    await this.prisma.category.delete({ where: { id: category.id } })
    return true
  }

  private async ensureTitleIsAvailable(userId: string, title: string, ignoreId?: string) {
    // SQLite não oferece `mode: 'insensitive'`, então comparamos em memória
    const categories = await this.prisma.category.findMany({
      where: { userId, ...(ignoreId ? { NOT: { id: ignoreId } } : {}) },
      select: { title: true },
    })
    const normalized = title.toLowerCase()

    if (categories.some((category) => category.title.toLowerCase() === normalized)) {
      throw new ConflictError('Já existe uma categoria com este título')
    }
  }
}
