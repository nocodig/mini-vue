class Compiler {
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;

    this.compile(this.el);
  }

  // 编译末班。处理文本节点和元素节点
  compile(el) {
    // 
    let childNodes = el.childNodes; // 伪数组
    Array.from(childNodes).forEach(node => {
      if (this.isTextNode(node)) {
        // 处理文本节点
        this.compileText(node);
      } else if (this.isElementNode(node)) {
        this.compileElement(node);
      }
      // 判断node节点是否有子节点
      if (node.childNodes && node.childNodes.length) {
        this.compile(node);
      }
    })
  }

  // 编译元素节点，处理指令
  compileElement(node) {
    // console.log(node.attri);
    // 遍历所有的属性节点
    Array.from(node.attributes).forEach(attr => {
      let attrName = attr.name;
      // 是否是指令
      if (this.isDirective(attrName)) {
        // v-text ->text
        attrName = attrName.substr(2);
        const key = attr.value;

        // 判断该指令是否事件
        if (attrName.startsWith('on')) {
          this.eventUpdater(node, key);

          return;
        }

        this.update(node, key, attrName);
      }
    })

  }

  update(node, key, attrName) {
    const updateFn = this[`${attrName}Updater`];

    updateFn && updateFn.call(this, node, this.vm[key], key);
  }

  eventUpdater(node, key) {
    const event = attrName.replace('on:', '');
    this.onUpdater(node, key, event);
  }



  textUpdater(node, value, key) {
    node.textContent = value

    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue;
    })
  }

  modalUpdater(node, value, key) {
    node.value = value;

    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue;
    })

    // 实现双向绑定
    node.addEventListener('input', () => {
      this.vm[key] = node.value;
    })
  }

  htmlUpdater(node, value, key) {
    node.innerHTML = value;

    new Watcher(this.vm, key, (newValue) => {
      node.innerHTML = newValue;
    })
  }

  onUpdater(node, key, event) {
    node.addEventListener(event, this.vm[key])
  }

  // 编译文本几点，处理差值表达式
  compileText(node) {
    // console.dir(node);
    // {{ msg }}
    const reg = /\{\{(.+?)\}\}/;
    const value = node.textContent;
    if (reg.test(value)) {
      //  获取匹配到分组的内容
      const key = RegExp.$1.trim();
      node.textContent = value.replace(reg, this.vm[key]);

      // 创建watcher对象
      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue;
      })
    }
  }

  // 判断元素属性，是否是指令
  isDirective(attrName) {
    return attrName.startsWith('v-');
  }

  // 是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3;
  }

  // 是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1;
  }
}