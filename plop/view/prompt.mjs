import { toUpperCase } from '../utils.mjs'
export default {
  description: '创建vue页面',
  prompts: [
    {
      type: 'input',
      name: 'path',
      message: '请输入路径（Please enter a path）',
      default: 'views'
    },
    {
      type: 'input',
      name: 'name',
      message: '请输入模块名称（Please enter module name）'
    }
  ],
  actions: (data) => {
    const { name, path } = data
    const viewName = toUpperCase(name)
    const actions = []
    if (name) {
      actions.push({
        type: 'add',
        path: `./src/pages/${path}/${name}.vue`,
        templateFile: './plop/view/view.hbs',
        data: {
          name,
          viewName
        }
      })
    }

    return actions
  }
}
