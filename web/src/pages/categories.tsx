import { ArrowUpDown, Plus, Tag as TagIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { AppLayout } from '@/components/app-layout'
import { CategoryCard } from '@/components/category-card'
import { CATEGORY_ICONS, type CategoryIconName } from '@/components/category-icon'
import { NewCategoryDialog } from '@/components/new-category-dialog'
import { SummaryStatCard } from '@/components/summary-stat-card'
import { Button } from '@/components/ui/button'
import type { CategoryColor } from '@/components/ui/tag'
import type { CreateCategoryInput } from '@/types/api'

interface CategoryItem {
  id: string
  title: string
  description: string
  icon: CategoryIconName
  /** Cor da paleta ou hexadecimal personalizado (#rrggbb). */
  color: CategoryColor | (string & {})
  itemsCount: number
}

const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: '1',
    title: 'Alimentação',
    description: 'Restaurantes, delivery e refeições',
    icon: 'utensils',
    color: 'blue',
    itemsCount: 12,
  },
  {
    id: '2',
    title: 'Entretenimento',
    description: 'Cinema, jogos e lazer',
    icon: 'ticket',
    color: 'pink',
    itemsCount: 2,
  },
  {
    id: '3',
    title: 'Investimento',
    description: 'Aplicações e retornos financeiros',
    icon: 'piggy-bank',
    color: 'green',
    itemsCount: 1,
  },
  {
    id: '4',
    title: 'Mercado',
    description: 'Compras de supermercado e mantimentos',
    icon: 'shopping-cart',
    color: 'orange',
    itemsCount: 3,
  },
  {
    id: '5',
    title: 'Salário',
    description: 'Renda mensal e bonificações',
    icon: 'briefcase-business',
    color: 'green',
    itemsCount: 3,
  },
  {
    id: '6',
    title: 'Saúde',
    description: 'Medicamentos, consultas e exames',
    icon: 'heart-pulse',
    color: 'red',
    itemsCount: 0,
  },
  {
    id: '7',
    title: 'Transporte',
    description: 'Gasolina, transporte público e viagens',
    icon: 'car-front',
    color: 'purple',
    itemsCount: 8,
  },
  {
    id: '8',
    title: 'Utilidades',
    description: 'Energia, água, internet e telefone',
    icon: 'tool-case',
    color: 'yellow',
    itemsCount: 7,
  },
]

// Total geral de transações do usuário (mesmo valor da paginação da tela de Transações).
// Não é a soma de `itemsCount`, pois podem existir transações sem categoria.
const TOTAL_TRANSACTIONS = 27

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

  const totalCategories = categories.length
  const totalTransactions = TOTAL_TRANSACTIONS
  const mostUsed = categories.reduce<CategoryItem | null>(
    (top, item) => (!top || item.itemsCount > top.itemsCount ? item : top),
    null,
  )
  const MostUsedIcon = mostUsed ? CATEGORY_ICONS[mostUsed.icon] : TagIcon

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        {/* Page Header */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-2xl leading-8 font-bold text-gray-800">Categorias</h1>
            <p className="text-base leading-6 font-normal text-gray-600">
              Organize suas transações por categorias
            </p>
          </div>

          <Button variant="solid" size="sm" onClick={() => setIsNewCategoryOpen(true)}>
            <Plus />
            Nova categoria
          </Button>
        </header>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <SummaryStatCard
            icon={<TagIcon className="text-gray-700" />}
            value={totalCategories}
            label="Total de categorias"
          />
          <SummaryStatCard
            icon={<ArrowUpDown className="text-purple-base" />}
            value={totalTransactions}
            label="Total de transações"
          />
          <SummaryStatCard
            icon={<MostUsedIcon className="text-blue-base" />}
            value={mostUsed?.title ?? '—'}
            label="Categoria mais utilizada"
          />
        </section>

        {/* Categories Grid */}
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
