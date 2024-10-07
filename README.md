# RotaPuzzle

RotaPuzzle是一款基于Web的拼图测试游戏,旨在通过有趣的拼图挑战来锻炼玩家的空间推理能力。

## 项目概述

### 功能特点
- 随机生成的拼图碎片和目标形状
- 拖拽和旋转碎片的交互机制
- 难度递增的关卡系统
- 计分功能
- 视觉和听觉反馈增强用户体验
- 响应式设计，适应不同屏幕尺寸
- 可自定义的游戏设置（关卡数和难度）
- 多语言支持（英文、简体中文、繁体中文、日文、韩文、法语、西班牙语）

### 目标
创造一个既有趣又具有挑战性的拼图游戏,通过逐步增加的难度来提高玩家的空间推理能力。

## 技术栈
- 前端: HTML5, CSS3, JavaScript (ES6+), React
- 图形处理: SVG
- 交互库: interact.js
- 响应式设计: CSS媒体查询, Flexbox/Grid
- 构建工具: Webpack
- 版本控制: Git

## 部署架构

1. **本地开发环境（使用 Cursor）**
   - 安装依赖：在 Cursor 的终端中运行 `npm run install:all` 安装所有项目依赖。
   - 启动开发服务器：
     在 Game-rotapuzzle 根目录下的终端中运行：
     ```bash
     npm run dev
     ```
     这个命令会同时启动前端和后端服务器。

2. **线上正式环境（阿里云）**
   - 前端部署在阿里云 OSS 上，实现静态资源的快速分发。
   - 后端使用阿里云 ECS 实例，运行 Node.js 应用。
   - 数据库使用阿里云 RDS（MySQL）或 MongoDB 云数据库。

## 目录文件说明

### backend/
后端代码目录，包含 Express.js 服务器和 API 实现。

### frontend/
前端代码目录，包含 React 组件和页面。

### docs/
项目文档目录：
- CHANGELOG.md: 记录项目版本更新和变更。
- Game Design Documents.md: 详细的游戏设计文档。
- GithubReadme.md: GitHub 仓库的说明文档。
- Project Plan.md: 项目开发计划和迭代安排。
- UE Documents.md: 用户体验设计文档。

### prototype/
HTML 原型文件目录，包含各个游戏界面的初始设计。

### package.json
项目依赖和脚本配置文件。

## 当前进度

根据 CHANGELOG.md 文件，当前项目版本为 0.1.0-d01，主要完成了以下内容：

1. 实现了随机多边形形状生成功能
2. 实现了形状居中显示在游戏区域
3. 创建了 TestShapeGeneration 页面用于测试和演示
4. 实现了基本的切割线生成功能

待完成的任务包括：
- 实现曲线形状生成功能
- 实现曲线切割功能
- 优化切割线生成算法
- 实现形状碎片的分离和显示功能

## 安装和运行

### 本地测试和运行环境

#### 运行环境要求
- Node.js (版本 14.x 或更高)
- npm (版本 6.x 或更高) 或 yarn (版本 1.x 或更高)
- MongoDB (版本 4.x 或更高) 或 Firebase
- Cursor IDE

#### 安装步骤
1. 安装 Cursor IDE：从 https://cursor.sh/ 下载并安装。

2. 克隆项目代码：
   - 打开 Cursor IDE
   - 使用 Cursor 的 Git 功能克隆项目：
     ```
     https://github.com/yourusername/RotaPuzzle.git
     ```

3. 安装依赖：
   - 在 Cursor 的终端中运行：
     ```bash
     cd RotaPuzzle
     npm run install:all
     ```

4. 启动开发服务器：
   - 在 Game-rotapuzzle 根目录下的终端中运行：
     ```bash
     npm run dev
     ```
   - 这个命令会同时启动前端和后端服务器。

   如果遇到端口冲突问题（例如，"Error: listen EADDRINUSE: address already in use :::3001"），请尝试以下步骤：

   a. 检查前端使用 3001 端口的其他进程。
      frontend/package.json 中的 start 脚本：
      ```json
      "start": "webpack serve --mode development --open --port 3001"
      ```
   b. 如果问题仍然存在，可以尝试分别启动前端和后端：
      ```bash
      # 在一个终端中启动后端
      npm run start:backend

      # 在另一个终端中启动前端
      npm run start:frontend
      ```

5. 开发：
   - 使用 Cursor 的智能代码补全和 AI 辅助功能进行开发。
   - 实时预览：
     - 前端：在浏览器中打开 http://localhost:3001 （如果修改了端口，请使用相应的端口号）
     - 后端 API：可以通过 http://localhost:5000 访问

### 线上正式运行环境（阿里云部署）

1. 阿里云账号设置：
   - 注册阿里云账号并完成实名认证。
   - 开通所需的阿里云服务：OSS、ECS、RDS（或MongoDB）。

