# Nest Template

一个基于 NestJS + Vue 3 的全栈项目模板，包含用户认证和用户管理功能。

## 技术栈

### 后端
- **NestJS** - Node.js 后端框架
- **TypeORM** - ORM 框架
- **PostgreSQL** - 数据库
- **JWT** - 身份认证
- **Swagger** - API 文档
- **bcrypt** - 密码加密

### 前端
- **Vue 3** + **TypeScript**
- **Vite** - 构建工具
- **Pinia** - 状态管理
- **Vue Router** - 路由
- **Tailwind CSS** - 样式
- **Reka UI** - UI 组件库
- **VeeValidate** + **Zod** - 表单验证
- **Axios** - HTTP 请求

## 项目结构

```
├── backend/                # NestJS 后端
│   └── src/
│       ├── modules/
│       │   ├── auth/       # 认证模块
│       │   └── user/       # 用户模块
│       ├── common/         # 公共模块
│       ├── config/         # 配置
│       └── shared/         # 工具函数
│
└── frontend/               # Vue 3 前端
    └── src/
        ├── views/          # 页面
        │   ├── auth/       # 登录/注册
        │   └── users/      # 用户管理
        ├── components/     # 组件
        ├── stores/         # Pinia 状态
        ├── lib/            # API 请求
        └── router/         # 路由配置
```

## 快速开始

### 环境要求
- Node.js 18+
- PostgreSQL

### 后端启动

```bash
cd backend
npm install
npm run start:dev
```

API 文档: http://localhost:3000/api/docs

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

前端地址: http://localhost:5173

## 功能特性

- 用户注册/登录
- JWT 认证
- 路由守卫
- 用户列表管理
- 响应式 UI 设计
