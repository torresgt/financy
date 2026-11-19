import { gql } from '@apollo/client'
import { USER_FIELDS } from '@/graphql/fragments'

export const LOGIN = gql`
  ${USER_FIELDS}
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      token
      user {
        ...UserFields
      }
    }
  }
`
