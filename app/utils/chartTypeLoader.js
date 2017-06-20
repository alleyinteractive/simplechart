/**
 * Async loader for chart types and charting libraries
 */
export default function chartTypeLoader(componentName) {
  return new Promise((resolve) => {
    require.ensure([], () => {
      resolve(require(`../components/Chart/ChartTypes/${componentName}/index`).default); // eslint-disable-line global-require,import/no-dynamic-require
    });
  });
}
