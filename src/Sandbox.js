import { compileCode } from '@nx-js/compiler-util/src'

const code = compileCode('return prop1 + prop2')
const sum = code({prop1: 1, prop2: 2})

class Sandbox {
  constructor() {
  }
  addFunc = () => {
  }
  callFunc = () => {
  }
}

export default Sandbox;
