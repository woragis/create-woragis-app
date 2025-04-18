import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'

interface AccessControlProps {
  allowed?: boolean
  children: ReactNode
}

const AccessControl = ({ allowed = false, children }: AccessControlProps) => {
  if (!allowed) {
    return <Navigate to="/login" />
  }

  return children
}

export { AccessControl }
