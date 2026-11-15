import { gql } from '@apollo/client'
import { USER_FIELDS } from '../fragments'

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
