
class AstTraversal {
  constructor(ast) {
    this.ast = ast;
    this.stack = [];
    this.callbacks = {};
  }

  on(type, callback) {
    if (! this.callbacks[type]) {
      this.callbacks[type] = [];
    }
    this.callbacks[type].push(callback);
  }

  _applyCallbacks(node) {
    for (const callbackId of [node.type, '*']) {
      if (this.callbacks[callbackId]) {
        for (const cb of this.callbacks[callbackId]) {
          const result = cb(node, this.stack, this.ast);
          if (false === result) {
            return;
          }
        }
      }
    }
  }

  traverse(ast) {
    // if (null === ast) {
    //   return;
    // }
    if (Array.isArray(ast)) {
      let i = 0;
      for (const node of ast) {
        this.stack.push({levelType:'listIndex', id:i});
        this.traverse(node);
        this.stack.pop();
        i++;
      }
      return;
    }
    if ('object' === typeof ast) {
      if (!ast || ! ast.type) { // Not a node, i.e. `loc` or `value:{}` or similar.
        return;
      }
      this._applyCallbacks(ast);
      this.stack.push({levelType:'nodeType', id:ast.type});
      for (const field of Object.keys(ast)) {
        // if ('loc' === field) {
        //   continue;
        // }
        this.stack.push({levelType:'fieldName', id:field});
        this.traverse(ast[field]);
        this.stack.pop();
      }
      this.stack.pop();
      return;
    }
  }

  start() {
    this.traverse(this.ast);
  }

  getAst() {
    return this.ast;
  }
}

module.exports = AstTraversal;
