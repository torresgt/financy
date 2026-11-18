import { gql } from '@apollo/client'
import { TRANSACTION_FIELDS } from '@/graphql/fragments'

/* Queries */

export const GET_TRANSACTIONS = gql`
  ${TRANSACTION_FIELDS}
  query GetTransactions($filter: TransactionFilterInput) {
    transactions(filter: $filter) {
      ...TransactionFields
    }
  }
`

export const GET_TRANSACTION = gql`
  ${TRANSACTION_FIELDS}
  query GetTransaction($id: ID!) {
    transaction(id: $id) {
      ...TransactionFields
    }
  }
`

export const GET_SUMMARY = gql`
  query GetSummary($filter: TransactionFilterInput) {
    summary(filter: $filter) {
      balance
      totalIncome
      totalExpense
    }
  }
`

/* Mutations */

export const CREATE_TRANSACTION = gql`
  ${TRANSACTION_FIELDS}
  mutation CreateTransaction($data: CreateTransactionInput!) {
    createTransaction(data: $data) {
      ...TransactionFields
    }
  }
`

export const UPDATE_TRANSACTION = gql`
  ${TRANSACTION_FIELDS}
  mutation UpdateTransaction($id: ID!, $data: UpdateTransactionInput!) {
    updateTransaction(id: $id, data: $data) {
      ...TransactionFields
    }
  }
`

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`
