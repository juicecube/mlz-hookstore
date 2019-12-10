import { isPromise, addProxy } from './util'
import { dispatch } from './pubsub'
import stores from './stores'
import { CreateStoreConfig } from './type'

let shouldLoggerOn = false

function createStore(config: CreateStoreConfig) {
  const { namespace, state, action } = config
  let isChanged: boolean = false

  // safe code
  if (!namespace) {
    throw new Error('namespace is required.')
  }
  if (stores[namespace]) {
    throw new Error(`createStore: duplicated namespace`)
  }

  const handler = {
    set(target: any, key: string, newValue: any) {
      // 不允许通过模块的方法外的形式改变state
      // setter被触发时, 检测方法有被触发, 没有则抛出异常
      if (!checkReducersStatus('unlock')) {
        console.error(`
          Do not modify data within components Or modify data within other namespace,
          Call a method of namespace to update the data.

          namespace: ${namespace},
          key: ${key},
          value: ${newValue}
        `)
      }

      // if state's key changed
      if (target[key] !== newValue) {
        isChanged = true
        if (shouldLoggerOn) {
          console.log(`${namespace}.state.${key} =>`, stores[namespace].state[key])
        }
        target[key] = addProxy(newValue, handler)
        if (shouldLoggerOn) {
          console.log(`${namespace}.state.${key} =>`, stores[namespace].state[key])
          console.log('========================================================')
        }
      }
      return true
    }
  }

  // state changed => trigger dispatch
  config.state = addProxy(state, handler)

  const cacheOriginAction: any = {}
  Object.keys(action).forEach(key => {
    // 保存originFunction
    cacheOriginAction[key] = action[key]

    // 调用方法, 走的是这边封装的一层拦截逻辑
    async function wapperFunction(...args: any[]) {
      // 先在方法的key挂载一个标识, 代表是通过namespace的方法改变的状态, 而不是用过组件内部改变reference的值
      action[key].unlock = true

      // 将所有方法(通常会改变state)设置成异步代码
      // 这样子组件的effect即使比父组件的effect先执行(react hook rule)
      // 方法还是会等父组件的effect先执行完再执行
      // 这样不会出现数据改变时, queue为空的情况
      await Promise.resolve()
      // 通过apply执行一遍原有action的函数
      // 如果方法里有改变state值的逻辑, handler的setter会在这里同步触发, setter跑完, 后面的代码才会开始同步执行
      const promise = cacheOriginAction[key].apply(config, args)

      // 如果action里的key不是异步函数
      if (!isPromise(promise)) {
        action[key].unlock = false
        checkUpdateAndDispatchSetState()
        return promise
      }

      // 如果action里的key是异步函数
      // checkUpdateAndDispatchSetState when loading changed
      isChanged = true
      action[key].loading = true
      checkUpdateAndDispatchSetState()

      return new Promise((resolve, reject) => {
        promise
          .then(resolve)
          .catch(reject)
          .finally(() => {
            isChanged = true
            action[key].loading = false
            action[key].unlock = false
            checkUpdateAndDispatchSetState()
          })
      })
    }

    action[key] = wapperFunction
    action[key].loading = false
    action[key].unlock = false
  })

  // 将state和methods赋值给stores-tree的namespace
  stores[namespace] = config

  // 检测action是否有被触发
  function checkReducersStatus(name: 'unlock' | 'loading') {
    const keys = Object.keys(action)
    for (let i = 0; i < keys.length; i++) {
      if (action[keys[i]][name]) {
        return true
      }
    }
    return false
  }

  function checkUpdateAndDispatchSetState() {
    if (isChanged) {
      isChanged = false
      // 将订阅queue里对应namespace所有setState全部执行一遍, 触发组件render
      dispatch(namespace, Math.random())
    }
  }
}

// 提供一个创建多个store的API
createStore.init = (configs: CreateStoreConfig[]) => {
  configs.forEach((config: CreateStoreConfig) => {
    createStore(config)
  })
}

createStore.isLogger = () => {
  shouldLoggerOn = true
}

export default createStore
