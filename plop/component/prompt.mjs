import { toUpperCase } from '../utils.mjs'

export default {
  description: '生成组件',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: '请输入组件名称（Please enter the component name）'
    },
    {
      type: 'confirm',
      name: 'isTsx',
      message: '是否使用TSX？（Do you want to use TSX?）',
      default: true
    }
  ],
  actions: (data) => {
    const { name, isTsx } = data
    const componentName = toUpperCase(name)
    const actions = []
    if (name) {
      actions.push(
        {
          type: 'add',
          path: `./src/components/${componentName}/src/${componentName}.vue`,
          templateFile: isTsx
            ? './plop/component/componenttsx.hbs'
            : './plop/component/component.hbs',
          data: {
            name,
            componentName
          }
        },
        {
          type: 'add',
          path: `./src/components/${componentName}/index.ts`,
          templateFile: './plop/component/index.hbs',
          data: {
            componentName
          }
        }
      )
    }
    return actions
  }
}
