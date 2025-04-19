import { useEffect } from 'react'
import { defaultAcl, isAllowed, Roles } from './acl'
import { AccessControl } from '@/utils/accessControl'

import * as Pages from '../pages'
import { useUser } from '@/store/user/hooks'
import { showToast } from '@/store/toast/actions'
import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  useLocation,
  useNavigate
} from '@tanstack/react-router'

// --- Route definitions (same as your `customRoutes`)
const customRoutes = [
  {
    path: '/inicial-page',
    element: Pages.InicialPage,
    requiresAuth: true,
    acl: {
      ...defaultAcl,
      [Roles.ADMIN]: {
        allow: true
      }
    }
  }
]

// --- AuthChecker component
const AuthChecker: React.FC = () => {
  const { isAuthenticated } = useUser() // ✅ fix here
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const currentRoute = customRoutes.find(
      (route) => route.path === location.pathname
    )
    if (currentRoute?.requiresAuth && !isAuthenticated) {
      navigate({ to: '/' })
      showToast('error', 'Sua sessão expirou')
    }
  }, [isAuthenticated, location.pathname, navigate])

  return null
}

// --- Root route
export const rootRoute = createRootRoute({
  component: () => <AuthChecker />
})

// --- Static login route
export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Pages.Login
})

// --- Dynamic protected routes
export const dynamicRoutes = customRoutes.map(
  ({ path, element: Element, requiresAuth, acl }) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path,
      beforeLoad: () => {
        const { isAuthenticated } = useUser() // ✅ fix here
        if (!requiresAuth) return

        if (!isAuthenticated) {
          showToast('error', 'Sua sessão expirou')
          throw redirect({ to: '/' })
        }
      },
      component: () => {
        const allowed = isAllowed({
          path,
          acl,
          systemRole: 1 // can also be dynamic
        })

        return requiresAuth ? (
          <AccessControl allowed={allowed}>
            <Element />
          </AccessControl>
        ) : (
          <Element />
        )
      }
    })
)

const routeTree = rootRoute.addChildren([loginRoute, ...dynamicRoutes])

export const router = createRouter({ routeTree })
