/**
 * 字典数据类型
 */
export type DictDataIdType = string | number
export type DictDataPropertyType = string | number | boolean | undefined
export type DictData = {
  id: DictDataIdType
  name: string
  symbol?: string
  [key: string]: DictDataPropertyType
}
// 约束可获取属性,防止Map类型穿透
export type DictBaseTypes = {
  showName: string
  [key: string]: any
  setList(dataList: DictData[], keyId?: string, symbolId?: string): void
  getList(valueId?: string, parentIdKey?: string, filter?: (o: DictData) => DictData): DictData[]
  getValue(id: DictDataIdType, valueId?: string): string
}

/**
 * 字典调用类
 *
 * Example:
 *
 * ```typescript
 * const data = [{ id: 1, name: 'Apple', symbol: 'AAPL' }, { id: 2, name: 'Banana', symbol: 'BAN' }]
 * const dict = new DictBase('Stock Symbols', data)
 * console.log(dict.AAPL) // 1
 * ```
 */
export class DictBase extends Map<DictDataIdType, DictData> {
  public showName: string;
  // 动态属性
  [name: string]: any
  constructor(name: string, dataList: DictData[], keyId = 'id', symbolId = 'symbol') {
    super()
    this.showName = name
    this.setList(dataList, keyId, symbolId)
  }

  /**
   * 设置字典数据
   * @param dataList 字典数据
   * @param keyId 字典ID
   * @param symbolId 字典符号ID
   */
  setList(dataList: DictData[], keyId = 'id', symbolId = 'symbol') {
    this.clear()
    if (Array.isArray(dataList)) {
      dataList.forEach((item) => {
        // 将每个字典数据的 keyId 作为键，整个字典数据作为值存入 Map 中
        this.set(item[keyId] as DictDataIdType, item)
        // 如果字典数据中存在 symbolId（即 item[symbolId] 非空）
        if (item[symbolId] != null) {
          // 在字典调用类实例上动态定义一个属性，属性名为 symbolId，值为 keyId
          Object.defineProperty(this, item[symbolId] as PropertyKey, {
            get: function () {
              return item[keyId]
            }
          })
        }
      })
    }
  }

  /**
   * 获取字典数据列表
   * @param valueId  值ID
   * @param parentIdKey 父级ID字段名
   * @param filter 过滤器
   *
   * Example:
   *
   * ```typescript
   * const dict = new DictBase('Example', [
   * 	{ id: 1, name: 'Apple', symbol: 'AAPL', parentId: 0 },
   * 	{ id: 2, name: 'Google', symbol: 'GOOG', parentId: 0 },
   * 	{ id: 3, name: 'Microsoft', symbol: 'MSFT', parentId: 1 },
   * ]);
   * const result = dict.getList(); // dict result
   * const result = dict.getList('name', 'parentId', (item) => item.parentId === 0); // [{ id: 1, name: 'Apple', parentId: 0 }, { id: 2, name: 'Google', parentId: 0 }]
   * ```
   */
  getList(
    valueId = 'name',
    parentIdKey = 'parentId',
    filter?: (o: DictData) => DictData
  ): DictData[] {
    const temp: DictData[] = []
    this.forEach((value, key: DictDataPropertyType) => {
      let obj: DictData = {
        id: key as DictDataIdType,
        name: typeof value === 'string' ? value : String(value[valueId]),
        parentId: value[parentIdKey]
      }
      // 如果 value 不是字符串类型，保留原有 value 的属性
      if (typeof value !== 'string') {
        obj = {
          ...value,
          ...obj
        }
      }
      // 如果没有传入过滤函数，或者过滤函数返回 true，则将对象加入 temp 数组
      if (typeof filter !== 'function' || filter(obj)) {
        temp.push(obj)
      }
    })

    return temp
  }

  /**
   * 获取字典值
   * @param id 值ID
   * @param valueId 获取的值字段名
   *
   *
   * Example:
   *
   * ```typescript
   * const dict = new DictBase('Example',[{ id: 1, name: 'Apple', symbol: 'AAPL' }, { id: 2, name: 'Banana', symbol: 'BAN' }])
   * console.log(dict.getValue(1)) // Apple
   * console.log(dict.getValue(2)) // Banana
   * console.log(dict.getValue('AAPL')) // Apple
   * console.log(dict.getValue('BAN')) // Banana
   * ```
   */
  getValue(id: DictDataIdType, valueId = 'name'): string {
    // 如果id为boolean类型，则自动转换为0和1
    if (typeof id === 'boolean') {
      id = id ? 1 : 0
    }
    const obj = this.get(id)
    return obj == null ? '' : (obj[valueId] as string)
  }
}
