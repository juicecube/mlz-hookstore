import stores from './stores';

function getStore(namespace:string) {
  if (!stores[namespace]) {
    throw new Error(`Not found the store: ${namespace}.`);
  }
  return stores[namespace];
}

export default getStore;