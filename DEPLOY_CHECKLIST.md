# 📋 Netlify 部署检查清单

在部署到 Netlify 之前，请确保完成以下检查项目：

## ✅ 必需文件检查

- [ ] `index.html` - 主应用文件存在且完整
- [ ] `manifest.json` - PWA 配置文件
- [ ] `netlify.toml` - Netlify 部署配置
- [ ] `_redirects` - 路由重定向配置
- [ ] `js/git-storage.js` - Git 存储系统
- [ ] `data/git_config.json` - Git 配置文件
- [ ] `data/inventory_data.json` - 初始数据文件

## ✅ 功能测试

### 基本功能
- [ ] 页面能正常加载
- [ ] 所有标签页可以正常切换
- [ ] 库存数据可以添加/编辑/删除
- [ ] 图表正常显示
- [ ] Excel 导入/导出功能正常

### Git 存储功能
- [ ] Git 存储系统初始化成功
- [ ] 可以创建手动提交
- [ ] 提交历史正常显示
- [ ] 版本恢复功能正常
- [ ] 版本对比功能正常
- [ ] 仓库导出功能正常

### PWA 功能
- [ ] manifest.json 配置正确
- [ ] 应用可以安装到桌面
- [ ] 离线功能正常

## ✅ 配置验证

### netlify.toml 配置
- [ ] 发布目录设置为 "."
- [ ] 安全头部配置完整
- [ ] 缓存策略配置正确
- [ ] 重定向规则设置正确

### _redirects 文件
- [ ] SPA 路由支持配置
- [ ] 旧路径重定向配置

## ✅ 性能优化

- [ ] 图片资源已优化
- [ ] CSS/JS 文件已压缩
- [ ] 不必要的文件已移除
- [ ] 外部依赖使用 CDN

## ✅ 安全检查

- [ ] 没有敏感信息硬编码
- [ ] CSP 策略配置正确
- [ ] 安全头部设置完整

## ✅ 兼容性测试

### 浏览器兼容性
- [ ] Chrome 浏览器测试通过
- [ ] Firefox 浏览器测试通过
- [ ] Safari 浏览器测试通过
- [ ] Edge 浏览器测试通过

### 设备兼容性
- [ ] 桌面设备显示正常
- [ ] 平板设备显示正常
- [ ] 移动设备显示正常

## 🚀 部署准备

### 文件准备
- [ ] 所有文件都在 `estoque` 目录中
- [ ] 文件路径使用相对路径
- [ ] 没有绝对路径引用

### 部署方式选择
- [ ] 方式一：拖拽部署（推荐新手）
- [ ] 方式二：Git 仓库部署（推荐团队）

## 📝 部署后验证

部署完成后，请验证以下项目：

### 基本验证
- [ ] 网站可以正常访问
- [ ] 所有页面加载正常
- [ ] 没有 404 错误
- [ ] HTTPS 证书已启用

### 功能验证
- [ ] 所有功能正常工作
- [ ] 数据可以正常保存和加载
- [ ] Git 版本控制功能正常
- [ ] PWA 安装功能正常

### 性能验证
- [ ] 页面加载速度快
- [ ] 图表渲染流畅
- [ ] 移动设备体验良好

## 🔧 常见问题解决

### 如果部署失败
1. 检查 netlify.toml 文件格式
2. 确认所有必需文件存在
3. 查看 Netlify 部署日志

### 如果功能异常
1. 检查浏览器控制台错误
2. 确认 JavaScript 文件正确加载
3. 验证 localStorage 权限

### 如果 PWA 无法安装
1. 确认使用 HTTPS
2. 检查 manifest.json 格式
3. 验证 Service Worker 注册

---

**完成所有检查项目后，您就可以安全地部署到 Netlify 了！**

**部署命令参考：**
```bash
# 如果使用 Git 部署
cd estoque
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

**部署后测试 URL：**
- 生产环境：`https://your-site-name.netlify.app`
- 预览环境：`https://deploy-preview-xxx--your-site-name.netlify.app`