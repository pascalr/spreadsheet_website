class Helper {
  static nextTableName(defs) {
    let i = 1;
    const defsName = Object.keys(defs).reduce((acc,k) => {
      acc[defs[k].name] = true
      return acc;
    }, {})
    while (defsName["table" + i]) {i++}
    return "table" + i
  }
}

export function nextColumnName(def) {
  if (!def.cols) { return 'A' }
  return String.fromCharCode(65 + Object.keys(def.cols).length);
}

export default Helper;
