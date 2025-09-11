import { createClient } from '@supabase/supabase-js'

// Supabase配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://czpvqpjqecmhsafpjyvt.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cHZxcGpxZWNtaHNhZnBqeXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMjA4NjQsImV4cCI6MjA3MjY5Njg2NH0.OISNJxqR-1jfV3VCDWeVXLfVnA4W-pyT6nJyRZmnMcQ'

export const supabase = createClient(supabaseUrl, supabaseKey)

// 数据库表结构类型定义
export interface SearchHistory {
  id?: number
  keyword: string
  results_count: number
  search_time: number
  created_at?: string
  user_id?: string
}

export interface UserSettings {
  id?: number
  user_id: string
  api_url: string
  theme: 'light' | 'dark'
  language: 'zh' | 'en'
  created_at?: string
  updated_at?: string
}

// 用户表
export interface User {
  id?: number
  username: string
  password_hash: string
  membership_type: string
  expiry_date: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

// 授权码表
export interface AuthorizationCode {
  id?: number
  code: string
  membership_type: string
  membership_days: number
  is_used: boolean
  created_at?: string
  used_at?: string
  used_by?: number
  // 关联的用户信息
  user?: User
}

// 搜索历史相关操作
export const searchHistoryService = {
  // 添加搜索记录
  async addSearchRecord(keyword: string, resultsCount: number, searchTime: number) {
    const { data, error } = await supabase
      .from('search_history')
      .insert({
        keyword,
        results_count: resultsCount,
        search_time: searchTime
      })
      .select()
    
    if (error) throw error
    return data
  },

  // 获取搜索历史
  async getSearchHistory(limit = 50) {
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  },

  // 清空搜索历史
  async clearSearchHistory() {
    const { error } = await supabase
      .from('search_history')
      .delete()
      .neq('id', 0) // 删除所有记录
    
    if (error) throw error
  },

  // 获取热门搜索关键词
  async getPopularKeywords(limit = 10) {
    // 由于 Supabase JS SDK 不直接支持 GROUP BY，
    // 我们先获取所有数据，然后在客户端进行分组统计
    const { data, error } = await supabase
      .from('search_history')
      .select('keyword')
      .limit(1000) // 限制获取的数据量
    
    if (error) throw error
    
    // 在客户端进行分组统计
    if (!data) return []
    
    // 统计每个关键词的出现次数
    const keywordCount: { [key: string]: number } = {}
    data.forEach(item => {
      if (item.keyword) {
        keywordCount[item.keyword] = (keywordCount[item.keyword] || 0) + 1
      }
    })
    
    // 转换为数组并排序
    const result = Object.entries(keywordCount)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
    
    return result
  }
}

// 用户设置相关操作
export const userSettingsService = {
  // 保存用户设置
  async saveSettings(userId: string, settings: Partial<UserSettings>) {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString()
      })
      .select()
    
    if (error) throw error
    return data
  },

  // 获取用户设置
  async getSettings(userId: string) {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }
}

// 密码加密工具函数
export const passwordUtils = {
  // 使用 SHA-256 加密密码
  async hashPassword(password: string): Promise<string> {
    // 检查是否支持 SubtleCrypto API
    if (!crypto || !crypto.subtle) {
      console.warn('SubtleCrypto not available, using fallback method');
      // 在不支持 SubtleCrypto 的环境中使用简单的替代方法
      // 注意：这仅用于开发环境，生产环境应始终使用 HTTPS
      return this.simpleHash(password);
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(password + 'sopan_salt_2025');
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error('Error hashing password with SubtleCrypto:', error);
      // 出现错误时使用简单的替代方法
      return this.simpleHash(password);
    }
  },

  // 验证密码
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const inputHash = await this.hashPassword(password);
    return inputHash === hash;
  },

  // 简单的哈希函数作为备用方案（仅用于开发环境）
  simpleHash(password: string): string {
    // 这是一个非常简单的哈希函数，仅用于开发环境
    // 在生产环境中，应始终使用 HTTPS 和 SubtleCrypto
    let hash = 0;
    const str = password + 'sopan_salt_2025';
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash).toString(16);
  }
}

