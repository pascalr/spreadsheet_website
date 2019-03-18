class Helper {
  static nextTableName(defs) {
    let i = 1;
    while (defs["table" + i]) {i++}
    return "table" + i
  }
}

export function nextColumnName(def) {
  return String.fromCharCode(65 + def.columns.length);
}

export default Helper;
