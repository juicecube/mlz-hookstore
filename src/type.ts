export interface CreateStoreConfig {
  namespace:string;
  state:StateType;
  action:FunctionsType | StateType;
  [key:string]:any;
}

export interface FunctionsType {
  [key:string]:() => void | Promise<any>;
}

export interface StateType {
  [key:string]:any;
}

export interface StoresType {
  [key:string]:CreateStoreConfig;
}

export interface QueueType {
  [namespace:string]:any[];
}