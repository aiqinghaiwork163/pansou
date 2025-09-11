import { useState, useEffect } from 'react'
import { userService, authorizationCodeService, User } from '@/lib/supabase'
import { useAuth } from '@/contexts/authContext'

export const useUserAuth = () => {
  const { setIsAuthenticated, setIsAdministrator, setUser } = useAuth()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 检查是否已经登录（从sessionStorage获取）
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('sopan_user_auth')
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth)
        if (authData.isAuthenticated && authData.expiresAt > Date.now()) {
          setIsAuthenticated(true)
          setCurrentUser(authData.user)
          // 检查是否为管理员
          if (authData.user && authData.user.username === 'admin') {
            setIsAdministrator(true)
          }
        } else {
          // 过期了，清除认证信息
          sessionStorage.removeItem('sopan_user_auth')
        }
      } catch (err) {
        sessionStorage.removeItem('sopan_user_auth')
      }
    }
  }, [setIsAuthenticated, setIsAdministrator])

  // 用户登录验证
  const login = async (username: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      // 验证用户
      const user = await userService.verifyUser(username, password)
      
      if (user) {
        setIsAuthenticated(true)
        setCurrentUser(user)
        // 检查是否为管理员
        if (user.username === 'admin') {
          setIsAdministrator(true)
        }
        
        // 设置用户信息
        setUser({
          id: user.id,
          username: user.username
        });
        
        // 保存认证信息到sessionStorage（24小时有效期）
        const authData = {
          isAuthenticated: true,
          user: user,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24小时
        }
        sessionStorage.setItem('sopan_user_auth', JSON.stringify(authData))
        
        return true
      } else {
        setError('用户名或密码错误')
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '登录验证失败'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  // 用户注册
  const register = async (username: string, password: string, authCode: string) => {
    try {
      setLoading(true)
      setError(null)

      // 验证授权码
      const code = await authorizationCodeService.verifyAuthorizationCode(authCode)
      if (!code) {
        setError('无效的授权码或授权码已被使用')
        return false
      }

      // 检查用户名是否已存在
      const newUser = await userService.createUser(
        username, 
        password, 
        code.membership_type, 
        code.membership_days
      )
      
      if (newUser) {
        // 标记授权码为已使用
        await authorizationCodeService.markAuthorizationCodeAsUsed(code.id!, newUser.id!)
        
        // 自动登录
        setIsAuthenticated(true)
        setCurrentUser(newUser)
        // 检查是否为管理员（新注册用户通常不是管理员）
        
        // 设置用户信息
        setUser({
          id: newUser.id,
          username: newUser.username
        });
        
        // 保存认证信息到sessionStorage（24小时有效期）
        const authData = {
          isAuthenticated: true,
          user: newUser,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24小时
        }
        sessionStorage.setItem('sopan_user_auth', JSON.stringify(authData))
        
        return true
      } else {
        setError('注册失败')
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '注册失败'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  // 登出
  const logout = () => {
    setIsAuthenticated(false)
    setIsAdministrator(false)
    setUser(null)
    setCurrentUser(null)
    sessionStorage.removeItem('sopan_user_auth')
  }

  return {
    currentUser,
    loading,
    error,
    login,
    register,
    logout
  }
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 加载用户列表
  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await userService.getAllUsers()
      setUsers(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载用户列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 删除用户
  const deleteUser = async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await userService.deleteUser(id)
      await loadUsers() // 重新加载列表
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除用户失败')
      return false
    } finally {
      setLoading(false)
    }
  }

  // 切换用户状态
  const toggleUserStatus = async (id: number, isActive: boolean) => {
    try {
      setLoading(true)
      setError(null)
      await userService.toggleUserStatus(id, isActive)
      await loadUsers() // 重新加载列表
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '切换用户状态失败')
      return false
    } finally {
      setLoading(false)
    }
  }

  // 更新用户信息
  const updateUser = async (id: number, updates: Partial<User>) => {
    try {
      setLoading(true)
      setError(null)
      await userService.updateUser(id, updates)
      await loadUsers() // 重新加载列表
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新用户信息失败')
      return false
    } finally {
      setLoading(false)
    }
  }

  // 创建用户
  const createUser = async (username: string, password: string, membershipType: string, membershipDays: number) => {
    try {
      setLoading(true)
      setError(null)
      await userService.createUser(username, password, membershipType, membershipDays)
      await loadUsers() // 重新加载列表
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建用户失败')
      return false
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  return {
    users,
    loading,
    error,
    deleteUser,
    toggleUserStatus,
    updateUser,
    createUser,
    refreshUsers: loadUsers
  }
}