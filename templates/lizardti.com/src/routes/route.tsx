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
import { useUser } from '@/store/user/hooks'
import { showToast } from '@/store/toast/actions'

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
  const { isAuthenticated } = useUser

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const currentRoute = routes.find(
      (route) => route.path === location.pathname
    )
    if (currentRoute?.requiresAuth && !isAuthenticated) {
      navigate('/')
      showToast('error', 'Sua sessão expirou')
    }
  }, [isAuthenticated, location.pathname, navigate])

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
