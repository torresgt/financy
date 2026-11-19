import { gql } from '@apollo/client'
import { USER_FIELDS } from '@/graphql/fragments'

export const ME = gql`
  ${USER_FIELDS}
  query Me {
    me {
      ...UserFields
    }
  }
`

export const UPDATE_PROFILE = gql`
  ${USER_FIELDS}
  mutation UpdateProfile($data: UpdateProfileInput!) {
    updateProfile(data: $data) {
      ...UserFields
    }
  }
`
