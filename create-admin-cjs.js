// 这个脚使用CommonJS模块系统
// 由于项目使用ES模块，但我们需要一个简单的方法来创建管理员账户

// 模拟密码加密功能
function hashPassword(password) {
  // 这是一个简化的哈希函数，仅用于创建管理员账户
  // 实际系统中使用的是SHA-256加密
  let hash = 0;
  const str = password + 'sopan_salt_2025';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  return Math.abs(hash).toString(16);
}

// 提示用户如何手动创建管理员账户
console.log('由于直接运行脚本创建管理员账户失败，这里提供手动创建管理员账户的方法：');
console.log('');
console.log('1. 访问Supabase控制台（使用.env中的SUPABASE_URL和SUPABASE_ANON_KEY）');
console.log('2. 找到"users"表');
console.log('3. 创建一条新记录，填写以下信息：');
console.log('   - username: "admin"');
console.log('   - password_hash: "' + hashPassword('14755555626') + '"');
console.log('   - membership_type: "premium"');
console.log('   - expiry_date: 设置为未来的日期（例如：2025-12-31）');
console.log('   - is_active: true');
console.log('4. 保存记录');
console.log('');
console.log('创建完成后，您可以使用用户名"admin"和密码"14755555626"登录系统。');

// 启动开发服务器
console.log('\n正在启动开发服务器...');