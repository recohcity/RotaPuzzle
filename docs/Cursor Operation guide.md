# Cursor 操作指南

# 目录
在 Cursor 中 GitHub 的操作指南
1. [连接GitHub账户](#1-连接github账户)
2. [克隆仓库](#2-克隆仓库)
3. [创建/切换分支](#3-创建切换分支)
4. [提交更改](#4-提交更改)
5. [推送到远程](#5-推送到远程)
6. [回滚操作](#6-回滚操作)
7. [拉取更新](#7-拉取更新)
8. [查看/创建 Pull Request](#8-查看创建-pull-request)
9. [查看 Git 历史](#9-查看-git-历史)
10. [解决冲突](#10-解决冲突)
11. [配置 .gitignore](#11-配置-gitignore)
GitHub 操作指南
1. [本地代码版本管理和同步到 GitHub](#1-本地代码版本管理和同步到-github)
2. [分支管理](#2-分支管理)
3. [高级 Git 操作](#3-高级-git-操作)
4. [GitHub CLI 使用](#4-github-cli-使用)
5. [实践建议](#5-最佳实践)
6. [故障排除](#6-故障排除)
7. [高级技巧](#7-高级技巧)
8. [配置 Git](#8-配置-git)
9. [使用 GitHub 功能](#9-使用-github-功能)
10. [参考资料](#10参考资料)


# Cursor AI

## AI Chat 和 Composer 的区别

- AI Chat
     功能
       - 主要用于与 AI 进行对话,获取代码建议、解释和帮助。
       - 适用于快速提问和即时获取信息。
       - 通常用于单个文件或小范围的代码问题。
     场景
       - 适用于需要即时帮助、解答疑问或获取编程建议的场景。
       - 用户可以通过对话的方式与 AI 交流，获取所需的信息。

- Composer
    功能
       - Composer 是一个代码生成和编辑工具。
       - 帮助用户生成代码片段、自动补全代码、重构代码等。
       - 适用于复杂的代码审查、跨文件的变更和性能优化。
   场景
       - 适用于需要同时处理多个文件、进行复杂代码审查和优化的场景。
       - 用户可以通过 Composer 快速生成代码模板、进行代码重构，提升编程效率。

## Cursor Composer
    Cursor 的多文档代码编辑器 Composer 是一个强大的功能,可以帮助开发者同时处理多个相关文件。以下是关于 Composer 的详细使用指南:

    1. 打开 Composer:
       - 在 Cursor 界面中,点击左侧边栏的 Composer 图标(通常看起来像一个多页文档的图标)
       - 或使用快捷键 Ctrl+Shift+C (Windows/Linux) 或 Cmd+Shift+C (Mac)

    2. 选择文件:
    - 在 Composer 视图中,你会看到一个文件选择器
    - 浏览你的项目目录,选择你想要同时编辑的文件
    - 可以选择多个文件,它们会在 Composer 中并排显示

    3. 布局调整:
    - Composer 默认会平均分配空间给每个打开的文件
    - 你可以通过拖动分隔线来调整各个文件的显示大小

    4. 同步滚动:
    - Composer 支持同步滚动,当你滚动一个文件时,其他文件也会相应滚动
    - 这在比较相似代码或查看相关内容时特别有用

    5. 代码编辑:
    - 在 Composer 中,你可以像在普通编辑器中一样编辑代码
    - 所有的编辑功能(如自动完成、代码片段等)都可用

    6. 使用 AI 辅助:
    - Composer 与 Cursor 的 AI 功能完全集成
    - 你可以在任何打开的文件中使用 AI 辅助功能
    - 例如,可以要求 AI 解释某个函数或建议改进代码

    7. 跨文件搜索和替换:
    - 使用 Composer 的搜索功能可以在所有打开的文件中同时搜索
    - 这对于跨文件的重构和修改非常有用

    8. 代码导航:
    - Composer 保留了 Cursor 的代码导航功能
    - 你可以使用 "Go to Definition" 和 "Find References" 等功能在文件间跳转

    9. 保存更改:
    - 在 Composer 中的更改会实时保存到各个文件
    - 你可以使用常规的保存快捷键来确保更改被保存

    10. 关闭文件:
        - 要从 Composer 中移除某个文件,点击文件标签上的关闭按钮
        - 这不会关闭实际文件,只是从 Composer 视图中移除

    11. 重新排序文件:
        - 你可以通过拖拽文件标签来重新排序 Composer 中的文件

    12. 使用版本控制:
        - Composer 完全支持 Git 集成
        - 你可以看到文件的 Git 状态,进行提交等操作

    13. 分屏编辑:
        - 在 Composer 中,你可以将一个文件分成多个视图
        - 右键点击文件标签,选择 "Split Right" 或 "Split Down"

    14. 快捷切换:
        - 使用 Ctrl+Tab (Windows/Linux) 或 Cmd+Tab (Mac) 可以快速在 Composer 中的文件间切换

    15. 自定义 Composer:
        - 在 Cursor 的设置中,你可以自定义 Composer 的行为
        - 例如,你可以设置默认布局、同步滚动行为等

    16. 使用 Composer 进行代码审查:
        - Composer 非常适合进行代码审查
        - 你可以并排比较不同版本的文件或相关的代码片段

     17. 保存 Composer 会话:
        - Cursor 会记住你的 Composer 布局
        - 下次打开项目时,你可以快速恢复到之前的工作状态

     使用 Composer 可以显著提高处理多个相关文件时的效率。它特别适合进行跨文件的重构、比较不同实现、审查代码等任务。如果你在使用过程中遇到任何问题或需要更多信息,请随时告诉我。
 
 ## AI 辅助编码

     1. 激活 AI 助手:
        - 使用快捷键 Ctrl+K (Windows/Linux) 或 Cmd+K (Mac)
        - 或点击编辑器右下角的 AI 图标

     2. 代码补全:
        - 开始输入代码时,AI 会自动提供智能补全建议
        - 这些建议基于上下文和您的编码风格

     3. 代码生成:
        - 在注释中描述您想要的功能
        - AI 会根据描述生成相应的代码

     4. 代码解释:
        - 选中一段代码,然后询问 AI "这段代码是做什么的?"
        - AI 会提供详细解释

     5. 代码重构:
        - 选择要重构的代码
        - 要求 AI "重构这段代码以提高可读性"

     6. 错误修复:
        - 当遇到错误时,复制错误信息
        - 询问 AI "如何修复这个错误?"

     7. 文档生成:
        - 选择一个函数或类
        - 要求 AI "为这个函数生成文档注释"

     8. 单元测试生成:
        - 选择要测试的代码
        - 要求 AI "为这段代码生成单元测试"

     9. 性能优化建议:
        - 询问 AI "如何优化这段代码的性能?"

     10. 代码风格调整:
        - 要求 AI "将这段代码调整为符合PEP 8风格"(以 Python 为例)

     11. 学习新概念:
        - 遇到不熟悉的概念时,直接询问 AI

     12. 多语言支持:
        - AI 助手支持多种编程语言,可以根据当前文件类型自动调整
 
 ##  代码审查
     在 Cursor 中进行代码审查是一个强大且高效的过程,结合了其 AI 功能和 GitHub 集成。
     以下是在 Cursor 中进行代码审查的详细步骤和最佳实践:

     1. 访问待审查的 Pull Request (PR):
     - 使用命令面板 (Ctrl+Shift+P 或 Cmd+Shift+P)
     - 输入 "GitHub: Open Pull Request in Editor"
     - 选择要审查的 PR

     2. 查看 PR 概览:
     - Cursor 会打开一个新标签,显示 PR 的详细信息
     - 查看 PR 的描述、提交历史和变更文件列表

     3. 检查变更:
     - 点击 "Changes" 标签查看具体的代码变更
     - Cursor 会以并排视图显示变更前后的代码

     4. 使用 AI 辅助审查:
     - 选中一段代码,使用 Ctrl+K (Windows/Linux) 或 Cmd+K (Mac) 激活 AI
     - 询问 AI 关于代码的问题,如 "这段代码有什么潜在问题?"
     - 要求 AI 解释复杂的逻辑或建议改进

     5. 添加行内评论:
     - 将鼠标悬停在代码行号上,点击出现的 "+" 图标
     - 输入您的评论或建议
     - 使用 Markdown 格式您的评论

     6. 提���代码建议:
     - 在添加评论时,点击 "Suggest an edit" 按钮
     - 编辑代码以提出具体的修改建议
     - PR 作者可以直接接受这些建议

     7. 批量审查文件:
     - 使用 Cursor 的 Composer 功能同时打开多个相关文件
     - 这对于理解跨文件的变更特别有用

     8. 检查代码风格:
     - 使用 Cursor 的内置 linter 检查代码是否符合项目的代码风格指南
     - 要求 AI 检查并建议风格改进

     9. 运行和测试代码:
     - 使用 Cursor 的终端功能在本地运行代码
     - 执行单元测试和集成测试

     10. 性能考虑:
     - 询问 AI "这些变更会对性能产生什么影响?"
     - 使用 Cursor 的性能分析工具(如果可用)

    11. 安全审查:
     - 要求 AI 检查潜在的安全问题
     - 特别注意敏感数据处理、输入验证等

    12. 文档审查:
     - 检查是否更新了相关文档
    - 要求 AI 生成或改进文档注释

     13. 提交审查结果:
     - 完成审查后,使用命令面板选择 "GitHub: Submit Review"
     - 选择 "Comment", "Approve", 或 "Request Changes"
     - 添加总结性评论

     14. 跟进讨论:
     - 使用 Cursor 的 GitHub 集成功能回复评论和讨论
     - 继续使用 AI 辅助回答问题或解决问题

     15. 重新审查:
     - 当 PR 作者做出更改后,使用 "GitHub: Refresh Pull Request" 命令更新视图
     - 重复上述步骤进行再次审查

     16. 合并 PR:
     - 如果您有权限,可以直接在 Cursor 中合并 PR
     - 使用命令面板选择 "GitHub: Merge Pull Request"



   

## 实践建议

     1. 使用 AI 进行初步审查,但不要完全依赖它。
     2. 关注代码的可读性、可维护性和可扩展性。
     3. 检查是否遵循了项目的编码标准和最佳实践。
     4. 考虑边界情况和错误处理。
     5. 鼓励积极的反馈,指出好的实践和改进。
     6. 使用 Cursor 的协作功能与团队成员讨论复杂问题。
     7. 定期同步远程分支,确保审查的是最新代码。
     8. 利用 Cursor 的多文件比较功能理解更大的上下文。
     9. 使用 AI 辅助编写清晰、有建设性的评论。
     10. 在提交最终审查之前,再次全面检查所有变更。

     通过结合 Cursor 的强大功能和这些最佳实践,您可以进行高效、全面的代码审查,提高代码质量并促进团队协作。如果您需要任何特定步骤的更多详细信息,请随时询问。

# 在 Cursor 中 GitHub 的操作指南

## 1. 连接GitHub账户
    - 打开 Cursor 编辑器
    - 点击左侧边栏底部的齿轮图标,打开设置
    - 在设置中找到 "GitHub" 选项
    - 点击 "Connect to GitHub" 按钮
    - 按提示登录你的 GitHub 账户并授权 Cursor 访问

## 2. 克隆仓库
    - 点击左侧边栏的 "Source Control" 图标
    - 选择 "Clone Repository"
    - 从列表中选择想要克隆的仓库,或输入仓库 URL
    - 选择本地保存路径,点击 "Clone" 完成克隆

## 3. 分支管理
    - 在左下角状态栏点击当前分支名称
    - 在弹出菜单中选择已有分支,或选择 "Create new branch"
    - 详细操作指引
     1） 创建新分支:
        a. 使用状态栏:
        - 在 Cursor 窗口的左下角,你会看到当前分支的名称(通常是 "main" 或 "master")
        - 点击这个分支名称
        - 在弹出的菜单中,选择 "Create new branch"
        - 输入新分支的名称
        - 按 Enter 键确认

        b. 使用命令面板:
        - 按 Ctrl+Shift+P (Windows/Linux) 或 Cmd+Shift+P (Mac) 打开命令面板
        - 输入 "Git: Create Branch"
        - 选择这个选项
        - 输入新分支的名称
        - 按 Enter 键确认

        c. 使用源代码管理视图:
        - 点击左侧活动栏中的源代码管理图标(通常是一个分叉的图标)
        - 在源代码管理视图的顶部,你会看到当前分支名称
        - 点击分支名称旁边的 "..." 按钮
        - 选择 "Create Branch"
        - 输入新分支的名称
        - 按 Enter 键确认

     2） 切换分支:
        a. 使用状态栏:
        - 点击左下角的当前分支名称
        - 在弹出的菜单中,你会看到所有可用的本地和远程分支
        - 选择你想切换到的分支

        b. 使用命令面板:
        - 打开命令面板 (Ctrl+Shift+P 或 Cmd+Shift+P)
        - 输入 "Git: Checkout to"
        - 选择这个选项
        - 从列表中选择你想切换到的分支

        c. 使用源代码管理视图:
        - 打开源代码管理视图
        - 在 "BRANCHES" 部分,你会看到所有的分支
        - 右键点击你想切换到的分支
        - 选择 "Checkout"

     3） 从远程创建新分支:
        - 如果你想基于远程分支创建新的本地分支:
        - 在源代码管理视图中,展开 "REMOTES" 部分
        - 右键点击你想基于的远程分支
        - 选择 "Checkout to..."
        - Cursor 会提示你输入新的本地分支名称
        - 输入名称并按 Enter

     4） 创建并切换到新分支:
        - 使用命令面板,输入 "Git: Create Branch"
        - 输入新分支名称
        - Cursor 会自动创建新分支并切换到该分支

     5.）分支操作注意事项:
        - 创建新分支前,确保你当前在正确的基础分支上
        - 切换分支前,确保你的工作区是干净的(所有更改都已提交或存储)
        - 如果有未提交的更改,Cursor 会提示你处理这些更改(提交、存储或放弃)

     6） 查看当前分支:
        - 随时查看左下角状态栏,它会显示当前分支名称
        - 在源代码管理视图中,当前分支会被高亮显示

     7） 推送新分支到远程仓库:
        - 创建新分支后,你可能需要将其推送到远程仓库
        - 在源代码管理视图中,点击 "Publish Branch" 按钮
        - 或使用命令面板,输入 "Git: Push" 并选择该选项

     8） 删除分支:
        - 使用命令面板,输入 "Git: Delete Branch"
        - 选择要删除的分支
        - 注意: 不能删除当前所在的分支

     9） 合并分支:
        a. 切换到目标分支:
        - 确保你当前在要合并到的目标分支上（通常是主分支，如 main 或 master）
        - 使用状态栏或命令面板切换到目标分支

        b. 使用命令面板合并:
        - 打开命令面板（通常是 Ctrl+Shift+P 或 Cmd+Shift+P）
        - 输入 "Git: Merge Branch" 并选择该命令
        - 从列表中选择你要合并的源分支

        c. 解决冲突（如果有）:
        - 如果有冲突，Cursor 会在文件中标记冲突区域
        - 打开有冲突的文件
        - 查找被 <<<<<<< 和 >>>>>>> 标记的冲突区域
        - 编辑文件以解决冲突，保留你想要的更改
        - 删除冲突标记（<<<<<<< HEAD, =======, 和 >>>>>>> branch-name）
        - 在源代码管理视图中，将解决了冲突的文件标记为已解决

        d. 完成合并:
        - 解决所有冲突后，在源代码管理视图中暂存更改
        - 输入合并提交信息
        - 点击 "Commit" 按钮完成合并

        e. 推送合并结果:
        - 使用 "Sync Changes" 按钮或命令将合并结果推送到远程仓库

     10） 合并特定提交（Cherry-pick）:
        - 如果你只想合并特定的提交而不是整个分支:
        - 使用命令面板，输入 "Git: Cherry Pick"
        - 选择要合并的特定提交

     11） 中止合并:
        - 如果在合并过程中遇到问题想要中止:
        - 使用命令面板，输入 "Git: Abort Merge"
        - 选择该选项以取消当前的合并操作

注意：对于复杂的合并操作，有时使用命令行或专门的合并工具可能更方便。Cursor 允许你使用集成终端来执行更复杂的 Git 操作。

## 4. 提交更改
    - 修改代码后,在 "Source Control" 面板中查看更改
    - 在更改列表中勾选要提交的文件
    - 输入提交信息
    - 点击 "Commit" 按钮提交更改
    + 以下是完整的提交操作指南:
     1） 查看更改:
     - 点击左侧活动栏中的源代码管理图标(通常看起来像一个分叉的图标)
     - 这将打开源代码管理视图,显示所有修改过的文件

     2）暂存更改:
     a. 暂存单个文件:
     - 在源代码管理视图中,找到您想要提交的文件
     - 将鼠标悬停在文件名上,点击文件名旁边的 "+" 图标
     - 或者右键点击文件名,选择 "Stage Changes"

     b. 暂存所有更改:
     - 在源代码管理视图顶部,点击 "Stage All Changes" 按钮(看起来像一个加号)

     c. 暂存文件的部分更改:
     - 双击修改的文件以打开差异视图
     - 在差异视图中,点击您想要暂存的特定行旁边的 "+" 图标

     3） 撤销暂存:
     - 如果您不小心暂存了不想提交的更改,可以将其撤销
     - 在暂存的更改部分,点击文件名旁边的 "-" 图标
     - 或右键点击文件名,选择 "Unstage Changes"

     4） 输入提交信息:
     - 在源代码管理视图顶部的文本框中输入您的提交信息
     - 提交信息应简洁明了地描述此次更改的内容

     5） 提交更改:
     a. 使用界面按钮:
        - 在输入提交信息后,点击源代码管理视图顶部的 "Commit" 按钮(看起来像一个对勾)

     b. 使用快捷键:
       - 输入提交信息后,按 Ctrl+Enter (Windows/Linux) 或 Cmd+Enter (Mac)

     c. 使用命令面板:
        - 打开命令面板 (Ctrl+Shift+P 或 Cmd+Shift+P)
        - 输入 "Git: Commit"
        - 选择此选项并按 Enter

     6） 提交所有更改(包括未暂存的):
     - 如果您想跳过暂存步骤,直接提交所有更改
     - 点击 "Commit" 按钮旁边的下拉箭头
     - 选择 "Commit All"
        
     7） 查看提交历史:
     - 提交完成后,您可以在源代码管理视图的 "COMMITS" 部分查看最近的提交历史

     8） 推送提交:
     - 提交到本地仓库后,您可能想将更改推送到远程仓库
     - 点击源代码管理视图中的 "Sync Changes" 按钮
     - 或使用状态栏的同步按钮

     9） 提交到特定分支:
     - 确保你在正确的分支上进行提交
     - 如果需要切换分支,使用状态栏或命令面板进行切换
     - 然后按照上述步骤进行提交

     10） 修改最后一次提交:
     - 如果你需要修改最后一次提交,使用命令面板
     - 输入 "Git: Commit Staged (Amend)"
     - 这将允许你修改最后一次提交的信息或内容

     11） 查看提交前的更改:
     - 在提交之前,你可以双击文件名查看详细的更改
     - 这有助于确保你只提交了预期的更改

     12） 处理大型提交:
     - 对于大型更改,考虑将其拆分为多个小的、相关的提交
     - 这有助于代码审查和后续的问题追踪

## 5. 推送到远程
    - 在 "Source Control" 面板中,点击 "Sync Changes" 按钮
    - 或使用状态栏的同步按钮

## 6. 回滚操作
    - 在 "Source Control" 面板中,找到要回滚的提交
    - 右键点击该提交,选择 "Revert Commit"
    - 确认回滚操作

## 7. 拉取更新
    - 在 "Source Control" 面板中,点击 "Pull" 按钮
    - 或使用命令面板选择 "Git: Pull"

## 8. 查看/创建 Pull Request
    - 在 "Source Control" 面板中,点击 "Create Pull Request" 按钮
    - 或使用命令面板选择 "GitHub: Create Pull Request"

## 9. 查看 Git 历史
    - 在 "Source Control" 面板中,点击 "History" 标签
    - 或使用命令面板选择 "Git: View History"

## 10. 解决冲突
    - 当拉取更新时遇到冲突时,Cursor 会提示您解决冲突
    - 在冲突文件中,编辑代码以解决冲突
    - 解决后,使用 "Source Control" 面板提交解决冲突的更改

## 11. 配置 .gitignore
    - 在项目根目录创建一个名为 ".gitignore" 的文件
    - 在该文件中列出要忽略的文件和目录
    - 保存文件

# GitHub 操作指南
1. [本地代码版本管理和同步到 GitHub](#1-本地代码版本管理和同步到-github)
2. [分支管理](#2-分支管理)
3. [高级 Git 操作](#3-高级-git-操作)
4. [GitHub CLI 使用](#4-github-cli-使用)
5. [实践建议](#5-最佳实践)
6. [故障排除](#6-故障排除)
7. [高级技巧](#7-高级技巧)
8. [配置 Git](#8-配置-git)
9. [使用 GitHub 功能](#9-使用-github-功能)
10. [参考资料](#10-参考资料)

## 1 本地代码版本管理和同步到 GitHub
 - 初始化仓库（如果是新项目） git init
 - 克隆现有仓库: git clone <repository-url>
 - 添加文件到暂存区: git add <file-name>
 - 添加所有更改: it add .
 - 提交更改: git commit -m "提交信息"
 - 推送到远程仓库: git push origin <branch-name>
 - 拉取远程更新: git pull origin <branch-name>

## 2. 分支管理
 - 创建新分支: git branch <new-branch-name>
 - 切换分支: git checkout <branch-name>
 - 创建并切换到新分支: git checkout -b <new-branch-name>
 - 合并分支: git merge <branch-name>
 - 删除分支
     - 删除本地分支: git branch -d <branch-name>
     - 删除远程分支: git push origin --delete <branch-name>

## 3. 高级 Git 操作
 - 查看提交历史: git log
 - 查看简洁历史: git log --oneline
 - 撤销更改
     - 撤销工作区更改: git checkout -- <file-name>
     - 撤销暂存区更改: git reset HEAD <file-name>
     - 撤销最后一次提交: git reset --soft HEAD^
 - 创建和应用补丁
     - 创建补丁: git diff > patch-file.patch
     - 应用补丁: git apply patch-file.patch

## 4. GitHub CLI 使用
 - 安装 GitHub CLI：按照[GitHub CLI 官方文档]指示安装。
 - 登录 GitHub CLI：gh auth login
 - 创建新的仓库:gh repo create <repo-name>
 - 克隆仓库: gh repo clone <owner>/<repo-name>
 - 创建 Pull Request: gh pr create
 - 查看 Pull Requests: gh pr list
 - 查看仓库状态: gh repo view

## 5. 实践检验
 - 经常提交小的、有意义的更改。
 - 使用清晰、描述性的提交信息。
 - 在开始新功能开发时创建新分支。
 - 定期从主分支同步更新。
 - 在合并前进行代码审查。
 - 使用 .gitignore 文件排除不需要版本控制的文件。
 - 使用标签（tags）标记重要的版本节点。

## 6. 故障排除
 - 检查 Git 配置：git config --list
 - 查看 Git 状态: git status
 - 查看详细的错误日志: git log --show-signature
 - 如果遇到合并冲突，使用: git mergetool

## 7. 高级技巧
 - 使用 Git Stash
     - 暂存当前工作: git stash
     - 应用最近的 stash: git stash pop
 - 使用 Git Rebase
     在当前分支上 rebase master 分支：git rebase master
 - 使用 Git Cherry-pick
     将特定提交应用到当前分支：git cherry-pick <commit-hash>
 - 使用 Git Bisect 查找问题
     - 开始 bisect 过程：
       git bisect start
       git bisect bad # 当前版本有问题
       git bisect good <known-good-commit> # 指定一个已知的好版本
     - Git 会自动检出中间的提交，您可以测试并标记为好或坏：
       git bisect good 
       git bisect bad
     - 完成后，结束 bisect：git bisect reset

## 8. 配置 Git
 - 设置用户信息
    git config --global user.name "Your Name"
    git config --global user.email "your.email@example.com"
 - 设置默认编辑器
   git config --global core.editor "vim" # 或其他编辑器
 - 设置别名
   git config --global alias.co checkout
   git config --global alias.br branch
   git config --global alias.ci commit
   git config --global alias.st status

## 9. 使用 GitHub 功能
 - 创建 Issue
   在 GitHub 仓库页面，点击 "Issues" 标签，然后点击 "New issue"。
 - 创建 Pull Request
   在 GitHub 仓库页面，点击 "Pull requests" 标签，然后点击 "New pull request"。
 - 设置 GitHub Actions
     - 在仓库中创建 `.github/workflows` 目录。
     - 在该目录中创建 YAML 文件（如 `main.yml`）定义工作流。
 -  使用 GitHub Pages
     - 在仓库设置中启用 GitHub Pages。
     - 选择源分支和目录。

# 在 Cursor 中生成报告

 1. 使用 Git 命令：
    Cursor 通常与 Git 版本控制系统集成。你可以在 Cursor 的集成终端中使用 Git 命令来获取这些信息。
 
 2. 打开 Cursor 的集成终端：
    使用快捷键 Ctrl+ (Windows/Linux) 或 Cmd+ (Mac)，或从菜单栏选择 View > Terminal。

 3. 执行以下 Git 命令：
    a. 查看文件的修改历史：
    git log --name-status --pretty=format:"%h - %an, %ad : %s"

    b. 统计每个文件的修改次数：
    git log --name-only --pretty=format: | sort | uniq -c | sort -nr

    c. 查看文件的创建日期：
    git log --diff-filter=A --pretty=format:"%ad %h %s" --date=short -- [文件名]
   
    d. 查看文件的最后修改日期：
    git log -1 --pretty=format:"%ad" --date=short -- [文件名]
 
 4. 使用脚本自动化：
    你可以编写一个 shell 脚本或 Python 脚本来自动执行这些命令并格式化输出。

 5. 生成报告：
    将脚本的输出重定向到一个文件中，例如：
    ./your_script.sh > report.txt

 6. 在 Cursor 中查看报告：
    使用 Cursor 打开生成的报告文件进行查看和编辑。

 7. 使用 Cursor 的 AI 功能：
    你可���使用 Cursor 的 AI 功能来帮助解析和总结报告内容。

 8. 定期更新：
    设置一个定期任务来运行这个脚本，以保持报告的更新。

 9. 版本比较：
    使用 Git 的 diff 命令来查看具体的文件变化：
    git diff [commit1] [commit2] -- [文件名]

 10. 可视化：
    考虑使用 Git 的可视化工具或第三方工具来生成更直观的报告，如图表或时间线。
    通过这些步骤，你可以在 Cursor 中有效地跟踪和报告本地文件的变更历史。
    这不仅有助于项目管理，还能帮助团队成员了解项目的演变过程。

 11.实践
 
 - 脚本 [repo_stats.py](../repo_stats.py)
 - 在终端中，导航到 game-RotaPuzzle 项目的根目录。
 - 运行脚本：python repo_stats.py
 - 将输出保存到文件中，可以在运行脚本时重定向输出：
   python repo_stats.py > repo_stats_report.txt

 -这将创建一个名为 repo_stats_report.txt 的文件，其中包含所有的统计信息。
  这个脚本提供了一个基本的框架，您可以根据需要进一步定制和扩展它，例如添加更多的统计信息或改变输出格式。



# GitHub Projects 项目管理

    GitHub Projects 是一个强大的项目管理工具，可以帮助您组织和优先处理工作。以下是使用 GitHub Projects 的详细步骤：

    ## 1. 创建新的项目
    1. 在 GitHub 仓库页面，点击 "Projects" 标签。
    2. 点击 "New project" 按钮。
    3. 选择项目模板（如 Board、Table 或 Roadmap）。
    4. 为项目命名并添加描述。
    5. 点击 "Create project" 完成创建。

    ## 2. 添加列（针对看板视图）
    1. 在项目看板中，点击 "+ Add column" 按钮。
    2. 输入列名（如 "To Do"、"In Progress"、"Done"）。
    3. 可以为每列设置自动化规则（如自动将关闭的 issue 移动到 "Done" 列）。

    ## 3. 添加任务卡片
    1. 点击列顶部的 "+ Add cards" 按钮。
    2. 可以直接从仓库的 issues 或 pull requests 中拖拽项目到看板。
    3. 也可以点击 "+" 按钮创建新的任务卡片。

    ##4. 管理任务卡片
    1. 拖拽卡片可以在列之间移动。
    2. 点击卡片可以查看详情、添加评论或编辑信息。
    3. 可以为卡片分配负责人、设置截止日期等。

    ## 5. 使用过滤和排序
    1. 使用顶部的搜索栏可以快速查找特定卡片。
    2. 点击 "Sort" 可以按不同条件（如创建日期、截止日期等）排序卡片。
    3. 使用 "Filter" 可以根据标签、负责人等条件筛选卡片。

    ## 6. 查看项目进度
    1. 在项目页面，可以看到整体进度和统计信息。
    2. 使用 "Insights" 标签可以查看更详细的项目分析。

    ## 7. 与团队协作
    1. 在项目设置中，可以添加团队成员并设置权限。
    2. 团队成员可以共同编辑和更新项目看板。
    3. 使用 @提及 功能可以在卡片中通知特定成员。

    ## 8. 集成与自动化
    1. 在项目设置中，可以设置与其他 GitHub 功能的集成。
    2. 使用 GitHub Actions 可以实现更复杂的自动化流程。

    ## 9. 导出和分享
    1. 可以将项目导出为 CSV 文件进行离线分析。
    2. 使用项目的共享链接可以快速与他人分享项目进度。

    通过使用 GitHub Projects，您可以更有效地管理项目进度，提高团队协作效率，并保持工作的透明度。

# 在 Cursor 中配置 GitHub Actions 工作流

  GitHub Actions 工作流是通过 YAML 文件定义的。
  以下是在 Cursor 中配置 GitHub Actions 工作流的步骤：

 1. 创建工作流文件：
   - 在项目根目录下创建 `.github/workflows` 文件夹（如果还不存在）。
   - 在该文件夹中创建一个新的 YAML 文件，例如 `main.yml`。

 2. 定义工作流：
   - 打开新创建的 YAML 文件。
   - 使用以下基本结构开始你的工作流配置：
    yaml
    name: CI
    on:
    push:
    branches: [ main ]
    pull_request:
    branches: [ main ]
    jobs:
    build:
    runs-on: ubuntu-latest
    steps:
    uses: actions/checkout@v2
    name: Run a one-line script
    run: echo Hello, world!

 3. 自定义工作流：
   - 根据项目需求修改触发条件、作业和步骤。
   - 可以添加多个作业，每个作业可以包含多个步骤。

 4. 使用 Cursor 的 YAML 支持：
   - Cursor 提供 YAML 语法高亮和自动完成功能。
   - 使用这些功能可以更容易地编写和编辑工作流文件。

 5. 验证工作流：
   - 使用 Cursor 的 GitHub 集成功能，可以直接在编辑器中验证工作流语法。
   - 在命令面板中搜索并运行 "GitHub: Validate Workflow File" 命令。

 6. 提交和推送：
   - 保存工作流文件。
   - 使用 Cursor 的 Git 集成功能提交更改并推送到 GitHub。

 7. 监控工作流：
   - 使用之前提到的 GitHub Actions 管理功能在 Cursor 中监控工作流的执行情况。

 8. 迭代和改进：
   - 根据工作流的执行结果，在 Cursor 中进行必要的调整和优化。
   - 可以使用 Cursor 的 AI 功能来获取工作流优化建议。

 通过这些步骤，你可以在 Cursor 中有效地配置和管理 GitHub Actions 工作流，充分利用 Cursor 的集成功能和 AI 辅助来提高工作效率。

# 管理 GitHub Actions 工作流

    GitHub Actions 是一个强大的持续集成和持续部署（CI/CD）工具。在 Cursor 中，你可以方便地管理和监控你的 GitHub Actions 工作流。以下是详细的操作指南：

    ## 查看 GitHub Actions 工作流
     1. 在 Cursor 中打开你的项目。
     2. 点击左侧边栏的 "GitHub" 图标。
     3. 在 GitHub 面板中，找到并展开 "Actions" 部分。
     4. 你将看到项目中所有配置的工作流列表。

    ## 触发 GitHub Actions 工作流
    1. 在工作流列表中，找到你想要触发的工作流。
    2. 右键点击该工作流，选择 "Run workflow"。
    3. 如果工作流需要输入参数，Cursor 会弹出一个输入框让你填写。
    4. 填写完参数后，点击 "Run" 按钮来触发工作流。

    ## 查看工作流运行结果
    1. 在触发工作流后，你可以在 "Actions" 部分看到一个新的运行实例。
    2. 点击该实例可以展开查看详细信息。
    3. 你将看到工作流的每个步骤及其状态（成功、失败或进行中）。
    4. 点击某个步骤可以查看其详细日志。

    ## 配置工作流通知
    1. 在 Cursor 的设置中，找到 "GitHub" 部分。
    2. 启用 "Action notifications" 选项。
    3. 你可以选择接收所有工作流的通知，或者只接收失败的工作流通知。

    ## 编辑工作流文件
    1. 在 Cursor 中，打开项目的 `.github/workflows` 目录。
    2. 你可以直接编辑或创建 YAML 格式的工作流文件。
    3. Cursor 提供了 YAML 语法高亮和自动完成功能，使编辑工作流文件变得更加容易。

    ### 工作流运行历史
    1. 在 "Actions" 部分，你可以查看过去的工作流运行历史。
    2. 点击某个历史记录可以查看详细信息，包括运行时间、触发原因等。

    ### 调试工作流
    1. 如果工作流运行失败，你可以直接在 Cursor 中查看错误日志。
    2. 对于需要调试的工作流，你可以添加调试步骤或使用 GitHub 的 `tmate` 功能进行远程调试。

    通过这些功能，你可以在 Cursor 中方便地管理和监控你的 GitHub Actions，无需频繁切换到浏览器，提高开发效率。

# 在 Cursor 中查看仓库统计信息

 虽然 Cursor 目前没有直接的内置功能来查看详细的仓库统计信息，但我们可以结合 Cursor 的终端功能和 Git 命令来实现这一目的：

 1. 打开 Cursor 的集成终端：
   - 使用快捷键 Ctrl+` (Windows/Linux) 或 Cmd+` (Mac)
   - 或者从菜单栏选择 View > Terminal

 2. 使用 Git 命令查看统计信息：
   a. 查看提交频率：
   git log --pretty=format:"%ad" --date=short | sort | uniq -c

   b. 查看贡献者统计：
   git shortlog -sn --all
   c. 查看文件变更统计：
   git log --stat

 3. 使用 Cursor 的 AI 功能解析结果：
   - 复制命令输出
   - 使用 Ctrl+K (Windows/Linux) 或 Cmd+K (Mac) 激活 AI
   - 粘贴输出并要求 AI 解释或可视化结果

 4. 使用第三方工具：
   你可以使用命令行工具生成报告，然后在 Cursor 中查看。例如：

   a. 安装 gitstats：
   pip install gitstats

   b. 生成报告：
   gitstats . ./report
 
   c. 在 Cursor 中打开生成的 HTML 报告。

 通过这些方法，你可以在 Cursor 环境中获取和分析仓库统计数据。



# 参考资料
[Cursor 官方网站](https://cursor.sh/) Cursor 的基本介绍
[GitHub CLI 官方文档](https://cli.github.com/manual/installation) 
[GitHub Community](https://github.community/)
[GitHub 官方文档](https://docs.github.com/cn) 包含了从基础到高级的所有 GitHub 相关操作指南。
[Git 官方文档](https://git-scm.com/doc) 这里有 Git 的完整参考手册和教程。
[GitHub Learning Lab](https://lab.github.com)这是一个交互式学习平台，提供了许多实践课程。
[Pro Git 书籍（免费在线版）](https://git-scm.com/book/zh/v2)这本书深入浅出地介绍了 Git 的方方面面。
[GitHub CLI 文档](https://cli.github.com/manual)学习使用 GitHub 的命令行工具

# 待补充操作
[X] 代码审查（Code Review）流程
[x] 使用 GitHub Projects 进行项目管理
[X] 配置和管理 GitHub Actions
[X] 仓库见解:查看仓库统计信息,如贡献者、提交频率等
[ ] 使用 GitHub Discussions 功能
[ ] 处理 GitHub Security Alerts
[ ] GitHub Copilot 集成:如果您启用了 GitHub Copilot,它会与 Cursor 的 AI 功能无缝协作
[ ] 查看 GitHub 通知:在 Cursor 中直接接收和管理 GitHub 通知
[ ] 代码空间集成:如果您使用 GitHub Codespaces,可以直接在 Cursor 中打开和管理代码空间
[ ] GitHub 讨论:参与 GitHub 讨论,直接在 Cursor 中回复和创建新主题
[ ] 增加一个故障排除部分，列出常见问题和解决方法。


