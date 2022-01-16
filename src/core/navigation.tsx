import React, { FC, ReactNode } from 'react'
import { Link, Outlet, Route, useLocation } from 'react-router-dom'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Menu, PageHeader } from 'antd'
import { Login, RequireAuth, useAuth, UserRole, userRoleLevels } from './auth'
import { TranslationKeys, useLang } from './localization'

export type NavigationItem = {
  title: TranslationKeys
  path: string
  element: ReactNode
  icon?: ReactNode
  hidden?: boolean
  role?: UserRole
}

export let navigationRoutes = (navigationItems: NavigationItem[]) => {
  let { user } = useAuth()
  let accessibleNavigationItems = navigationItems.filter(item => {
    if (!user) {
      return false
    }
    if (!item.role) {
      return true
    }
    return (
      userRoleLevels.indexOf(item.role) <= userRoleLevels.indexOf(user.role)
    )
  })

  return (
    <>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAuth>
            <Layout navigationItems={accessibleNavigationItems} />
          </RequireAuth>
        }
      >
        {accessibleNavigationItems.map(item => {
          return (
            <Route
              key={item.path}
              path={item.path}
              element={<Container title={item.title}>{item.element}</Container>}
            />
          )
        })}
        <Route path="*" element={<Container title="page.notfound" />} />
      </Route>
    </>
  )
}

type LayoutProps = {
  navigationItems?: NavigationItem[]
}

let Layout: FC<LayoutProps> = ({ navigationItems = [] }) => {
  let location = useLocation()
  let { t } = useLang()
  let { user, logout } = useAuth()

  let visibleNavigationItems = navigationItems.filter(item => !item.hidden)

  return (
    <main style={{ maxWidth: 1440, margin: '0 auto' }}>
      <Menu
        mode="horizontal"
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        <Menu.SubMenu key="user" icon={<UserOutlined />} title={user?.name}>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
            {t('auth.logout')}
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>

      <div style={{ display: 'flex' }}>
        <Menu selectedKeys={[location.pathname]} style={{ minWidth: 200 }}>
          {visibleNavigationItems.map(item => (
            <Menu.Item key={item.path} icon={item.icon}>
              <Link to={item.path}>{t(item.title)}</Link>
            </Menu.Item>
          ))}
        </Menu>
        <Outlet />
      </div>
    </main>
  )
}

let Container: FC<{ title: TranslationKeys }> = ({ title, children }) => {
  let { t } = useLang()
  return (
    <div style={{ width: '100%', padding: 16, position: 'relative' }}>
      <PageHeader
        style={{ padding: 0 }}
        title={t(title)}
        onBack={() => window.history.back()}
      />
      <div style={{ paddingTop: 8 }}>{children}</div>
    </div>
  )
}
