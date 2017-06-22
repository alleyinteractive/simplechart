/**
 * Async loader for chart types and charting libraries
 */
export default function chartTypeLoader(componentName) {
  return import(`../components/Chart/ChartTypes/${componentName}/index`)
    .then((module) => module.default);
}
