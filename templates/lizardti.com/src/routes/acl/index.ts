export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

type Role = keyof typeof Roles

const SYSTEM_ROLES: { [key: number]: Role } = {
  1: Roles.ADMIN,
  2: Roles.USER
}

export const defaultAcl: Record<Role, { allow: boolean }> = {
  [Roles.USER]: {
    allow: false
  },
  [Roles.ADMIN]: {
    allow: true
  }
}

type Acl = typeof defaultAcl

export const isAllowed = ({
  acl,
  systemRole
}: {
  path: string
  acl: Acl
  systemRole: number
}): boolean => {
  const role = SYSTEM_ROLES[systemRole] || Roles.USER
  return acl[role].allow
}
