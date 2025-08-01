/**
 * Git-based Data Storage System
 * 基于Git概念的数据存储和版本控制系统
 */

class GitStorage {
  constructor() {
    this.STORAGE_KEY = 'inventory_git_data';
    this.CONFIG_KEY = 'inventory_git_config';
    this.COMMITS_KEY = 'inventory_git_commits';
    this.currentBranch = 'main';
    this.maxCommits = 100;
    this.autoCommitInterval = 5 * 60 * 1000; // 5分钟
    this.lastCommitTime = null;
    this.autoCommitTimer = null;
    
    this.initializeRepository();
  }

  // 初始化仓库
  initializeRepository() {
    const config = this.getConfig();
    if (!config) {
      const defaultConfig = {
        repository: {
          name: 'inventory-management-data',
          description: '库存管理系统数据仓库',
          created: new Date().toISOString(),
          branch: 'main',
          version: '1.0.0'
        },
        user: {
          name: 'Inventory Manager',
          email: 'manager@inventory.local'
        },
        sync: {
          autoCommit: true,
          commitInterval: this.autoCommitInterval,
          maxCommits: this.maxCommits
        }
      };
      this.saveConfig(defaultConfig);
      this.commit('Initial commit', 'system');
    }
    
    if (this.getConfig().sync.autoCommit) {
      this.startAutoCommit();
    }
  }

  // 获取配置
  getConfig() {
    try {
      const config = localStorage.getItem(this.CONFIG_KEY);
      return config ? JSON.parse(config) : null;
    } catch (error) {
      console.error('获取Git配置失败:', error);
      return null;
    }
  }

  // 保存配置
  saveConfig(config) {
    try {
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
      return true;
    } catch (error) {
      console.error('保存Git配置失败:', error);
      return false;
    }
  }

