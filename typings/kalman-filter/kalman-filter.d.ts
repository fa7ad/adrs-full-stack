import { DynamicConfig, State } from 'kalman-filter';

declare module 'kalman-filter' {
  declare class KalmanFilter extends CoreKalmanFilter {
    /**
     * @param {DynamicConfig} options.dynamic
     * @param {ObservationConfig} options.observation the system's observation model
     */
    constructor(options?: DynamicConfig);
    /**
     *Performs the prediction and the correction steps
     */
    filter(options: { previousCorrected?: State; observation: Array<number> }): State;
    /**
     *Filters all the observations
     *@param {Array.<Array.<Number>>} observations
     *@returns {Array.<Array.<Number>>} the mean of the corrections
     */
    filterAll(observations: Array<Array<number>>): Array<Array<number>>;
    /**
     * Returns an estimation of the asymptotic state covariance as explained in https://en.wikipedia.org/wiki/Kalman_filter#Asymptotic_form
     * in practice this can be used as a init.covariance value but is very costful calculation (that's why this is not made by default)
     * @param {Number} [tolerance=1e-6] returns when the last values differences are less than tolerance
     * @return {<Array.<Array.<Number>>>} covariance
     */
    asymptoticStateCovariance(
      limitIterations?: number,
      tolerance?: number
    ): <Array_1>() => <Array_2>() => <Number_1>() => any;
    /**
     * Returns an estimation of the asymptotic gain, as explained in https://en.wikipedia.org/wiki/Kalman_filter#Asymptotic_form
     * @param {Number} [tolerance=1e-6] returns when the last values differences are less than tolerance
     * @return {<Array.<Array.<Number>>>} gain
     */
    asymptoticGain(tolerance?: number): <Array_3>() => <Array_4>() => <Number_2>() => any;
  }
}
