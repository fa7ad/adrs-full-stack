declare module 'kalman-filter' {
  /**
   * @class
   * @property {DynamicConfig} dynamic the system's dynamic model
   * @property {ObservationConfig} observation the system's observation model
   *@property logger a Winston-like logger
   */
  declare class CoreKalmanFilter {
    /**
     * @param {DynamicConfig} dynamic
     * @param {ObservationConfig} observation the system's observation model
     */
    constructor({ dynamic, observation, logger }: DynamicConfig);
    dynamic: any;
    observation: any;
    logger: any;
    getValue(fn: any, options: any): any;
    getInitState(): State;
    /**
    This will return the predicted covariance of a given previousCorrected State, this will help us to build the asymptoticState.
    * @param {State} previousCorrected
    * @returns{Array.<Array.<Number>>}
    */
    getPredictedCovariance(options?: {}): Array<Array<number>>;
    /**
    This will return the new prediction, relatively to the dynamic model chosen
    * @param {State} previousCorrected State relative to our dynamic model
    * @returns{State} predicted State
    */
    predict(options?: {}): State;
    /**
    This will return the new correction, taking into account the prediction made
    and the observation of the sensor
    * @param {State} predicted the previous State
    * @returns{Array<Array>} kalmanGain
    */
    getGain(options: any): Array<any[]>;
    /**
    This will return the corrected covariance of a given predicted State, this will help us to build the asymptoticState.
    * @param {State} predicted the previous State
    * @returns{Array.<Array.<Number>>}
    */
    getCorrectedCovariance(options: any): Array<Array<number>>;
    /**
    This will return the new correction, taking into account the prediction made
    and the observation of the sensor
    * @param {State} predicted the previous State
    * @param {Array} observation the observation of the sensor
    * @returns{State} corrected State of the Kalman Filter
    */
    correct(options: any): State;
  }
  declare namespace CoreKalmanFilter {
    export { ObservationCallback, ObservationConfig, DynamicCallback, DynamicConfig };
  }
  type DynamicConfig = {
    dimension: number;
    /**
     * > | DynamicCallback} transition,
     */
    '': any;
  };
  type ObservationCallback = (opts: any, index: number, previousCorrected: number) => any;
  type ObservationConfig = {
    dimension: number;
    /**
     * > | ObservationCallback} stateProjection,
     */
    '': any;
  };
  type DynamicCallback = (opts: any, index: number, predicted: State, observation: any) => any;
}
