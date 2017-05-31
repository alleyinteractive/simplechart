/**
 * Async loader for chart types and charting libraries
 */
export default function chartTypeLoader(componentName) {
  return new Promise((resolve) => {
    require.ensure([], () => {
      resolve(require(`../components/Chart/Adapters/${componentName}/index`).default); // eslint-disable-line max-len
    });
  });
}
