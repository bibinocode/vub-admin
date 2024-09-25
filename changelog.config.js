module.exports = {
  // 使用 Angular 预设
  preset: 'angular',
  // 自定义解析器选项
  parserOpts: {
    headerPattern: /^(\w*)(?:\(([\w$.\-*/ ]*)\))?: (.*)$/, // 支持 type(scope): subject 格式
    headerCorrespondence: ['type', 'scope', 'subject'], // 映射到 type, scope 和 subject 字段
    noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES'] // 破坏性变更关键字
  },
  // 自定义生成器选项
  writerOpts: {
    transform: (commit) => {
      let type = commit.type
      switch (type) {
        case 'feat':
          commit.type = 'Features'
          break
        case 'fix':
          commit.type = 'Bug Fixes'
          break
        case 'perf':
          commit.type = 'Performance Improvements'
          break
        case 'revert':
          commit.type = 'Reverts'
          break
        case 'docs':
          commit.type = 'Documentation'
          break
        case 'ci':
          commit.type = 'Continuous Integration'
          break
        case 'chore':
          commit.type = 'Chore'
          break
        case 'style':
          commit.type = 'Style Changes'
          break
        case 'test':
          commit.type = 'Tests'
          break
        case 'build':
          commit.type = 'Build System'
          break
        default:
          return
      }
      return commit
    },
    groupBy: 'type', // 按类型组织提交
    commitGroupsSort: ['Features', 'Bug Fixes', 'Performance Improvements'], // 自定义提交组顺序
    commitsSort: ['scope', 'subject'] // 按范围和描述排序
  }
}
