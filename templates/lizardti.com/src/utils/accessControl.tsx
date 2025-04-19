import { ReactNode } from 'react'
import { Navigate } from '@tanstack/react-router'

interface AccessControlProps {
  allowed?: boolean
  children: ReactNode
}

const AccessControl = ({ allowed = false, children }: AccessControlProps) => {
  if (!allowed) {
    return <Navigate to={'/login'} />
  }

  return children
}

export { AccessControl }
