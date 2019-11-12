import React from 'react';
import { addProxy } from './util';
import stores from './stores';
import { subScribe, unSubScribe } from './pubsub';

function useSubScribe(namespace:string) : any {
  if (!stores[namespace]) {
    throw new Error(`Not found the store: ${namespace}.`);
  }

  const [, setState] = React.useState();
  React.useEffect(() => {
    subScribe(namespace, setState);
    return () => unSubScribe(namespace, setState);
  }, []);

  return stores[namespace];
}

function useStores() {
  return addProxy({}, {
    get(target:any, namespace:string) {
      if (!stores[namespace]) {
        throw new Error(`Not found the store: ${namespace}.`);
      }
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useSubScribe(namespace);
    },
  });
}

export default function connect<PropsType>(RF:React.FC<PropsType>, mapStateToProps:(store:any) => {}) {
  return (props:any) => {
    const portionStore = mapStateToProps(useStores());
    const portionStoreValuesAndPropsList:any[] = Object.values(portionStore).concat(Object.values(props));
    return React.useMemo(() => <RF {...portionStore} {...props} />, portionStoreValuesAndPropsList);
  };
}