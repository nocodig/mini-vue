class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    // data 中的属性名称
    this.key = key;
    // 回调函数负责更新视图 
    this.cb = cb;

    // 把watcher对象记录到Dep的静态属性target中
    Dep.target = this;
    // 触发静态方法，在get方法中调用addSub
    this.oldValue = vm[key];

    Dep.target = null;
  }

  update() {
    let newValue = this.vm[this.key];

    if (newValue === this.oldValue) {
      return;
    }

    this.cb(newValue);
  }
}