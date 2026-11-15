import { gql } from '@apollo/client'
import { CATEGORY_FIELDS } from '../fragments'

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