// 登录日志服务
export const loginLogService = {
  // 记录登录日志
  async logLogin(passwordId: number, success: boolean, ipAddress?: string, userAgent?: string) {
    const { error } = await supabase
      .from('login_logs')
      .insert({
        password_id: passwordId,
        ip_address: ipAddress,
        user_agent: userAgent,
        success
      })
    
    if (error) console.error('记录登录日志失败:', error)
  },

  // 获取登录日志
  async getLoginLogs(limit = 100) {
    const { data, error } = await supabase
      .from('login_logs')
      .select(`
        *,
        users(username)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  },

  // 获取登录统计
  async getLoginStats() {
    const { data, error } = await supabase
      .from('login_logs')
      .select('success, created_at')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    
    if (error) throw error
    
    const total = data?.length || 0
    const successful = data?.filter(log => log.success).length || 0
    const failed = total - successful
    
    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total * 100).toFixed(1) : '0'
    }
  }
}

// 用户管理服务
export const userService = {
  // 创建用户
  async createUser(username: string, password: string, membershipType: string, membershipDays: number) {
    const passwordHash = await passwordUtils.hashPassword(password)
    
    // 计算过期日期
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + membershipDays)
    
    const { data, error } = await supabase
      .from('users')
      .insert({
        username,
        password_hash: passwordHash,
        membership_type: membershipType,
        expiry_date: expiryDate.toISOString(),
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
    
    if (error) throw error
    return data[0]
  },

  // 验证用户
  async verifyUser(username: string, password: string): Promise<User | null> {
    // 获取用户
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
    
    if (error) throw error
    if (!users || users.length === 0) return null

    const user = users[0]
    
    // 验证密码
    const isValid = await passwordUtils.verifyPassword(password, user.password_hash)
    if (!isValid) return null
    
    // 检查会员是否过期
    const now = new Date()
    const expiryDate = new Date(user.expiry_date)
    if (now > expiryDate) {
      throw new Error('账户已过期')
    }
    
    return user
  },

  // 获取所有用户
  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // 删除用户
  async deleteUser(id: number) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // 切换用户状态
  async toggleUserStatus(id: number, isActive: boolean) {
    const { error } = await supabase
      .from('users')
      .update({ 
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) throw error
  },

  // 更新用户信息
  async updateUser(id: number, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update({ 
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  }
}

// 授权码管理服务
export const authorizationCodeService = {
  // 生成随机授权码
  generateCode(length: number = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },

  // 创建授权码
  async createAuthorizationCode(code: string, membershipType: string, membershipDays: number) {
    const { data, error } = await supabase
      .from('authorization_codes')
      .insert({
        code,
        membership_type: membershipType,
        membership_days: membershipDays,
        is_used: false,
        created_at: new Date().toISOString()
      })
      .select()
    
    if (error) throw error
    return data[0]
  },

  // 获取所有授权码（支持分页和筛选）
  async getAllAuthorizationCodes(page = 1, pageSize = 7, filters: { membership_type?: string; is_used?: boolean } = {}) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // 构建查询
    let query = supabase
      .from('authorization_codes')
      .select(`
        *,
        user:users!authorization_codes_used_by_fkey(username)
      `)
      .order('created_at', { ascending: false });

    // 应用筛选条件
    if (filters.membership_type) {
      query = query.eq('membership_type', filters.membership_type);
    }
    
    if (filters.is_used !== undefined) {
      query = query.eq('is_used', filters.is_used);
    }

    // 先获取总数（带筛选条件）
    const countQuery = supabase
      .from('authorization_codes')
      .select('*', { count: 'exact', head: true });
      
    // 应用相同的筛选条件到计数查询
    let countQueryWithFilters = countQuery;
    if (filters.membership_type) {
      countQueryWithFilters = countQueryWithFilters.eq('membership_type', filters.membership_type);
    }
    
    if (filters.is_used !== undefined) {
      countQueryWithFilters = countQueryWithFilters.eq('is_used', filters.is_used);
    }

    const { count, error: countError } = await countQueryWithFilters;
    if (countError) throw countError;

    // 获取当前页的数据
    const { data, error } = await query.range(from, to);
    if (error) throw error;
    
    return {
      data: data || [],
      totalCount: count || 0
    };
  },

  // 验证授权码
  async verifyAuthorizationCode(code: string): Promise<AuthorizationCode | null> {
    const { data: codes, error } = await supabase
      .from('authorization_codes')
      .select('*')
      .eq('code', code)
      .eq('is_used', false)
      .single()
    
    if (error || !codes) return null
    return codes
  },

  // 标记授权码为已使用
  async markAuthorizationCodeAsUsed(id: number, usedBy: number) {
    const { error } = await supabase
      .from('authorization_codes')
      .update({
        is_used: true,
        used_at: new Date().toISOString(),
        used_by: usedBy
      })
      .eq('id', id)
    
    if (error) throw error
  },

  // 删除授权码
  async deleteAuthorizationCode(id: number) {
    const { error } = await supabase
      .from('authorization_codes')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // 批量创建授权码
  async batchCreateAuthorizationCodes(count: number, membershipType: string, membershipDays: number) {
    const codes = [];
    for (let i = 0; i < count; i++) {
      codes.push({
        code: this.generateCode(16),
        membership_type: membershipType,
        membership_days: membershipDays,
        is_used: false,
        created_at: new Date().toISOString()
      });
    }

    const { error } = await supabase
      .from('authorization_codes')
      .insert(codes);
    
    if (error) throw error
  }
}
