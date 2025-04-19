import React, { useEffect } from 'react'
import { defaultAcl, isAllowed, Roles } from './acl'
import { AccessControl } from '../utils/accessControl'

import * as Pages from '../pages'
import { showToast } from '../store/toast/actions'
import { useUser } from '../store/user/hooks'

import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
  RouterProvider,
  useLocation,
  useNavigate
} from '@tanstack/react-router'

// --- Route definitions
const routeDefs = [
  {
    path: '/inicial-page',
    element: Pages.InicialPage,
    requiresAuth: true,
    acl: {
      ...defaultAcl,
      [Roles.ADMIN]: { allow: true }
    }
  }
]

// --- AuthChecker for root component
const AuthChecker: React.FC = () => {
  const { isAuthenticated } = useUser()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const currentRoute = routeDefs.find(
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
  component: () => (
    <>
      <Outlet />
      <AuthChecker />
    </>
  )
})

// --- Static login route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Pages.Login
})

// --- Dynamic routes
const dynamicRoutes = routeDefs.map(
  ({ path, element: Element, requiresAuth, acl }) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path,
      beforeLoad: () => {
        const { isAuthenticated } = useUser()
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
          systemRole: 1
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

// --- Router setup
const routeTree = rootRoute.addChildren([loginRoute, ...dynamicRoutes])
const router = createRouter({ routeTree })

// --- AppRoutes with RouterProvider
export const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />
}
