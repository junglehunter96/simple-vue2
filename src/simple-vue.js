// 数据劫持
class Observer {
  constructor(data) {
    this.observe(data);
  }
  observe(data) {
    if (data && typeof data === "object") {
      Object.keys(data).forEach((key) => {
        this.defineReactive(data, key, data[key]);
      });
    }
  }
  defineReactive(data, key, value) {
    // 递归绑定值
    this.observe(value);
    Object.defineProperty(data, key, {
      get() {
        console.log("data get:", data, key, value);
        return value;
      },
      set: (newV) => {
        if (value === newV) return;
        // 保证复杂对象也能被劫持
        console.log("data set:", data, key, newV);

        this.observe(value);
        value = newV;
      },
    });
  }
}

class Vue {
  constructor(options) {
    this.$el = options.el;
    this.$data = options.data;
    this.$options = options;

    //触发this.$data.xx和模版的绑定
    new Observer(this.$data);

    this.proxyData(this.$data);
  }

  // 数据代理 (转发) 可以通过this.xx 更改this.$data.xxx的结果
  proxyData(data) {
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        get() {
          console.log("get:", key);
          return data[key];
        },
        set(newVal) {
          console.log(key, newVal);
          data[key] = newVal;
        },
      });
    });
  }
}
