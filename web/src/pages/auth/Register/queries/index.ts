import { gql } from '@apollo/client'
import { USER_FIELDS } from '@/graphql/fragments'

export const REGISTER = gql`
  ${USER_FIELDS}
  mutation Register($data: RegisterInput!) {
    register(data: $data) {
      token
      user {
        ...UserFields
      }
    }
  }
`
