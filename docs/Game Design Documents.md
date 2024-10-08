# 巧转拼图（RotaPuzzle）游戏开发说明

## 1. 游戏类型
HTML5回合制空间推理拼图游戏

## 2. 游戏名称
- 中文名：巧转拼图
- 英文名：Rota Puzzle

## 3. 游戏目标
完成4个随机生成的关卡，尽可能少用旋转次数以获得高分。

## 4. 游戏画面尺寸
- 自适应设计：支持1024x768和1920x1080比例屏幕，以及移动设备

## 5. 核心功能
- 碎片拖拽系统
- 碎片旋转系统（顺时针和逆时针）
- 碎片与目标形状匹配检测
- 基于目标旋转次数的计分系统
- 4个随机生成的关卡
- 分数榜单系统
- 提示系统
- 游戏设置系统（关卡数和难度）

## 6. 用户界面

### 游戏区域
- 背景：由不同几何形状组成的深紫色图案
- 目标形状：无轮廓线的黑色纯色块，居中显示
- 可移动碎片：对应目标形状的拆分碎片，随机分布

### 顶部信息栏
- 显示当前关卡进度（如"PUZZLE 1 of 4"）
- 显示累积得分
- 背景：木质纹理

### 底部控制栏
- 显示当前关卡目标旋转次数和实际使用次数（如"3/4"）
- 旋转控制按钮2个，旋转按钮需要显示旋转方向图案和角度（根据关卡难度对应显示旋转限制的角度）
  - 逆时针按钮
  - 顺时针按钮
- 提示按钮（按钮显示文字为"提示"）
- 背景：木质纹理

### 其他元素
- 暂停按钮：左上角

### 暂停界面
居中显示4个竖向排列按钮：
- 恢复
- 重新开始
- 静音（点击后显示已静音）
- 如何玩（点击进入简单的游戏帮助界面，显示游戏的玩法文字说明。）

### 游戏设置页面
- 关卡数设置：输入框，可输入4-20之间的数字
- 难度设置：下拉菜单或单选按钮组，包括初级、中级、高级
- 语言选择：下拉菜单，提供以下语言选项：
  - 英文（默认）
  - 简体中文
  - 繁体中文
  - 日文
  - 韩文
  - 法语
  - 西班牙语
- 保存按钮：保存设置并返回主菜单

## 7. 游戏逻辑
- 初始化时生成4个随机难度的关卡，每个关卡设定目标旋转次数和最高分数
- 每个关卡随机生成碎片位置和旋转角度
- 实现碎片的拖拽和旋转功能
- 记录并显示每个关卡的实际旋转次数
- 根据实际旋转次数与目标次数的比较计算得分
- 完成一个关卡后自动进入下一关，直到完成所有4个关卡
- 游戏结束后，将总分添加到分数榜单中

## 8. 碎片交互逻辑
- 默认状态：浅蓝色
- 鼠标点击或拖动状态：土黄色
- 鼠标释放
  - 未完成拼图：恢复浅蓝色
  - 完成拼图：变为玫红色
- 所有碎片正确组合时，同时变为玫红色

## 9. 计分系统

### 基础计分规则
每个关卡的基础分计算公式：
基础分 = 碎片数量 × 目标旋转次数 × 难度系数

难度系数根据玩家选择的难度级别和当前关卡数动态计算：
- 初级：难度系数 = 15 + (关卡数 - 1) * 3
- 中级：难度系数 = 20 + (关卡数 - 1) * 4
- 高级：难度系数 = 25 + (关卡数 - 1) * 5

### 实际得分计算
- 如果实际旋转次数小于等于目标次数，玩家获得最高分数（即基础分）
- 如果超出目标次数，按比例减少得分：
  实际得分 = 基础分 × (目标旋转次数 ÷ 实际旋转次数)

### 提示系统对分数的影响
- 每使用一次提示，当前关卡总分扣除100分
- 扣分后的得分不会低于0分

### 关卡完成奖励
每个关卡完成后，玩家可以获得额外的旋转次数奖励：
- 旋转次数等于关卡设定次数获得1000分
- 每增加1次旋转，奖励分数减少100分，直至0分

### 总分计算
游戏的总分是所有已完成关卡的实际得分之和，包括：
- 每个关卡的基础得分（考虑实际旋转次数）
- 减去每个关卡中使用提示的扣分
- 加上每个关卡的旋转次数奖励

