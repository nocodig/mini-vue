class Observer {
  constructor(data) {
    this.walk(data);
  }

  walk(data) {
    // 1.判断data是否是对象
    if (!data || typeof data !== 'object') {
      return
    }
    // 2.遍历data中的所有属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }


  defineReactive(obj, key, val) {
    const _this = this;

    // 收集依赖，并发送通知
    const dep = new Dep();

    // val是对象，转换 成响应式数据
    this.walk(val)
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,

      get() {
        // 收集依赖
        Dep.target && dep.addSub(Dep.target);
        return val
      },

      set(newValue) {
        if (newValue === value) {
          return 
        }

        val = newValue;
        _this.walk(newValue)
        // 发送通知
        dep.notify();
      }
    })
  }
}