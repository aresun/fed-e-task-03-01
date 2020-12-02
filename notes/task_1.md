### 前端路由
- history 模式
    - 改变 url 但不发送 request 到 server
    - 但是中途直接输入 url 会发生并跳转会发送 request
        - server history 模式开启，会使所有 url 请求返回 根路由页面
        - 根路由页面再依据 url 加载前端路由