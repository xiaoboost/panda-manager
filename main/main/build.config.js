export default () => {
  return {
    entryPoints: ['./src/index.ts'],
    outfile: 'dist/index.js',
    platform: 'node',
  };
};
