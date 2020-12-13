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

## 2、请简述 Diff 算法的执行过程

- 只比较同级别子节点, 通过 `updateChildren()` 函数
- `updateChildren()` 函数
  - 首先记录 新老节点数组的开始结尾索引, 用于通过移动索引遍历记录位置;
  - 对节点进行比较
    - oldStartVnode / newStartVnode 与 oldEndVnode / newEndVnode
      - 俩个开始节点相同(key & sel), 则`patchVnode()` 对比和更新节点, 这 2 个索引为开始节点则都加 1, 为结束节点减 1
    - oldStartVnode / oldEndVnode
      - 这 2 个节点相同, 则 `patchVnode()` 对比和更新节点, 将 oldVnode 对应的 dom 移动到 oldEndIdx 右侧, 并更新这 2 个索引
    - oldEndVnode / newStartVnode
      - 这 2 个节点相同, 则 `patchVnode()` 对比和更新节点, 将 oldVnode 对应的 dom 移动到 oldStartIdx 左侧, 并更新这 2 个索引
    - 如果不是以上 4 种情况
      - 遍历新节点，使用 newStartNode 的 key 在老节点数组中找相同节点
        - 如果没有找到，说明 newStartNode 是新节点; 创建新节点对应的 DOM 元素，插入到 DOM 树中
        - 如果找到了, 判断新节点和找到的老节点的 sel 选择器是否相同
          - 不相同，说明节点被修改了; 重新创建对应的 DOM 元素，插入到 DOM 树中;
          - 如果相同，把 elmToMove 对应的 DOM 元素，移动到 oldStartIdx 左边
  - 循环结束
    - 当老节点的所有子节点先遍历完 (oldStartIdx > oldEndIdx)，将剩余新节点批量插入循环结束
    - 新节点的所有子节点先遍历完 (newStartIdx > newEndIdx)，将剩余老节点删除, 循环结束
