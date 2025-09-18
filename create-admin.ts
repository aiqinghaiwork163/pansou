import { userService, supabase, passwordUtils } from './src/lib/supabase';

// 创建管理员账户的函数
async function createAdminAccount() {
  try {
    console.log('正在创建管理员账户...');
    
    // 创建管理员用户
    const adminUser = await userService.createUser(
      'admin',               // 用户名
      '14755555626',         // 密码
      'premium',             // 会员类型
      365                    // 会员天数（365天）
    );
    
    console.log('管理员账户创建成功！');
    console.log('用户信息:', adminUser);
  } catch (error) {
    console.error('创建管理员账户失败:', error instanceof Error ? error.message : String(error));
    
    // 尝试直接更新admin用户的密码（如果用户已存在）
    try {
      const passwordHash = await passwordUtils.hashPassword('14755555626');
      
      const { error: updateError } = await supabase
        .from('users')
        .update({
          password_hash: passwordHash,
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('username', 'admin');
      
      if (updateError) {
        console.error('更新管理员密码失败:', updateError.message);
      } else {
        console.log('管理员密码已更新成功！');
      }
    } catch (updateError) {
      console.error('更新管理员密码过程中发生错误:', updateError instanceof Error ? updateError.message : String(updateError));
    }
  }
}

// 运行函数
createAdminAccount();