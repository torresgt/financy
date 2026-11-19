import { gql } from "@apollo/client";
import { CATEGORY_FIELDS, TRANSACTION_FIELDS } from "@/graphql/fragments";

export const GET_DASHBOARD = gql`
  ${TRANSACTION_FIELDS}
  ${CATEGORY_FIELDS}
  query GetDashboard($monthFilter: TransactionFilterInput!) {
    balance: summary {
      balance
    }
    month: summary(filter: $monthFilter) {
      totalIncome
      totalExpense
    }
    transactions {
      ...TransactionFields
    }
    categories {
      ...CategoryFields
    }
  }
`;
