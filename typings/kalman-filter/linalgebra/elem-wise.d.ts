declare function _exports(arrayMatrixes: any, fn: elemWiseCb): Array<Array<number>>;
export = _exports;
export type elemWiseCb = (arr: Array<number>, rowId: number, colId: number) => any;
