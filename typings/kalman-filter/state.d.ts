declare module 'kalman-filter' {
  /**
   * @class
   * Class representing a multi dimensionnal gaussian, with his mean and his covariance
   * @property {Number} [index=0] the index of the State in the process, this is not mandatory for simple Kalman Filter, but is needed for most of the use case of extended kalman filter
   * @property {Array.<Array.<Number>>} covariance square matrix of size dimension
   * @property {Array.<Array<Number>>} mean column matrix of size dimension x 1
   */
  declare class State {
    /**
     * Check the consistency of the State's attributes
     */
    static check(
      state: any,
      {
        dimension,
        title,
        eigen
      }?: {
        dimension?: any;
        title?: any;
        eigen: any;
      }
    ): void;
    static matMul({ state, matrix }: { state: any; matrix: any }): State;
    constructor({ mean, covariance, index }: { mean: any; covariance: any; index: any });
    mean: any;
    covariance: any;
    index: any;
    /**
     * Check the consistency of the State
     */
    check(options: any): void;
    /**
     * From a state in n-dimension create a state in a subspace
     * If you see the state as a N-dimension gaussian,
     * this can be viewed as the sub M-dimension gaussian (M < N)
     * @param {Array.<Number>} obsIndexes list of dimension to extract,  (M < N <=> obsIndexes.length < this.mean.length)
     * @returns {State} subState in subspace, with subState.mean.length === obsIndexes.length
     */
    subState(obsIndexes: Array<number>): State;
    /**
     * Simple Malahanobis distance between the distribution (this) and a point
     * @param {Array.<[Number]>} point a Nx1 matrix representing a point
     */
    rawDetailedMahalanobis(
      point: Array<[number]>
    ): {
      diff: number[][];
      covarianceInvert: any;
      value: number;
    };
    /**
     * Malahanobis distance is made against an observation, so the mean and covariance
     * are projected into the observation space
     * @param {KalmanFilter} kf kalman filter use to project the state in observation's space
     * @param {Observation} observation
     * @param {Array.<Number>} obsIndexes list of indexes of observation state to use for the mahalanobis distance
     */
    detailedMahalanobis({ kf, observation, obsIndexes }: any): any;
    /**
     * @param {KalmanFilter} kf kalman filter use to project the state in observation's space
     * @param {Observation} observation
     * @param {Array.<Number>} obsIndexes list of indexes of observation state to use for the mahalanobis distance
     * @returns {Number}
     */
    mahalanobis(options: any): number;
    /**
     * Bhattacharyya distance is made against in the observation space
     * to do it in the normal space see state.bhattacharyya
     * @param {KalmanFilter} kf kalman filter use to project the state in observation's space
     * @param {State} state
     * @param {Array.<Number>} obsIndexes list of indexes of observation state to use for the bhattacharyya distance
     * @returns {Number}
     */
    obsBhattacharyya({ kf, state, obsIndexes }: any): number;
    /**
     * @param {State} otherState other state to compare with
     * @returns {Number}
     */
    bhattacharyya(otherState: State): number;
  }
}
