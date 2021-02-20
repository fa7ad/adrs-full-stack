module.exports = {
  '**/*.ts(x)?': () => 'yarn type-check',
  '**/*.(t|j)s(x)?': filenames => `yarn lint ${filenames.join(' ')}`
};
