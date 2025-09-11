import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserManagement } from '@/hooks/useUserAuth';
import { authorizationCodeService, User, AuthorizationCode, passwordUtils, userSettingsService } from '@/lib/supabase';
import apiConfig from '@/config/apiConfig';

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [showAuthCodeForm, setShowAuthCodeForm] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false); // 新增用户表单显示状态
  const [showBatchGenerateForm, setShowBatchGenerateForm] = useState(false); // 批量生成表单显示状态
  const [authCodes, setAuthCodes] = useState<AuthorizationCode[]>([]);
  const [newAuthCode, setNewAuthCode] = useState('');
  const [selectedMembershipType, setSelectedMembershipType] = useState('month');
  const [authCodeLoading, setAuthCodeLoading] = useState(false);
  const [authCodeError, setAuthCodeError] = useState<string | null>(null);
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(5); // 每页显示数量，默认5个
  
  // 筛选状态
  const [filters, setFilters] = useState({
    membership_type: '',
    is_used: ''
  });
  
  // 批量生成授权码状态
  const [batchGenerateConfig, setBatchGenerateConfig] = useState({
    count: 10,
    membership_type: 'month',
    membership_days: 30
  });
  
  // 新增用户表单状态
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    membership_type: 'month',
    membership_days: 30
  });
  
  // 编辑用户状态
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [editingUserPassword, setEditingUserPassword] = useState(''); // 添加密码编辑状态
  
  // 站点设置状态
  const [siteSettings, setSiteSettings] = useState({
    customApiUrl: '',
    isValidUrl: true,
    selectedSites: [] as string[], // 当前选中的站点
    allSites: [
      '站点1', '站点2', '站点3', '站点4', '站点5',
      '站点6', '站点7', '站点8', '站点9', '站点10', '站点11'
    ] as string[]
  });
  const [siteSettingsLoading, setSiteSettingsLoading] = useState(false);
  const [siteSettingsError, setSiteSettingsError] = useState<string | null>(null);
  
  // 会员类型选项
  const membershipTypes = [
    { id: 'day', name: '天卡', days: 1 },
    { id: 'week', name: '周卡', days: 7 },
    { id: 'month', name: '月卡', days: 30 },
    { id: 'season', name: '季卡', days: 90 },
    { id: 'year', name: '年卡', days: 365 },
    { id: 'permanent', name: '永久', days: 365 * 10 }, // 10年视为永久
  ];
  
  const {
    users,
    loading: userLoading,
    error: userError,
    deleteUser,
    toggleUserStatus,
    updateUser,
    createUser, // 添加 createUser 函数
    refreshUsers
  } = useUserManagement();

  // 加载授权码（带分页和筛选）
  useEffect(() => {
    loadAuthCodes(currentPage);
  }, [currentPage, filters]);

  // 加载站点设置
  useEffect(() => {
    const customApiUrl = apiConfig.getCustomApiUrl() || '';
    const selectedSites = localStorage.getItem('selectedSites') ? JSON.parse(localStorage.getItem('selectedSites')!) : [];
    
    setSiteSettings({
      customApiUrl,
      isValidUrl: customApiUrl ? apiConfig.validateApiUrl(customApiUrl) : true,
      selectedSites,
      allSites: [
        '站点1', '站点2', '站点3', '站点4', '站点5',
        '站点6', '站点7', '站点8', '站点9', '站点10', '站点11'
      ]
    });
  }, []);

  const loadAuthCodes = async (page = 1) => {
    try {
      setAuthCodeLoading(true);
      setAuthCodeError(null);
      
      // 构建筛选参数
      const filterParams: {
        membership_type?: string;
        is_used?: boolean;
      } = {};
      if (filters.membership_type) {
        filterParams.membership_type = filters.membership_type;
      }
      if (filters.is_used !== '') {
        filterParams.is_used = filters.is_used === 'true';
      }
      
      const result = await authorizationCodeService.getAllAuthorizationCodes(page, pageSize, filterParams);
      setAuthCodes(result.data || []);
      setTotalCount(result.totalCount || 0);
      setTotalPages(Math.ceil((result.totalCount || 0) / pageSize));
      setCurrentPage(page);
    } catch (err) {
      setAuthCodeError(err instanceof Error ? err.message : '加载授权码失败');
    } finally {
      setAuthCodeLoading(false);
    }
  };

  // 处理筛选变化
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    // 重置到第一页
    setCurrentPage(1);
  };

  // 重置筛选
  const resetFilters = () => {
    setFilters({
      membership_type: '',
      is_used: ''
    });
    // 重置到第一页
    setCurrentPage(1);
  };

  // 生成随机授权码
  const generateAuthCode = () => {
    const code = authorizationCodeService.generateCode(16);
    setNewAuthCode(code);
  };

  // 添加授权码
  const handleAddAuthCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAuthCode.trim()) {
      setAuthCodeError('请输入授权码');
      return;
    }
    
    try {
      setAuthCodeLoading(true);
      setAuthCodeError(null);
      
      const selectedType = membershipTypes.find(type => type.id === selectedMembershipType);
      
      await authorizationCodeService.createAuthorizationCode(
        newAuthCode,
        selectedMembershipType,
        selectedType?.days || 30
      );
      
      // 重新加载授权码列表（回到第一页）
      await loadAuthCodes(1);
      
      // 重置表单
      setNewAuthCode('');
      setSelectedMembershipType('month');
      setShowAuthCodeForm(false);
    } catch (err) {
      setAuthCodeError(err instanceof Error ? err.message : '添加授权码失败');
    } finally {
      setAuthCodeLoading(false);
    }
  };

  // 批量生成授权码
  const handleBatchGenerateAuthCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (batchGenerateConfig.count <= 0 || batchGenerateConfig.count > 100) {
      setAuthCodeError('生成数量必须在1-100之间');
      return;
    }
    
    try {
      setAuthCodeLoading(true);
      setAuthCodeError(null);
      
      // 批量生成授权码
      const promises = [];
      for (let i = 0; i < batchGenerateConfig.count; i++) {
        const code = authorizationCodeService.generateCode(16);
        promises.push(
          authorizationCodeService.createAuthorizationCode(
            code,
            batchGenerateConfig.membership_type,
            batchGenerateConfig.membership_days
          )
        );
      }
      
      await Promise.all(promises);
      
      // 重新加载授权码列表（回到第一页）
      await loadAuthCodes(1);
      
      // 重置表单
      setBatchGenerateConfig({
        count: 10,
        membership_type: 'month',
        membership_days: 30
      });
      setShowBatchGenerateForm(false);
    } catch (err) {
      setAuthCodeError(err instanceof Error ? err.message : '批量生成授权码失败');
    } finally {
      setAuthCodeLoading(false);
    }
  };

  // 导出授权码
  const handleExportAuthCodes = () => {
    // 导出当前页面显示的所有授权码（包括已使用和未使用的）
    const exportCodes = authCodes;
    
    if (exportCodes.length === 0) {
      setAuthCodeError('没有授权码可以导出');
      return;
    }
    
    // 创建CSV内容，添加BOM以解决中文乱码问题
    const csvContent = '\uFEFF' + [
      '授权码,会员类型,会员天数,创建时间,使用时间,使用用户,状态',
      ...exportCodes.map(code => {
        const status = code.is_used ? '已使用' : '未使用';
        const usedAt = code.used_at ? code.used_at : '';
        const username = code.user?.username || '';
        return `"${code.code}",${code.membership_type},${code.membership_days},"${code.created_at}","${usedAt}","${username}",${status}`;
      })
    ].join('\n');
    
    // 创建下载链接
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `授权码_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 复制授权码到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // 可以添加一个提示，告知用户已复制
      alert(`已复制到剪贴板: ${text}`);
    }).catch(err => {
      console.error('复制失败:', err);
      setAuthCodeError('复制到剪贴板失败');
    });
  };

  // 删除授权码
  const handleDeleteAuthCode = async (id: number) => {
    if (window.confirm('确定要删除这个授权码吗？此操作不可恢复。')) {
      try {
        setAuthCodeLoading(true);
        setAuthCodeError(null);
        
        await authorizationCodeService.deleteAuthorizationCode(id);
        
        // 重新加载当前页的授权码列表
        await loadAuthCodes(currentPage);
      } catch (err) {
        setAuthCodeError(err instanceof Error ? err.message : '删除授权码失败');
      } finally {
        setAuthCodeLoading(false);
      }
    }
  };

  // 处理新增用户表单变化
  const handleNewUserChange = (field: string, value: string | number) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 当会员类型变化时，自动更新对应的天数
    if (field === 'membership_type') {
      const selectedType = membershipTypes.find(type => type.id === value);
      if (selectedType) {
        setNewUser(prev => ({
          ...prev,
          membership_days: selectedType.days
        }));
      }
    }
  };

  // 处理批量生成表单变化
  const handleBatchGenerateChange = (field: string, value: string | number) => {
    setBatchGenerateConfig(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 当会员类型变化时，自动更新对应的天数
    if (field === 'membership_type') {
      const selectedType = membershipTypes.find(type => type.id === value);
      if (selectedType) {
        setBatchGenerateConfig(prev => ({
          ...prev,
          membership_days: selectedType.days
        }));
      }
    }
  };

  // 处理新增用户提交
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.username.trim() || !newUser.password.trim()) {
      setAuthCodeError('用户名和密码不能为空');
      return;
    }
    
    try {
      setAuthCodeLoading(true);
      setAuthCodeError(null);
      
      await createUser(
        newUser.username,
        newUser.password,
        newUser.membership_type,
        newUser.membership_days
      );
      
      // 重置表单
      setNewUser({
        username: '',
        password: '',
        membership_type: 'month',
        membership_days: 30
      });
      setShowAddUserForm(false);
    } catch (err) {
      setAuthCodeError(err instanceof Error ? err.message : '添加用户失败');
    } finally {
      setAuthCodeLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('确定要删除这个用户吗？此操作不可恢复。')) {
      await deleteUser(id);
    }
  };

  // 开始编辑用户
  const startEditingUser = (user: User) => {
    setEditingUserId(user.id!);
    setEditingUser({
      username: user.username,
      membership_type: user.membership_type,
      expiry_date: user.expiry_date,
      is_active: user.is_active
    });
  };

  // 保存用户编辑
  const saveUserEdit = async () => {
    if (editingUserId && editingUser) {
      // 如果用户输入了新密码，则先更新密码
      if (editingUserPassword) {
        try {
          // 创建密码哈希
          const passwordHash = await passwordUtils.hashPassword(editingUserPassword);
          // 更新用户信息，包括密码
          await updateUser(editingUserId, { 
            ...editingUser,
            password_hash: passwordHash
          });
        } catch (err) {
          setAuthCodeError(err instanceof Error ? err.message : '更新密码失败');
          return;
        }
      } else {
        // 只更新用户信息，不更新密码
        await updateUser(editingUserId, editingUser);
      }
      
      // 重置密码输入框和编辑状态
      setEditingUserPassword('');
      cancelEditingUser();
    }
  };

  // 取消编辑用户
  const cancelEditingUser = () => {
    setEditingUserId(null);
    setEditingUser(null);
    setEditingUserPassword(''); // 重置密码输入框
  };

  // 更新编辑中的用户字段
  const updateEditingUser = (field: keyof User, value: any) => {
    if (editingUser) {
      setEditingUser({
        ...editingUser,
        [field]: value
      });
    }
  };

  // 保存站点设置
  const saveSiteSettings = async () => {
    // 验证URL格式
    if (siteSettings.customApiUrl && !apiConfig.validateApiUrl(siteSettings.customApiUrl)) {
      setSiteSettingsError('请输入有效的API地址，需要包含协议（http:// 或 https://）');
      return;
    }

    try {
      setSiteSettingsLoading(true);
      setSiteSettingsError(null);
      
      // 保存到localStorage
      if (siteSettings.customApiUrl) {
        apiConfig.setCustomApiUrl(siteSettings.customApiUrl);
      } else {
        apiConfig.resetToDefault();
      }
      
      // 保存选中的站点
      localStorage.setItem('selectedSites', JSON.stringify(siteSettings.selectedSites));
      
      // 显示成功消息
      setSiteSettingsError('站点设置已保存');
      
      // 清除成功消息
      setTimeout(() => {
        setSiteSettingsError(null);
      }, 3000);
    } catch (err) {
      setSiteSettingsError(err instanceof Error ? err.message : '保存站点设置失败');
    } finally {
      setSiteSettingsLoading(false);
    }
  };

  // 处理站点选择变化
  const handleSiteSelectionChange = (site: string, checked: boolean) => {
    setSiteSettings(prev => ({
      ...prev,
      selectedSites: checked 
        ? [...prev.selectedSites, site]
        : prev.selectedSites.filter(s => s !== site)
    }));
  };

  const formatDate = (dateString: string) => {
    // 检查日期字符串是否为空或无效
    if (!dateString || dateString === '') {
      return '-';
    }
    
    // 尝试创建日期对象
    const date = new Date(dateString);
    
    // 检查日期对象是否有效
    if (isNaN(date.getTime())) {
      return '-';
    }
    
    // 返回格式化的日期字符串（YYYY-MM-DD格式）
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  // 获取会员类型名称
  const getMembershipTypeName = (typeId: string) => {
    const type = membershipTypes.find(t => t.id === typeId);
    return type ? type.name : typeId;
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadAuthCodes(page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 头部 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                <i className="fa-solid fa-users mr-3 text-blue-600"></i>
                用户管理
              </h1>
              <p className="text-gray-600 mt-1" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                管理系统用户和授权码
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center"
                style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                返回主页
              </button>
              <button
                onClick={() => setShowAddUserForm(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
              >
                <i className="fa-solid fa-user-plus mr-2"></i>
                添加用户
              </button>
              <button
                onClick={() => setShowBatchGenerateForm(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center"
                style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
              >
                <i className="fa-solid fa-cubes mr-2"></i>
                批量生成
              </button>
              <button
                onClick={handleExportAuthCodes}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center"
                style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
              >
                <i className="fa-solid fa-file-export mr-2"></i>
                导出授权码
              </button>
              <button
                onClick={() => setShowAuthCodeForm(true)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center"
                style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
              >
                <i className="fa-solid fa-key mr-2"></i>
                添加授权码
              </button>
            </div>
          </div>
        </div>

        {/* 批量生成授权码表单 */}
        {showBatchGenerateForm && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                批量生成授权码
              </h2>
              <button
                onClick={() => setShowBatchGenerateForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleBatchGenerateAuthCodes} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                    生成数量
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={batchGenerateConfig.count}
                    onChange={(e) => handleBatchGenerateChange('count', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                    会员类型
                  </label>
                  <select
                    value={batchGenerateConfig.membership_type}
                    onChange={(e) => handleBatchGenerateChange('membership_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                  >
                    {membershipTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                    会员天数
                  </label>
                  <input
                    type="number"
                    value={batchGenerateConfig.membership_days}
                    onChange={(e) => handleBatchGenerateChange('membership_days', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBatchGenerateForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={authCodeLoading}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:bg-gray-400"
                  style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                >
                  {authCodeLoading ? '生成中...' : '批量生成'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 添加用户表单 */}
        {showAddUserForm && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                添加新用户
              </h2>
              <button
                onClick={() => setShowAddUserForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                    用户名
                  </label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => handleNewUserChange('username', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入用户名"
                    style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                    密码
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => handleNewUserChange('password', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入密码"
                    style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                    会员类型
                  </label>
                  <select
                    value={newUser.membership_type}
                    onChange={(e) => handleNewUserChange('membership_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                  >
                    {membershipTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                    会员天数
                  </label>
                  <input
                    type="number"
                    value={newUser.membership_days}
                    onChange={(e) => handleNewUserChange('membership_days', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={authCodeLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-gray-400"
                  style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                >
                  {authCodeLoading ? '添加中...' : '添加用户'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 添加授权码表单 */}
        {showAuthCodeForm && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                添加新授权码
              </h2>
              <button
                onClick={() => setShowAuthCodeForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleAddAuthCode} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                    授权码
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newAuthCode}
                      onChange={(e) => setNewAuthCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="输入授权码或点击生成"
                      style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={generateAuthCode}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                    >
                      生成
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                    会员类型
                  </label>
                  <select
                    value={selectedMembershipType}
                    onChange={(e) => setSelectedMembershipType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                  >
                    {membershipTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAuthCodeForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={authCodeLoading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:bg-gray-400"
                  style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                >
                  {authCodeLoading ? '添加中...' : '添加授权码'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 错误提示 */}
        {(userError || authCodeError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <i className="fa-solid fa-exclamation-triangle mr-2"></i>
            <span style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
              {userError || authCodeError}
            </span>
          </div>
        )}

        {/* 授权码列表 */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                授权码列表 ({totalCount})
              </h2>
              <button
                onClick={() => loadAuthCodes(currentPage)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={authCodeLoading}
              >
                <i className={`fa-solid fa-refresh ${authCodeLoading ? 'fa-spin' : ''}`}></i>
              </button>
            </div>
          </div>
          
          {/* 筛选器 */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                  会员类型
                </label>
                <select
                  value={filters.membership_type}
                  onChange={(e) => handleFilterChange('membership_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                >
                  <option value="">全部类型</option>
                  {membershipTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                  状态
                </label>
                <select
                  value={filters.is_used}
                  onChange={(e) => handleFilterChange('is_used', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                >
                  <option value="">全部状态</option>
                  <option value="true">已使用</option>
                  <option value="false">未使用</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                  style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                >
                  重置筛选
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                    授权码
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                    会员类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                    使用用户
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                    创建时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                    使用时间
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {authCodes.map((code) => (
                  <tr key={code.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div 
                        className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                        style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                        onClick={() => copyToClipboard(code.code)}
                        title="点击复制到剪贴板"
                      >
                        {code.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                        {getMembershipTypeName(code.membership_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        code.is_used 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`} style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                        {code.is_used ? '已使用' : '未使用'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                      {code.is_used ? (code.user?.username || '未知用户') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                      {formatDate(code.created_at || '')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                      {code.used_at ? formatDate(code.used_at) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteAuthCode(code.id!)}
                        disabled={code.is_used}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${
                          code.is_used
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                        style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {authCodes.length === 0 && !authCodeLoading && (
              <div className="text-center py-12">
                <i className="fa-solid fa-key text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                  暂无授权码，点击上方按钮添加授权码
                </p>
              </div>
            )}
          </div>
          
          {/* 分页控件 */}
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                显示第 {(currentPage - 1) * pageSize + 1} 到 {Math.min(currentPage * pageSize, totalCount)} 条，共 {totalCount} 条
              </div>
              <div className="flex items-center">
                <label className="mr-2 text-sm text-gray-700">每页:</label>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const newSize = parseInt(e.target.value);
                    setPageSize(newSize);
                    setCurrentPage(1); // 重置到第一页
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-sm rounded-md ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
              >
                上一页
              </button>
              
              {/* 页码按钮 */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                    style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 text-sm rounded-md ${
                  currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
              >
                下一页
              </button>
            </div>
          </div>
        </div>

        {/* 用户列表 */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                用户列表 ({users.length})
              </h2>
              <button
                onClick={refreshUsers}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={userLoading}
              >
                <i className={`fa-solid fa-refresh ${userLoading ? 'fa-spin' : ''}`}></i>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                    用户名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                    会员类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                    到期时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                    创建时间
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    {editingUserId === user.id ? (
                      // 编辑模式
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <input
                              type="text"
                              value={editingUser?.username || ''}
                              onChange={(e) => updateEditingUser('username', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                              placeholder="用户名"
                            />
                            <input
                              type="password"
                              value={editingUserPassword}
                              onChange={(e) => setEditingUserPassword(e.target.value)}
                              className="w-full mt-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                              placeholder="新密码（留空则不修改）"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={editingUser?.membership_type || ''}
                            onChange={(e) => updateEditingUser('membership_type', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                          >
                            {membershipTypes.map(type => (
                              <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="datetime-local"
                            value={editingUser?.expiry_date ? new Date(editingUser.expiry_date).toISOString().slice(0, 16) : ''}
                            onChange={(e) => updateEditingUser('expiry_date', new Date(e.target.value).toISOString())}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={editingUser?.is_active ? 'true' : 'false'}
                            onChange={(e) => updateEditingUser('is_active', e.target.value === 'true')}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                          >
                            <option value="true">启用</option>
                            <option value="false">禁用</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                          {user.created_at ? formatDate(user.created_at) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={saveUserEdit}
                              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                              style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                            >
                              保存
                            </button>
                            <button
                              onClick={cancelEditingUser}
                              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                              style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                            >
                              取消
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      // 显示模式
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <i className={`fa-solid fa-user ${user.is_active ? 'text-green-500' : 'text-gray-400'}`}></i>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                                {user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                            {getMembershipTypeName(user.membership_type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                          {formatDate(user.expiry_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`} style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                            {user.is_active ? '启用' : '禁用'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                          {user.created_at ? formatDate(user.created_at) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => startEditingUser(user)}
                              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                              style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => toggleUserStatus(user.id!, !user.is_active)}
                              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                                user.is_active
                                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                              style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                            >
                              {user.is_active ? '禁用' : '启用'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id!)}
                              className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                              style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            
            {users.length === 0 && !userLoading && (
              <div className="text-center py-12">
                <i className="fa-solid fa-user text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                  暂无用户
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 站点设置 */}
        <div className="bg-white rounded-lg shadow-sm border mt-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
              <i className="fa-solid fa-globe mr-2 text-blue-600"></i>
              站点设置
            </h2>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                可用站点（普通用户只能使用管理员指定的站点）
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {siteSettings.allSites.map((site, index) => (
                  <label key={site} className="flex items-center space-x-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={siteSettings.selectedSites.includes(site)}
                      onChange={(e) => handleSiteSelectionChange(site, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {site} ({apiConfig.presetApiUrls[index] || 'URL未配置'})
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                自定义API地址
              </label>
              <input
                type="text"
                value={siteSettings.customApiUrl}
                onChange={(e) => {
                  const value = e.target.value;
                  setSiteSettings(prev => ({
                    ...prev,
                    customApiUrl: value,
                    isValidUrl: value ? apiConfig.validateApiUrl(value) : true
                  }));
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  siteSettings.customApiUrl && !siteSettings.isValidUrl 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300'
                }`}
                placeholder="例如: https://api.example.com"
                style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
              />
              {siteSettings.customApiUrl && !siteSettings.isValidUrl && (
                <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                  <i className="fa-solid fa-exclamation-circle mr-1"></i>
                  请输入有效的API地址，需要包含协议（http:// 或 https://）
                </p>
              )}
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                当前使用的API地址: <span className="font-mono text-blue-600">{apiConfig.getApiUrl()}</span>
              </p>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                默认API地址: <span className="font-mono text-gray-500">{apiConfig.defaultApiUrl}</span>
              </p>
            </div>
            
            {siteSettingsError && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                siteSettingsError === '站点设置已保存' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`} style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}>
                {siteSettingsError}
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={saveSiteSettings}
                disabled={siteSettingsLoading || (siteSettings.customApiUrl !== '' && !siteSettings.isValidUrl)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-gray-400 flex items-center"
                style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
              >
                {siteSettingsLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    保存中...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-save mr-2"></i>
                    保存设置
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  apiConfig.resetToDefault();
                  setSiteSettings({
                    customApiUrl: '',
                    isValidUrl: true,
                    selectedSites: siteSettings.selectedSites,
                    allSites: siteSettings.allSites
                  });
                  setSiteSettingsError('已重置为默认API地址');
                  setTimeout(() => {
                    setSiteSettingsError(null);
                  }, 3000);
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center"
                style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif' }}
              >
                <i className="fa-solid fa-undo mr-2"></i>
                恢复默认
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;