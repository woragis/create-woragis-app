import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom'
import { defaultAcl, isAllowed, Roles } from './acl'
import { AccessControl } from '../utils/accessControl'

import * as Pages from '../pages'
import { useAuthStore } from '../store/userStore'
import { useToastStore } from '../store/toastStore'

const routes = [
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

const AuthChecker: React.FC = () => {
  const { state, dispatch } = useAuthStore()
  const { dispatch: dispatchToast } = useToastStore()

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const currentRoute = routes.find(
      (route) => route.path === location.pathname
    )
    if (currentRoute?.requiresAuth && !state.isAuthenticated) {
      navigate('/')
      dispatchToast.setOpenToast('error', 'Sua sessão expirou')
    }
  }, [state.isAuthenticated, location.pathname, navigate, dispatch])

  return null
}

export const AppRoutes: React.FC = () => (
  <Router>
    <AuthChecker />
    <Routes>
      <Route path="/" element={<Pages.Login />} />
      {routes.map(({ path, element: Element, requiresAuth, acl }) => (
        <Route
          key={path}
          path={path}
          element={
            requiresAuth ? (
              <AccessControl
                allowed={isAllowed({
                  path,
                  acl,
                  systemRole: 1
                })}
              >
                <Element />
              </AccessControl>
            ) : (
              <Element />
            )
          }
        />
      ))}
    </Routes>
  </Router>
)
