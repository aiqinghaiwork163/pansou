# 认证与管理员权限优化方案

## 当前问题

- 登录态保存在 `localStorage` / `sessionStorage`，前端可被篡改。
- 管理员身份依赖 `username === 'admin'`，没有服务端授权校验。
- 密码在浏览器端使用固定 salt + SHA-256 哈希，抗撞库和抗暴力破解能力不足。
- 前端直接读写 `users`、`authorization_codes`、`login_logs` 等敏感表，安全性高度依赖 RLS 是否正确配置。

## 目标状态

- 使用 Supabase Auth 管理账号、会话、密码重置和 token 刷新。
- 在数据库中维护用户角色，例如 `profiles.role in ('user', 'admin')`。
- 管理员权限由数据库/RLS/RPC 校验，前端只展示 UI，不作为最终授权边界。
- 敏感管理操作通过 Supabase RPC 或 Edge Function 执行，避免浏览器直接写敏感表。

## 建议迁移步骤

1. **引入 Supabase Auth**
   - 注册/登录改用 `supabase.auth.signUp`、`supabase.auth.signInWithPassword`。
   - 前端 `AuthProvider` 监听 `supabase.auth.onAuthStateChange`，不再手写本地登录态。

2. **建立 profile 与 role**
   - 新增 `profiles` 表，主键关联 `auth.users.id`。
   - 使用 `role` 字段标识管理员。
   - 后端通过 service role 或受控 RPC 初始化第一个管理员。

3. **收紧 RLS**
   - 普通用户只能读取自己的 profile、会员状态和必要公开配置。
   - 管理员 RPC/Edge Function 校验 `auth.uid()` 对应 role 后再执行用户、授权码和日志管理。
   - 禁止客户端直接更新其他用户的角色、密码哈希或授权码状态。

4. **替换前端权限判断**
   - `isAdministrator` 来自当前用户 profile/claim，而不是用户名。
   - `AdminProtectedRoute` 只负责 UI 路由拦截；所有写操作仍以后端授权为准。

5. **迁移历史用户**
   - 将旧 `users` 表账号迁移到 Supabase Auth。
   - 对无法还原密码的用户采用一次性重置密码或授权码绑定流程。

## 过渡期防护

- 保持 RLS 默认拒绝，逐项开放必要查询。
- 删除代码中的硬编码 Supabase fallback，所有环境必须显式配置。
- 管理端操作记录审计日志，至少记录操作者、目标资源、操作类型和时间。
- 若旧 admin 凭据曾提交到远端，立即轮换相关密钥和管理员密码。
