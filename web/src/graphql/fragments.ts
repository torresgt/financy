import { gql } from '@apollo/client'

export const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    name
    email
    createdAt
    updatedAt
  }
`

export const CATEGORY_FIELDS = gql`
  fragment CategoryFields on Category {
    id
    title
    description
    icon
    color
    transactionsCount
    totalAmount
    createdAt
    updatedAt
  }
`

export const TRANSACTION_FIELDS = gql`
  fragment TransactionFields on Transaction {
    id
    description
    amount
    type
    date
    createdAt
    updatedAt
    category {
      id
      title
      icon
      color
    }
  }
`