## 10. 随机关卡生成系统
- 设计算法以随机生成不同难度的拼图形状
- 为每个关卡设定合理的目标旋转次数和最高分数
- 确保生成的拼图是可解的，且难度递增

## 11. 分数榜单系统
- 设计和实现本地存储的分数榜单
- 在游戏结束后显示榜单，并将新分数插入适当位置

## 12. 图形和动画
- 使用HTML5 Canvas或SVG绘制游戏元素
- 实现平滑的拖拽和旋转动画
- 添加关卡切换动画
- 碎片状态变化时的颜色过渡动画
- 完成拼图时的颜色变化动画

## 13. 音效和音乐
- 添加背景音乐，可在关卡间变化
- 碎片旋转、放置正确、关卡完成等操作的音效

## 14. 性能优化
- 优化碎片的碰撞检测算法
- 使用requestAnimationFrame进行动画渲染
- 实现移动设备的触摸支持

## 15. 额外功能

### 游戏说明
- 添加简短的游戏说明或教程，解释计分系统和提示功能

### 提示系统
- 在底部控制栏添加提示按钮和提示使用次数计数器
- 提示功能使用规则：
  - 每次使用提示功能，当前回合总分扣除100分
  - 点击提示按钮后，目标黑色区域中会显示一个碎片的正确位置，用白色标记
  - 每次点击提示按钮都会显示一个不同碎片的正确位置
  - 白色标记会持续显示，不会消失
  - 可以继续点击提示按钮，直到所有碎片的正确位置都被显示
  - 当玩家完成拼图后，所有碎片（包括之前显示为白色的部分）都会变为玫红色
- 提示系统的视觉效果：
  - 默认状态：目标形状为纯黑色
  - 使用提示后：部分区域变为白色，指示特定碎片的正确位置
  - 完成拼图后：整个形状变为玫红色
- 提示系统的计分影响：
  - 在当前回合得分的基础上，每使用一次提示就扣除100分
  - 确保即使多次使用提示，得分不会变成负数（最低为0分）
- 提示界面：
  - 在使用提示后，更新显示的当前得分
  - 显示已使用的提示次数
  - 当分数降至0分时，不能再使用提示
  - 提示按钮在分数为0时变为灰色不可点击状态

## 16. 测试
- 进行跨浏览��和跨设备的兼容性测试
- 性能测试，确保在各种设备上流畅运行
- 用户体验测试，优化游戏难度曲线和关卡设计

## 17. 数据存储
- 使用本地存储（如localStorage）保存游戏进度和分数榜单、保存游戏设置（如音量控制）的内容。

## 18. 响应式设计
- 虽然基础尺寸是640x480，但确保游戏界面可以在不同尺寸的屏幕上良好显示
- 在保持16:9比例的同时，根据设备屏幕进行缩放

## 19. 可访问性考虑
- 使用足够大的字体size
- 确保颜色对比度符合可访问性标准
- 考虑为色盲用户提供替代色彩方案或图案

## 20. 游戏难度递增系统

### 碎片数量增加
- 第1关：4-6块碎片
- 第2关：6-8块碎片
- 第3关：8-10块碎片
- 第4关：10-12块碎片

### 目标形状复杂度
- 第1关：简单几何形状（如圆形、三角形、正方形）
- 第2关：稍复杂的几何形状（如五角星、六边形）
- 第3关：不规则多边形或简单图案（如花朵、树叶）
- 第4关：复杂图案或抽象形状

### 碎片形状（根据难度设置调整）
- 初级：规则几何图形（正方形、长方形、正三角形、45度直角三角形、30度和60度直角三角形）
- 中级：不规则几何图形，不含曲线
- 高级：不规则图形，包含曲线

### 每次旋转限制的角度
- 第1关：仅180度的倍数
- 第2关：仅90度的倍数
- 第3关：仅45度的倍数
- 第4关：仅30度的倍数

### 目标旋转次数(根据碎片数量动态调整)
- 基础次数：碎片数量÷2
- 第1关：基础次数 + 0-2次
- 第2关：基础次数 + 2-4次
- 第3关：基础次数 + 4-6次
- 第4关：基础次数 + 6-8次

## 21. 扩展计划评估（在后续关卡中逐步引入特殊挑战）
- 镜像碎片：某些碎片可以翻转，增加难度
- 干扰碎片：增加形状相近的碎片进行干扰，需要仔细辨别
- 动态目标：目标形状缓慢旋转或变化，增加挑战性
- 拼图区域限制：限制可移动碎片的区域，增加操作难度


