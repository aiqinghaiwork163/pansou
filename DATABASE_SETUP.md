# Supabase数据库表结构

## 搜索历史表 (search_history)

```sql
CREATE TABLE search_history (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  keyword TEXT NOT NULL,
  results_count INTEGER DEFAULT 0,
  search_time INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建索引
CREATE INDEX idx_search_history_keyword ON search_history(keyword);
CREATE INDEX idx_search_history_created_at ON search_history(created_at);
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
```

## 用户设置表 (user_settings)

```sql
CREATE TABLE user_settings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  api_url TEXT,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  language TEXT DEFAULT 'zh' CHECK (language IN ('zh', 'en')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- 创建索引
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
```

## 行级安全策略 (RLS)

```sql
-- 启用行级安全
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- 搜索历史表策略
CREATE POLICY "用户只能查看自己的搜索历史" ON search_history
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "用户只能插入自己的搜索历史" ON search_history
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "用户只能删除自己的搜索历史" ON search_history
  FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- 用户设置表策略
CREATE POLICY "用户只能查看自己的设置" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "用户只能更新自己的设置" ON user_settings
  FOR ALL USING (auth.uid() = user_id);
```

## 环境变量配置

在 `.env.local` 文件中添加：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 安装依赖

```bash
pnpm add @supabase/supabase-js
```

## 使用说明

1. 在 Supabase 控制台创建新项目
2. 在 SQL 编辑器中执行上述建表语句
3. 配置环境变量
4. 在 React 组件中使用 `useSearchHistory` Hook

## 实时功能

Supabase 支持实时订阅，可以监听数据变化：

```typescript
import { subscribeToSearchHistory } from '@/lib/supabase'

// 订阅搜索历史变化
const subscription = subscribeToSearchHistory((payload) => {
  console.log('搜索历史更新:', payload)
})

// 取消订阅
subscription.unsubscribe()
```