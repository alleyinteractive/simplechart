/**
 * Build a multilevel object from a string like foo.bar.bop into an object like
 * { foo: { bar: { bop: value } } }
 * to use with https://facebook.github.io/react/docs/update.html
 *
 * @param string tree Use dots to indicate multiple levels for depth
 * @param any value Value to apply to the deepest level of the tree
 * @return obj
 */
export default function (treeString, value) {
  let treeObj;
  const treeLevels = treeString.split('.');

  // work backwards and construct the object from the inside out
  treeLevels.reverse();
  treeLevels.forEach((level, index) => {
    if (0 === index) {
      treeObj = { [level]: value };
    } else {
      treeObj = { [level]: treeObj };
    }
  });
  return treeObj;
}
