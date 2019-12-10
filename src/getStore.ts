import stores from './stores'

function getStore(namespace?: string) {
  if (namespace) {
    if (!stores[namespace]) {
      throw new Error(`Not found the store: ${namespace}.`)
    }
    return stores[namespace]
  } else {
    return stores
  }
}

export default getStore
