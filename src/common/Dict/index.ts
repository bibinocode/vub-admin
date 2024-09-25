import { DictBase, type DictBaseTypes } from './types'

/**
 * 系统用户状态字典
 */
export const SysUserStatus: DictBaseTypes = new DictBase('用户状态', [
  {
    id: 0,
    name: '正常状态',
    symbol: 'NORMAL'
  },
  {
    id: 1,
    name: '锁定状态',
    symbol: 'LOCKED'
  }
])
