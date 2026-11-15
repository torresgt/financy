import { gql } from '@apollo/client'
import { CATEGORY_FIELDS } from '../fragments'

export const GET_CATEGORIES = gql`
  ${CATEGORY_FIELDS}
  query GetCategories {
    categories {
      ...CategoryFields
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
