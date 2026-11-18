import { Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { AppLayout } from '@/components/app-layout'
import type { CategoryIconName } from '@/components/category-icon'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import type { CreateCategoryInput } from '@/types/api'
import { CategoriesSummary } from './components/categories-summary'
import { CategoryCard } from './components/category-card'
import { NewCategoryDialog } from './components/new-category-dialog'
import { CATEGORIES_DATA, TOTAL_TRANSACTIONS } from './constants'

export function CategoriesPage() {
  // Lista local (mock) até a integração com a API.
  const [categories, setCategories] = useState(CATEGORIES_DATA)
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false)

  function handleCreateCategory(data: CreateCategoryInput) {
    setCategories((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description ?? '',
        icon: (data.icon ?? 'tag') as CategoryIconName,
        color: data.color ?? 'blue',
        itemsCount: 0,
      },
    ])
    toast.success('Categoria criada com sucesso')
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Categorias"
          description="Organize suas transações por categorias"
          action={
            <Button variant="solid" size="sm" onClick={() => setIsNewCategoryOpen(true)}>
              <Plus />
              Nova categoria
            </Button>
          }
        />

        <CategoriesSummary categories={categories} totalTransactions={TOTAL_TRANSACTIONS} />

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              title={category.title}
              description={category.description}
              icon={category.icon}
              color={category.color}
              itemsCount={category.itemsCount}
            />
          ))}
        </section>
      </div>

      <NewCategoryDialog
        open={isNewCategoryOpen}
        onOpenChange={setIsNewCategoryOpen}
        onSubmit={handleCreateCategory}
      />
    </AppLayout>
  )
}