2. 前端部署（阿里云 OSS）：
   - 创建 OSS Bucket 并配置为静态网站托管。确保权限设置正确，静态网站托管功能已启用。
   - 在本地 frontend 目录运行构建命令：`npm run build`
   - 安装并配置阿里云 OSS 工具（如 ossutil）。
   - 使用 OSS 工具上传 frontend/dist 目录下的构建文件到 Bucket。

3. 后端部署（阿里云 ECS）：
   a. 准备工作：
      - 创建并配置 ECS 实例，选择适合的操作系统（如 Ubuntu）和合适的实例规格。
      - 确保安全组规则允许 SSH 连接（默认端口 22）和应用所需的其他端口。

   b. 安装 Node.js 和 npm：
      - 连接到 ECS 实例后，运行以下命令安装 Node.js 和 npm：
        ```bash
        curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
        sudo apt-get install nodejs
        ```
      - 验证安装：
        ```bash
        node --version
        npm --version
        ```
      - 全局安装 PM2（避免权限问题）：
        ```bash
        sudo chown -R $USER:$USER /usr/local
        npm install pm2 -g
        ```

   c. SSH 连接到 ECS 实例：
      ```bash
      ssh your_username@your_ecs_ip
      ```
      其中，`your_username`是你ECS实例上的用户名（默认可能是`root`），`your_ecs_ip`是你的ECS实例的公网IP地址。

   d. 导入项目代码：
      使用 SCP 或 SFTP 将后端代码安全地上传到 ECS。确保上传路径正确。
      ```bash
      scp -r path_to_your_project_folder/* your_username@your_ecs_ip:/path/on/ecs/to/project_folder
      ```

   e. 切换到项目目录：
      ```bash
      cd /path/on/ecs/to/project_folder
      ```
      在ECS的命令行中，切换到包含`package.json`的项目根目录。

   f. 安装项目依赖：
      ```bash
      npm install
      ```
      注：`npm install`命令可能会因网络问题而失败，可以考虑使用国内镜像源加快安装速度。装速度。

   g. 查看安装结果：
      确保 `node_modules` 文件夹已创建，`package-lock.json` 文件已更新。

   h. 配置环境变量：
      - 创建 `.env` 文件来存储环境变量：
        ```bash
        touch .env
        ```
      - 编辑 `.env` 文件，添加必要的环境变量（如数据库连接字符串、API密钥等）。
      - 安装 `dotenv` 包来管理环境变量：
        ```bash
        npm install dotenv
        ```
      - 在应用的入口文件（如 `app.js` 或 `server.js`）中加载环境变量：
        ```javascript
        require('dotenv').config();
        ```

   i. 启动应用：
      使用 PM2 启动后端服务：
      ```bash
      pm2 start npm --name "backend" -- run start:backend
      ```
      注意：确保 `package.json` 中定义了 `start:backend` 脚本。

4. 数据库设置：
   - 创建 RDS 实例（MySQL）或 MongoDB 云数据库。
   - 配置数据库连接信息和安全组，确保只允许来自 ECS 的访问。

5. 网络安全配置：
   - 配置 ECS 安全组，只开放必要的端口（如 80、443 用于 Web 访问）。
   - 设置 RDS 或 MongoDB 的网络访问控制，只允许来自 ECS 的连接。

6. 域名和 HTTPS：
   - 在阿里云购买域名并完成备案（中国大陆要求）。
   - 配置域名解析，将前端指向 OSS，后端指向 ECS。
   - 申请并配置 SSL 证书，确保 HTTPS 访问。

7. 监控和维护：
   - 设置阿里云监控告警，包括 ECS、OSS 和数据库的性能指标。
   - 配置日志收集（如使用阿里云日志服务）。
   - 定期检查应用日志和性能指标。
   - 根据业务增长情况，适时调整资源配置。

8. 自动化部署（可选）：
   - 考虑使用 Jenkins、GitLab CI/CD 等自动化部署工具来简化部署流程。

注意事项：
- 在生产环境中，建议使用非 root 用户来运行应用和服务。
- 确保所有敏感信息都通过环境变量或密钥管理服务进行管理，不要硬编码在代码中。
- 定期更新 ECS 实例的操作系统和所有依赖包，以保证安全性。
- 实施定期备份策略，特别是对于数据库数据。
- 考虑使用阿里云 CDN 服务来提高静态资源的访问速度。
- 在每个部署步骤后进行必要的测试，确保部署成功且应用正常运行。

在实际部署过程中，请根据项目的具体需求和阿里云的最新最佳实践进行相应的调整。

## 贡献指南

请参阅 `docs/Cursor Operation guide.md` 文件了解如何通过 Cursor 贡献代码和使用 Git 进行版本控制。

## 许可证

[待定]

## 联系方式
recohcity@gmail.com
