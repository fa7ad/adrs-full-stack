declare module 'kalman-filter' {
  /**
   * the function corresponding to the desired model
   */
  export type fn = () => any;
  declare function registerObservation(name: any, fn: any): void;
  declare function registerDynamic(name: any, fn: any): void;
  declare function buildObservation(observation: any): any;
  declare function buildDynamic(dynamic: any, observation: any): any;
  export {};
}
