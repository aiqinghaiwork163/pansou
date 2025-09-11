import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserManagement } from '@/hooks/useUserAuth';
import { authorizationCodeService, User, AuthorizationCode, passwordUtils, userSettingsService, userService } from '@/lib/supabase';
import apiConfig from '@/config/apiConfig';
import DeleteIcon from '@/components/DeleteIcon';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { 
  Table, 
  Button, 
  Form, 
  Input, 
  Select, 
  Modal, 
  message, 
  Card, 
  Tabs, 
  Tag, 
  Space, 
  Popconfirm,
  Switch,
  Pagination,
  Row,
  Col,
  Checkbox,
  Typography
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  EyeOutlined, 
  EyeInvisibleOutlined,
  SaveOutlined,
  ReloadOutlined,
  FilterOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const AntdUserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [showAuthCodeForm, setShowAuthCodeForm] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showBatchGenerateForm, setShowBatchGenerateForm] = useState(false);
  const [authCodes, setAuthCodes] = useState<AuthorizationCode[]>([]);
  const [selectedAuthCodes, setSelectedAuthCodes] = useState<number[]>([]); // 添加选中的授权码状态
  const [newAuthCode, setNewAuthCode] = useState('');
  const [selectedMembershipType, setSelectedMembershipType] = useState('month');
  const [authCodeLoading, setAuthCodeLoading] = useState(false);
  const [authCodeError, setAuthCodeError] = useState<string | null>(null);
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  // 筛选状态
  const [filters, setFilters] = useState({
    membership_type: '',
    is_used: ''
  });
  
  // 批量生成授权码状态
  const [batchGenerateConfig, setBatchGenerateConfig] = useState({
    count: 10,
    membership_type: 'month'
  });
  
  // 新增用户表单状态
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    membership_type: 'month',
    membership_days: 30,
    expiry_date: ''
  });
  
  // 编辑用户状态
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [editingUserPassword, setEditingUserPassword] = useState('');
  
  // 站点设置状态
  const [siteSettings, setSiteSettings] = useState({
    customApiUrl: '',
    isValidUrl: true,
    selectedSites: [] as string[],
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
    { id: 'permanent', name: '永久', days: 365 * 10 },
  ];
  
  const {
    users,
    loading: userLoading,
    error: userError,
    deleteUser,
    toggleUserStatus,
    updateUser,
    createUser,
    refreshUsers
  } = useUserManagement();

  // 加载授权码（带分页和筛选）
  useEffect(() => {
    loadAuthCodes(currentPage);
  }, [currentPage, filters]);

  // 保存站点设置
  const saveSiteSettings = async () => {
    try {
      setSiteSettingsLoading(true);
      setSiteSettingsError(null);

      // 验证自定义API URL
      if (siteSettings.customApiUrl && !apiConfig.validateApiUrl(siteSettings.customApiUrl)) {
        setSiteSettingsError('请输入有效的API URL地址');
        return;
      }

      // 保存自定义API URL
      if (siteSettings.customApiUrl) {
        apiConfig.setCustomApiUrl(siteSettings.customApiUrl);
      } else {
        apiConfig.resetToDefault();
      }

      // 保存选中的站点
      localStorage.setItem('selectedSites', JSON.stringify(siteSettings.selectedSites));

      message.success('站点设置保存成功');
    } catch (err) {
      setSiteSettingsError(err instanceof Error ? err.message : '保存站点设置失败');
      message.error('保存站点设置失败');
    } finally {
      setSiteSettingsLoading(false);
    }
  };

  // 重置站点设置
  const resetSiteSettings = () => {
    const customApiUrl = apiConfig.defaultApiUrl || '';
    setSiteSettings(prev => ({
      ...prev,
      customApiUrl,
      isValidUrl: customApiUrl ? apiConfig.validateApiUrl(customApiUrl) : true,
      selectedSites: []
    }));
    
    localStorage.removeItem('selectedSites');
    apiConfig.resetToDefault();
    message.success('已重置为默认设置');
  };

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
    setCurrentPage(1);
  };

  // 重置筛选
  const resetFilters = () => {
    setFilters({
      membership_type: '',
      is_used: ''
    });
    setCurrentPage(1);
  };

  // 生成随机授权码
  const generateRandomCode = () => {
    setNewAuthCode(authorizationCodeService.generateCode(8));
  };

  // 创建授权码
  const handleCreateAuthCode = async () => {
    if (!newAuthCode.trim()) {
      message.error('请输入授权码');
      return;
    }

    try {
      const selectedType = membershipTypes.find(type => type.id === selectedMembershipType);
      if (!selectedType) {
        message.error('请选择有效的会员类型');
        return;
      }

      await authorizationCodeService.createAuthorizationCode(
        newAuthCode,
        selectedMembershipType,
        selectedType.days
      );

      message.success('授权码创建成功');
      setNewAuthCode('');
      setShowAuthCodeForm(false);
      loadAuthCodes(currentPage);
    } catch (err) {
      message.error(err instanceof Error ? err.message : '创建授权码失败');
    }
  };

  // 删除授权码
  const handleDeleteAuthCode = async (id: number) => {
    try {
      await authorizationCodeService.deleteAuthorizationCode(id);
      message.success('授权码删除成功');
      loadAuthCodes(currentPage);
      // 从选中列表中移除
      setSelectedAuthCodes(prev => prev.filter(codeId => codeId !== id));
    } catch (err) {
      message.error(err instanceof Error ? err.message : '删除授权码失败');
    }
  };

  // 批量删除授权码
  const handleBatchDeleteAuthCodes = async () => {
    if (selectedAuthCodes.length === 0) {
      message.warning('请先选择要删除的授权码');
      return;
    }

    try {
      // 批量删除授权码
      await Promise.all(
        selectedAuthCodes.map(id => authorizationCodeService.deleteAuthorizationCode(id))
      );
      
      message.success(`成功删除 ${selectedAuthCodes.length} 个授权码`);
      setSelectedAuthCodes([]); // 清空选中列表
      loadAuthCodes(currentPage); // 重新加载数据
    } catch (err) {
      message.error(err instanceof Error ? err.message : '批量删除授权码失败');
    }
  };

  // 批量生成授权码
  const handleBatchGenerate = async () => {
    try {
      const selectedType = membershipTypes.find(type => type.id === batchGenerateConfig.membership_type);
      if (!selectedType) {
        message.error('请选择有效的会员类型');
        return;
      }

      await authorizationCodeService.batchCreateAuthorizationCodes(
        batchGenerateConfig.count,
        batchGenerateConfig.membership_type,
        selectedType.days
      );

      message.success(`成功批量生成 ${batchGenerateConfig.count} 个授权码`);
      setShowBatchGenerateForm(false);
      loadAuthCodes(currentPage);
    } catch (err) {
      message.error(err instanceof Error ? err.message : '批量生成授权码失败');
    }
  };

  // 处理用户状态切换
  const handleToggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      await toggleUserStatus(userId, !currentStatus);
      message.success(`用户已${!currentStatus ? '启用' : '禁用'}`);
      refreshUsers();
    } catch (err) {
      message.error(err instanceof Error ? err.message : `切换用户状态失败`);
    }
  };

  // 处理删除用户
  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      message.success('用户删除成功');
      refreshUsers();
    } catch (err) {
      message.error(err instanceof Error ? err.message : '删除用户失败');
    }
  };

  // 处理更新用户
  const handleUpdateUser = async () => {
    if (!editingUser || editingUserId === null) return;

    try {
      // 准备更新数据
      const updateData: any = { ...editingUser };
      
      // 如果提供了新密码，则进行哈希处理
      if (editingUserPassword) {
        updateData.password_hash = await passwordUtils.hashPassword(editingUserPassword);
      }
      
      // 确保日期格式正确
      if (updateData.expiry_date) {
        // 如果是Date对象，转换为格式化字符串
        if (updateData.expiry_date instanceof Date) {
          updateData.expiry_date = updateData.expiry_date.toISOString().slice(0, 19).replace('T', ' ');
        }
        // 如果是日期字符串，保持原样
        else if (typeof updateData.expiry_date === 'string' && updateData.expiry_date.includes('T')) {
          updateData.expiry_date = updateData.expiry_date.slice(0, 19).replace('T', ' ');
        }
      }

      await userService.updateUser(editingUserId, updateData);
      message.success('用户信息更新成功');
      setEditingUserId(null);
      setEditingUser(null);
      setEditingUserPassword('');
      refreshUsers();
    } catch (err) {
      console.error('更新用户失败:', err);
      message.error(err instanceof Error ? err.message : '更新用户信息失败');
    }
  };

  // 处理创建用户
  const handleCreateUser = async () => {
    if (!newUser.username || !newUser.password) {
      message.error('请填写用户名和密码');
      return;
    }

    try {
      const selectedType = membershipTypes.find(type => type.id === newUser.membership_type);
      if (!selectedType) {
        message.error('请选择有效的会员类型');
        return;
      }

      await userService.createUser(
        newUser.username,
        newUser.password,
        newUser.membership_type,
        selectedType?.days || 30
      );
      
      message.success('用户创建成功');
      setShowAddUserForm(false);
      setNewUser({
        username: '',
        password: '',
        membership_type: 'month',
        membership_days: 30,
        expiry_date: ''
      });
      refreshUsers();
    } catch (err) {
      message.error(err instanceof Error ? err.message : '创建用户失败');
    }
  };

  // 切换站点选择
  const toggleSiteSelection = (site: string) => {
    setSiteSettings(prev => {
      const newSelectedSites = prev.selectedSites.includes(site)
        ? prev.selectedSites.filter(s => s !== site)
        : [...prev.selectedSites, site];
      
      return {
        ...prev,
        selectedSites: newSelectedSites
      };
    });
  };

  // 授权码表格列定义
  const authCodeColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '授权码',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: '会员类型',
      dataIndex: 'membership_type',
      key: 'membership_type',
      render: (type: string) => {
        const membershipType = membershipTypes.find(t => t.id === type);
        return membershipType ? membershipType.name : type;
      },
    },
    {
      title: '会员天数',
      dataIndex: 'membership_days',
      key: 'membership_days',
    },
    {
      title: '状态',
      dataIndex: 'is_used',
      key: 'is_used',
      render: (is_used: boolean, record: AuthorizationCode) => (
        <Space>
          <Tag color={is_used ? 'red' : 'green'}>
            {is_used ? '已使用' : '未使用'}
          </Tag>
          {is_used && record.user && record.user.username && (
            <span>使用者: {record.user.username}</span>
          )}
          {is_used && !record.user && record.used_by && (
            <span>使用者: 用户ID {record.used_by}</span>
          )}
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: AuthorizationCode) => (
        <Space>
          <Popconfirm
            title="确定要删除这个授权码吗？"
            onConfirm={() => handleDeleteAuthCode(record.id!)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              icon={<DeleteIcon width={16} height={16} />} 
              danger 
              size="small" 
              type="text"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 用户表格列定义
  const userColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '会员类型',
      dataIndex: 'membership_type',
      key: 'membership_type',
      render: (type: string) => {
        const membershipType = membershipTypes.find(t => t.id === type);
        return membershipType ? membershipType.name : type;
      },
    },
    {
      title: '状态',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active: boolean, record: User) => (
        <Switch
          checked={is_active}
          onChange={(checked) => handleToggleUserStatus(record.id!, checked)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '过期时间',
      dataIndex: 'expiry_date',
      key: 'expiry_date',
      render: (date: string) => date ? new Date(date).toLocaleString() : '无',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => {
              setEditingUserId(record.id!);
              setEditingUser(record);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDeleteUser(record.id!)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              icon={<DeleteIcon width={16} height={16} />} 
              danger 
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="mb-0">用户管理</Title>
        <Button 
          type="primary" 
          onClick={() => navigate('/')}
        >
          返回主页
        </Button>
      </div>
      
      <Tabs defaultActiveKey="1">
        <TabPane tab="授权码管理" key="1">
          <Card>
            <div className="mb-4 flex justify-between">
              <Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={() => setShowAuthCodeForm(true)}
                >
                  添加授权码
                </Button>
                <Button 
                  icon={<PlusOutlined />} 
                  onClick={() => setShowBatchGenerateForm(true)}
                >
                  批量生成
                </Button>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={() => loadAuthCodes(currentPage)}
                >
                  刷新
                </Button>
                <Popconfirm
                  title={`确定要删除选中的 ${selectedAuthCodes.length} 个授权码吗？`}
                  onConfirm={handleBatchDeleteAuthCodes}
                  okText="确定"
                  cancelText="取消"
                  disabled={selectedAuthCodes.length === 0}
                >
                  <Button 
                    icon={<DeleteIcon width={16} height={16} />} 
                    danger
                    disabled={selectedAuthCodes.length === 0}
                  >
                    批量删除 ({selectedAuthCodes.length})
                  </Button>
                </Popconfirm>
              </Space>
              
              <Space>
                <Select
                  placeholder="会员类型"
                  style={{ width: 120 }}
                  value={filters.membership_type || undefined}
                  onChange={(value) => handleFilterChange('membership_type', value)}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                >
                  <Option value="">全部</Option>
                  {membershipTypes.map(type => (
                    <Option key={type.id} value={type.id}>{type.name}</Option>
                  ))}
                </Select>
                <Select
                  placeholder="使用状态"
                  style={{ width: 120 }}
                  value={filters.is_used || undefined}
                  onChange={(value) => handleFilterChange('is_used', value)}
                  allowClear
                >
                  <Option value="">全部</Option>
                  <Option value="true">已使用</Option>
                  <Option value="false">未使用</Option>
                </Select>
                <Button onClick={resetFilters}>重置筛选</Button>
              </Space>
            </div>
            
            <Table
              dataSource={authCodes}
              columns={authCodeColumns}
              loading={authCodeLoading}
              pagination={false}
              rowKey="id"
              rowSelection={{
                selectedRowKeys: selectedAuthCodes,
                onChange: (selectedRowKeys: React.Key[]) => {
                  setSelectedAuthCodes(selectedRowKeys.map(key => Number(key)));
                },
              }}
            />
            
            <div className="mt-4 flex justify-end">
              <Pagination
                current={currentPage}
                total={totalCount}
                pageSize={pageSize}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger
                onShowSizeChange={(_, size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            </div>
          </Card>
        </TabPane>
        
        <TabPane tab="用户管理" key="2">
          <Card>
            <div className="mb-4">
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => setShowAddUserForm(true)}
              >
                添加用户
              </Button>
            </div>
            
            <Table
              dataSource={users}
              columns={userColumns}
              loading={userLoading}
              pagination={false}
              rowKey="id"
            />
          </Card>
        </TabPane>
        
        <TabPane tab="站点设置" key="3">
          <Card title="API站点配置">
            <Form layout="vertical">
              <Form.Item label="自定义API地址">
                <Input
                  value={siteSettings.customApiUrl}
                  onChange={(e) => setSiteSettings(prev => ({ 
                    ...prev, 
                    customApiUrl: e.target.value 
                  }))}
                  placeholder="例如: https://api.example.com"
                  status={!siteSettings.isValidUrl && siteSettings.customApiUrl ? 'error' : ''}
                />
                {siteSettings.customApiUrl && !siteSettings.isValidUrl && (
                  <div className="text-red-500 mt-1">请输入有效的URL地址</div>
                )}
              </Form.Item>
              
              <Form.Item label="可用站点">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {siteSettings.allSites.map(site => (
                    <Checkbox
                      key={site}
                      checked={siteSettings.selectedSites.includes(site)}
                      onChange={() => toggleSiteSelection(site)}
                    >
                      {site}
                    </Checkbox>
                  ))}
                </div>
              </Form.Item>
              
              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    onClick={saveSiteSettings}
                    loading={siteSettingsLoading}
                  >
                    保存设置
                  </Button>
                  <Button onClick={resetSiteSettings}>
                    重置默认
                  </Button>
                </Space>
              </Form.Item>
            </Form>
            
            {siteSettingsError && (
              <div className="text-red-500 mt-2">{siteSettingsError}</div>
            )}
          </Card>
        </TabPane>
      </Tabs>
      
      {/* 添加授权码模态框 */}
      <Modal
        title="添加授权码"
        open={showAuthCodeForm}
        onOk={handleCreateAuthCode}
        onCancel={() => setShowAuthCodeForm(false)}
        okText="创建"
        cancelText="取消"
      >
        <Form layout="vertical">
          <Form.Item label="授权码">
            <Space>
              <Input
                value={newAuthCode}
                onChange={(e) => setNewAuthCode(e.target.value)}
                placeholder="请输入授权码"
              />
              <Button onClick={generateRandomCode}>随机生成</Button>
            </Space>
          </Form.Item>
          
          <Form.Item label="会员类型">
            <Select
              value={selectedMembershipType}
              onChange={setSelectedMembershipType}
            >
              {membershipTypes.map(type => (
                <Option key={type.id} value={type.id}>{type.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 批量生成模态框 */}
      <Modal
        title="批量生成授权码"
        open={showBatchGenerateForm}
        onOk={handleBatchGenerate}
        onCancel={() => setShowBatchGenerateForm(false)}
        okText="生成"
        cancelText="取消"
      >
        <Form layout="vertical">
          <Form.Item label="生成数量">
            <Input
              type="number"
              value={batchGenerateConfig.count}
              onChange={(e) => setBatchGenerateConfig(prev => ({
                ...prev,
                count: parseInt(e.target.value) || 10
              }))}
              min="1"
              max="100"
            />
          </Form.Item>
          
          <Form.Item label="会员类型">
            <Select
              value={batchGenerateConfig.membership_type}
              onChange={(value) => setBatchGenerateConfig(prev => ({
                ...prev,
                membership_type: value
              }))}
            >
              {membershipTypes.map(type => (
                <Option key={type.id} value={type.id}>{type.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 添加用户模态框 */}
      <Modal
        title="添加用户"
        open={showAddUserForm}
        onOk={handleCreateUser}
        onCancel={() => setShowAddUserForm(false)}
        okText="创建"
        cancelText="取消"
      >
        <Form layout="vertical">
          <Form.Item label="用户名">
            <Input
              value={newUser.username}
              onChange={(e) => setNewUser(prev => ({
                ...prev,
                username: e.target.value
              }))}
              placeholder="请输入用户名"
            />
          </Form.Item>
          
          <Form.Item label="密码">
            <Input.Password
              value={newUser.password}
              onChange={(e) => setNewUser(prev => ({
                ...prev,
                password: e.target.value
              }))}
              placeholder="请输入密码"
            />
          </Form.Item>
          
          <Form.Item label="会员类型">
            <Select
              value={newUser.membership_type}
              onChange={(value) => setNewUser(prev => ({
                ...prev,
                membership_type: value
              }))}
            >
              {membershipTypes.map(type => (
                <Option key={type.id} value={type.id}>{type.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 编辑用户模态框 */}
      <Modal
        title="编辑用户"
        open={editingUserId !== null}
        onOk={handleUpdateUser}
        onCancel={() => {
          setEditingUserId(null);
          setEditingUser(null);
          setEditingUserPassword('');
        }}
        okText="保存"
        cancelText="取消"
      >
        {editingUser && (
          <Form layout="vertical">
            <Form.Item label="用户名">
              <Input
                value={editingUser.username || ''}
                onChange={(e) => setEditingUser(prev => prev ? {
                  ...prev,
                  username: e.target.value
                } : null)}
                placeholder="请输入用户名"
              />
            </Form.Item>
            
            <Form.Item label="密码">
              <Input.Password
                value={editingUserPassword}
                onChange={(e) => setEditingUserPassword(e.target.value)}
                placeholder="留空则不修改密码"
              />
            </Form.Item>
            
            <Form.Item label="会员类型">
              <Select
                value={editingUser.membership_type || 'month'}
                onChange={(value) => setEditingUser(prev => prev ? {
                  ...prev,
                  membership_type: value
                } : null)}
              >
                {membershipTypes.map(type => (
                  <Option key={type.id} value={type.id}>{type.name}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item label="状态">
              <Switch
                checked={editingUser.is_active}
                onChange={(checked) => setEditingUser(prev => prev ? {
                  ...prev,
                  is_active: checked
                } : null)}
                checkedChildren="启用"
                unCheckedChildren="禁用"
              />
            </Form.Item>
            
            <Form.Item label="会员过期时间">
              <DatePicker
                selected={editingUser.expiry_date ? new Date(editingUser.expiry_date) : null}
                onChange={(date) => setEditingUser(prev => prev ? {
                  ...prev,
                  expiry_date: date ? date.toISOString().slice(0, 19).replace('T', ' ') : ''
                } : null)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="时间"
                dateFormat="yyyy-MM-dd HH:mm:ss"
                placeholderText="选择过期时间"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default AntdUserManagement;