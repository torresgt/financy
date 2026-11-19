import { gql } from '@apollo/client'
import { CATEGORY_FIELDS } from '@/graphql/fragments'

/* Queries */

export const GET_CATEGORIES = gql`
  ${CATEGORY_FIELDS}
  query GetCategories {
    categories {
      ...CategoryFields
    }
  }
`

/**
 * Dados da página de Categorias. `transactions { id }` serve para o total geral de
 * transações, que inclui as sem categoria (não é a soma de `transactionsCount`).
 */
export const GET_CATEGORIES_PAGE = gql`
  ${CATEGORY_FIELDS}
  query GetCategoriesPage {
    categories {
      ...CategoryFields
    }
    transactions {
      id
    }
  }
`

export const GET_CATEGORY = gql`
  ${CATEGORY_FIELDS}
  query GetCategory($id: ID!) {
    category(id: $id) {
      ...CategoryFields
    }
  }
`

/* Mutations */

export const CREATE_CATEGORY = gql`
  ${CATEGORY_FIELDS}
  mutation CreateCategory($data: CreateCategoryInput!) {
    createCategory(data: $data) {
      ...CategoryFields
    }
  }
`

export const UPDATE_CATEGORY = gql`
  ${CATEGORY_FIELDS}
  mutation UpdateCategory($id: ID!, $data: UpdateCategoryInput!) {
    updateCategory(id: $id, data: $data) {
      ...CategoryFields
    }
  }
`

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`
