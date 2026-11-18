import { gql } from '@apollo/client'

export const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($data: RequestPasswordResetInput!) {
    requestPasswordReset(data: $data)
  }
`

export const CONFIRM_PASSWORD_RESET = gql`
  mutation ConfirmPasswordReset($data: ConfirmPasswordResetInput!) {
    confirmPasswordReset(data: $data)
  }
`
