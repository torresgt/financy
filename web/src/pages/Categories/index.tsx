import { useMutation, useQuery } from '@apollo/client/react'
import { Plus, RotateCw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { AppLayout, PageHeader } from '@/components'
import { Button, ConfirmDialog } from '@/components/ui'
import { getErrorMessage } from '@/lib/graphql-errors'
import { ENTER_ANIMATION, stagger } from '@/lib/motion'
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@/types/api'
import { CategoriesSummary, CategoryCard, CategoryDialog } from './components'
import {
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  GET_CATEGORIES_PAGE,
  UPDATE_CATEGORY,
} from './queries'
import type { CategoryItem } from './types'

interface CategoriesPageData {
  categories: Category[]
  transactions: Pick<Category, 'id'>[]
}

/** Após qualquer alteração, atualiza todas as consultas ativas. */
const REFETCH_ACTIVE = { refetchQueries: 'active' as const }

const SKELETON_CARDS = ['skeleton-1', 'skeleton-2', 'skeleton-3', 'skeleton-4']

export function CategoriesPage() {
  const [dialog, setDialog] = useState<{ open: boolean; category: Category | null }>({
    open: false,
    category: null,
  })
  const [toDelete, setToDelete] = useState<Category | null>(null)

  const { data, loading, error, refetch } = useQuery<CategoriesPageData>(GET_CATEGORIES_PAGE)

  const [createCategory] = useMutation<
    { createCategory: Category },
    { data: CreateCategoryInput }
  >(CREATE_CATEGORY, REFETCH_ACTIVE)

  const [updateCategory] = useMutation<
    { updateCategory: Category },
    { id: string; data: UpdateCategoryInput }
  >(UPDATE_CATEGORY, REFETCH_ACTIVE)

  const [deleteCategory] = useMutation<{ deleteCategory: boolean }, { id: string }>(
    DELETE_CATEGORY,
    REFETCH_ACTIVE,
  )

  const categories = data?.categories ?? []
  const items = useMemo<CategoryItem[]>(
    () =>
      categories.map((category) => ({
        id: category.id,
        title: category.title,
        description: category.description,
        icon: category.icon,
        color: category.color,
        itemsCount: category.transactionsCount,
      })),
    [categories],
  )

  async function handleSubmit(input: CreateCategoryInput) {
    const editing = dialog.category
    try {
      if (editing) {
        await updateCategory({ variables: { id: editing.id, data: input } })
        toast.success('Categoria atualizada com sucesso')
      } else {
        await createCategory({ variables: { data: input } })
        toast.success('Categoria criada com sucesso')
      }
    } catch (submitError) {
      toast.error(getErrorMessage(submitError))
      throw submitError
    }
  }

  async function handleDelete() {
    if (!toDelete) return
    try {
      await deleteCategory({ variables: { id: toDelete.id } })
      toast.success('Categoria excluída com sucesso')
    } catch (deleteError) {
      toast.error(getErrorMessage(deleteError))
      throw deleteError
    }
  }

  function findCategory(id: string) {
    return categories.find((category) => category.id === id) ?? null
  }

  const isInitialLoading = loading && !data

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Categorias"
          description="Organize suas transações por categorias"
          action={
            <Button
              variant="solid"
              size="sm"
              onClick={() => setDialog({ open: true, category: null })}
            >
              <Plus />
              Nova categoria
            </Button>
          }
        />

        {error && !data ? (
          <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-[12px] border border-gray-200 bg-white p-8 text-center">
            <p className="text-base leading-6 font-medium text-gray-800">
              Não foi possível carregar as categorias.
            </p>
            <p className="text-sm leading-5 text-gray-600">{getErrorMessage(error)}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              <RotateCw />
              Tentar novamente
            </Button>
          </div>
        ) : (
          <>
            <CategoriesSummary
              enterIndex={1}
              categories={items}
              totalTransactions={data?.transactions.length ?? 0}
            />

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {isInitialLoading &&
                SKELETON_CARDS.map((card) => (
                  <div
                    key={card}
                    aria-hidden
                    className="h-46 animate-pulse rounded-[12px] border border-gray-200 bg-white"
                  />
                ))}

              {!isInitialLoading && items.length === 0 && (
                <p className="col-span-full rounded-[12px] border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm leading-5 text-gray-500">
                  Nenhuma categoria criada ainda. Clique em "Nova categoria" para começar.
                </p>
              )}

              {items.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  className={ENTER_ANIMATION}
                  style={stagger(4 + index, { step: 50, max: 12 })}
                  title={category.title}
                  description={category.description}
                  icon={category.icon}
                  color={category.color}
                  itemsCount={category.itemsCount}
                  onEdit={() => setDialog({ open: true, category: findCategory(category.id) })}
                  onDelete={() => setToDelete(findCategory(category.id))}
                />
              ))}
            </section>
          </>
        )}
      </div>

      <CategoryDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((prev) => ({ ...prev, open }))}
        category={dialog.category}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Excluir categoria"
        description={
          toDelete
            ? `Tem certeza que deseja excluir "${toDelete.title}"? ${
                toDelete.transactionsCount === 1
                  ? 'A transação vinculada será mantida, mas ficará sem categoria.'
                  : toDelete.transactionsCount > 1
                    ? `As ${toDelete.transactionsCount} transações vinculadas serão mantidas, mas ficarão sem categoria.`
                    : 'Esta ação não pode ser desfeita.'
              }`
            : undefined
        }
        onConfirm={handleDelete}
      />
    </AppLayout>
  )
}