  // 获取当前数据
  getData() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : { inventory: [], images: {} };
    } catch (error) {
      console.error('获取数据失败:', error);
      return { inventory: [], images: {} };
    }
  }

  // 保存数据
  saveData(data, autoCommit = true) {
    try {
      const dataWithMetadata = {
        ...data,
        lastModified: new Date().toISOString(),
        branch: this.currentBranch
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataWithMetadata));
      
      if (autoCommit && this.getConfig().sync.autoCommit) {
        this.commit('Auto save: ' + new Date().toLocaleString(), 'auto');
      }
      
      return true;
    } catch (error) {
      console.error('保存数据失败:', error);
      return false;
    }
  }

  // 创建提交
  commit(message, author = 'user', data = null) {
    try {
      const currentData = data || this.getData();
      const commitId = this.generateCommitId();
      const timestamp = new Date().toISOString();
      
      const commit = {
        id: commitId,
        message: message,
        author: author,
        timestamp: timestamp,
        branch: this.currentBranch,
        data: this.compressData(currentData),
        parent: this.getLastCommitId()
      };
      
      const commits = this.getCommits();
      commits.unshift(commit);
      
      // 限制提交数量
      if (commits.length > this.maxCommits) {
        commits.splice(this.maxCommits);
      }
      
      this.saveCommits(commits);
      this.lastCommitTime = timestamp;
      
      console.log(`Git提交成功: ${commitId.substring(0, 8)} - ${message}`);
      return commitId;
    } catch (error) {
      console.error('创建提交失败:', error);
      return null;
    }
  }

  // 获取提交历史
  getCommits() {
    try {
      const commits = localStorage.getItem(this.COMMITS_KEY);
      return commits ? JSON.parse(commits) : [];
    } catch (error) {
      console.error('获取提交历史失败:', error);
      return [];
    }
  }

  // 保存提交历史
  saveCommits(commits) {
    try {
      localStorage.setItem(this.COMMITS_KEY, JSON.stringify(commits));
      return true;
    } catch (error) {
      console.error('保存提交历史失败:', error);
      return false;
    }
  }

  // 获取最后一次提交ID
  getLastCommitId() {
    const commits = this.getCommits();
    return commits.length > 0 ? commits[0].id : null;
  }

  // 生成提交ID
  generateCommitId() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    return `${timestamp}_${random}`;
  }

  // 压缩数据
  compressData(data) {
    try {
      // 简单的数据压缩：移除不必要的字段
      const compressed = {
        inventory: data.inventory || [],
        images: Object.keys(data.images || {}).length > 0 ? data.images : {},
        summary: {
          inventoryCount: (data.inventory || []).length,
          imageCount: Object.keys(data.images || {}).length
        }
      };
      return compressed;
    } catch (error) {
      console.error('数据压缩失败:', error);
      return data;
    }
  }

  // 解压数据
  decompressData(compressedData) {
    return compressedData;
  }

  // 恢复到指定提交
  checkout(commitId) {
    try {
      const commits = this.getCommits();
      const commit = commits.find(c => c.id === commitId);
      
      if (!commit) {
        throw new Error('提交不存在');
      }
      
      const data = this.decompressData(commit.data);
      this.saveData(data, false);
      
      console.log(`已恢复到提交: ${commitId.substring(0, 8)}`);
      return true;
    } catch (error) {
      console.error('恢复提交失败:', error);
      return false;
    }
  }

  // 获取提交差异
  getDiff(commitId1, commitId2) {
    try {
      const commits = this.getCommits();
      const commit1 = commits.find(c => c.id === commitId1);
      const commit2 = commits.find(c => c.id === commitId2);
      
      if (!commit1 || !commit2) {
        throw new Error('提交不存在');
      }
      
      const data1 = commit1.data;
      const data2 = commit2.data;
      
      return {
        inventoryDiff: this.compareArrays(data1.inventory, data2.inventory),
        imagesDiff: this.compareObjects(data1.images, data2.images)
      };
    } catch (error) {
      console.error('获取差异失败:', error);
      return null;
    }
  }

  // 比较数组
  compareArrays(arr1, arr2) {
    const added = arr2.filter(item => !arr1.some(i => i.id === item.id));
    const removed = arr1.filter(item => !arr2.some(i => i.id === item.id));
    const modified = arr2.filter(item => {
      const original = arr1.find(i => i.id === item.id);
      return original && JSON.stringify(original) !== JSON.stringify(item);
    });
    
    return { added, removed, modified };
  }

  // 比较对象
  compareObjects(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    const added = keys2.filter(key => !keys1.includes(key));
    const removed = keys1.filter(key => !keys2.includes(key));
    const modified = keys2.filter(key => {
      return keys1.includes(key) && obj1[key] !== obj2[key];
    });
    
    return { added, removed, modified };
  }

  // 开始自动提交
  startAutoCommit() {
    if (this.autoCommitTimer) {
      clearInterval(this.autoCommitTimer);
    }
    
    this.autoCommitTimer = setInterval(() => {
      const data = this.getData();
      if (data.inventory.length > 0) {
        this.commit('Auto commit: ' + new Date().toLocaleString(), 'auto');
      }
    }, this.autoCommitInterval);
  }

  // 停止自动提交
  stopAutoCommit() {
    if (this.autoCommitTimer) {
      clearInterval(this.autoCommitTimer);
      this.autoCommitTimer = null;
    }
  }

  // 导出仓库
  exportRepository() {
    try {
      const data = this.getData();
      const commits = this.getCommits();
      const config = this.getConfig();
      
      const repository = {
        config: config,
        data: data,
        commits: commits,
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      };
      
      return JSON.stringify(repository, null, 2);
    } catch (error) {
      console.error('导出仓库失败:', error);
      return null;
    }
  }

  // 导入仓库
  importRepository(repositoryJson) {
    try {
      const repository = JSON.parse(repositoryJson);
      
      if (repository.config) {
        this.saveConfig(repository.config);
      }
      
      if (repository.data) {
        this.saveData(repository.data, false);
      }
      
      if (repository.commits) {
        this.saveCommits(repository.commits);
      }
      
      console.log('仓库导入成功');
      return true;
    } catch (error) {
      console.error('导入仓库失败:', error);
      return false;
    }
  }

  // 获取仓库状态
  getStatus() {
    const data = this.getData();
    const commits = this.getCommits();
    const config = this.getConfig();
    
    return {
      branch: this.currentBranch,
      lastCommit: commits.length > 0 ? commits[0] : null,
      totalCommits: commits.length,
      dataSize: JSON.stringify(data).length,
      autoCommit: config.sync.autoCommit,
      lastModified: data.lastModified
    };
  }

  // 清理旧提交
  cleanup() {
    try {
      const commits = this.getCommits();
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30); // 保留30天内的提交
      
      const filteredCommits = commits.filter(commit => {
        return new Date(commit.timestamp) > cutoff;
      });
      
      this.saveCommits(filteredCommits);
      console.log(`清理完成，删除了 ${commits.length - filteredCommits.length} 个旧提交`);
      return true;
    } catch (error) {
      console.error('清理失败:', error);
      return false;
    }
  }
}

// 导出GitStorage类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GitStorage;
} else {
  window.GitStorage = GitStorage;
}