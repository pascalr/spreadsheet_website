class Helper {
  static nextTableName(defs) {
    let i = 1;
    while (defs["table" + i]) {i++}
    return "table" + i
  }
}

export default Helper;
