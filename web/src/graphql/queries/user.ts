import { gql } from '@apollo/client'
import { USER_FIELDS } from '../fragments'

export const ME = gql`
  ${USER_FIELDS}
  query Me {
    me {
      ...UserFields
    }
  }
`
