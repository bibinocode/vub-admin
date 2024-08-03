import ViewGenerator from './plop/view/prompt.mjs'
import componentGenerator from './plop/component/prompt.mjs'
export default function (plop) {
  plop.setGenerator('view', ViewGenerator)
  plop.setGenerator('component', componentGenerator)
}
