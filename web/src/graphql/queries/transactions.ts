import { gql } from '@apollo/client'
import { TRANSACTION_FIELDS } from '../fragments'

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
