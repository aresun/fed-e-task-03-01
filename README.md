# 简答题

## 1、当我们点击按钮的时候动态给 `data` 增加的成员是否是响应式数据，如果不是的话，如何把新增成员设置成响应式数据，它的内部原理是什么。

```javascript
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})
```

- `this.dog.name` 不会将 `name` 设置为响应式;<br> 需要通过 `Vue.set(this.dog, 'name', 'Trump')` (或 `this.$set()`) 将其设置为响应式;
- 内部原理
  - 通过给 `this.dog` 对象调用 转换响应式 方法, 遍历 `this.dog` 对象内部的属性, 将属性进行处理, 设置对应的 `getter` 和 `setter`; 在 `getter` 中收集依赖, 需通过 `new Watcher(vm,key,cb)` 执行收集依赖, `getter` 再将对应 key 的值返回; 在 `setter` 中递归处理对象转换成响应式, 并由依赖来调用 `notify()` 来触发所有 `watcher` 的`update()`, 以此响应数据的变化;
