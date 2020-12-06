# 响应式原理

## defineProperty

## proxy

- 不用处理循环
- 浏览器做了内部优化

## 发布/订阅者模式

- 发布者向处理中心 publish 信号，订阅者 向处理中心 subscribe, publish 时, 处理中心通知 订阅者

### vue 自定义事件

- `vm.$on()`
- `vm.$emit()`
- 兄弟组件通信

```javascript
let eventHub = new Vue();

// publisher
eventHub.$emit("event_name", { text: this.newTodoText });

// subscriber
eventHub.$on("event_name", callback);
```

### analog

```javascript
// 事件触发器 implementation
class EventEmitter {
  constructor() {
    // { 'click': [fn1, fn2], 'change': [fn] }
    this.subs = Object.create(null);
  }

  // 注册事件
  $on(eventType, handler) {
    this.subs[eventType] = this.subs[eventType] || [];
    this.subs[eventType].push(handler);
  }

  // 触发事件
  $emit(eventType) {
    if (this.subs[eventType]) {
      this.subs[eventType].forEach((handler) => {
        handler();
      });
    }
  }
}

// 测试
let em = new EventEmitter();

// subscript
em.$on("click", () => {
  console.log("click1");
});
em.$on("click", () => {
  console.log("click2");
});

// publish
em.$emit("click");
```

## 观察者模式

- 观察者 `update()`
- 目标(publisher) -Dep
  - `subs` 所有观察者
  - `addSub()` add observer
  - `notify()` call all observers' `update()`

```javascript
// 发布者-目标
class Dep {
  constructor() {
    // all observers
    this.subs = [];
  }
  // add observer
  addSub(sub) {
    if (sub && sub.update) {
      this.subs.push(sub);
    }
  }
  // broadcast to all observers
  notify() {
    this.subs.forEach((sub) => {
      sub.update();
    });
  }
}
// 订阅者-观察者
class Watcher {
  update() {
    console.log("update");
  }
}

// 测试
let dep = new Dep();
let watcher = new Watcher();

dep.addSub(watcher);
// broadcast to all watcher
dep.notify();
```
