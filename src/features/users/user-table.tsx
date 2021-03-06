import React from 'react'
import { Tag } from 'antd'
import { UserRole } from '@/core/auth'
import {
  dateRangeFilterColumn,
  textFilterColumn,
  PageableTableProps,
  PageableTable,
  TableColumn
} from '../../core/table'
import { formatDate } from '../../core/utils/date'
import { UserRequest, UserResponse, UserStatus } from './user-types'

export type UserTableProps = PageableTableProps<UserResponse, UserRequest>

let userRoleColor: Record<UserRole, string> = {
  [UserRole.admin]: 'purple',
  [UserRole.superAdmin]: 'blue'
}

let userStatusColor: Record<UserStatus, string> = {
  [UserStatus.active]: 'green',
  [UserStatus.inactive]: 'red'
}

export let userColumns: TableColumn<UserResponse>[] = [
  textFilterColumn({
    name: 'id',
    title: 'common.id',
    sorter: true,
    width: 100
  }),
  textFilterColumn({
    name: 'name',
    title: 'common.name',
    sorter: true
  }),
  textFilterColumn({
    name: 'email',
    title: 'common.email',
    sorter: true
  }),
  {
    name: 'role',
    title: 'common.role',
    sorter: true,
    filterMultiple: false,
    filters: Object.values(UserRole).map(value => ({
      value,
      text: value
    })),
    render: (_, user) => <Tag color={userRoleColor[user.role]}>{user.role}</Tag>
  },
  {
    name: 'status',
    title: 'common.status',
    sorter: true,
    filterMultiple: false,
    filters: Object.values(UserStatus).map(value => ({
      value,
      text: value
    })),
    render: (_, user) => (
      <Tag color={userStatusColor[user.status]}>{user.status}</Tag>
    )
  },
  dateRangeFilterColumn({
    name: 'createdAt',
    title: 'common.createdAt',
    sorter: true,
    render: formatDate
  })
]

export let UserTable = (props: UserTableProps) => {
  return <PageableTable {...props} columns={userColumns} />
}
