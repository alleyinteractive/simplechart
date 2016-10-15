/**
 * Async loader for chart types and charting libraries
 */
export default function(typeObj) {
  return new Promise((resolve) => {
    require.ensure([], () => {
      resolve(require(`../chartTypes/${typeObj.type}.js`).default);
    });
  });
}
