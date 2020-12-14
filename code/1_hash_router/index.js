let _Vue = null;

class VueRouter {
  static install(Vue) {
    // prevent second install
    if (VueRouter.install.installed) {
      return;
    }
    VueRouter.install.installed = true;

    // reference Vue
    _Vue = Vue;

    // 将 router 传入 vue 实例
    // _Vue.prototype.$router = this.$options.router
    _Vue.mixin({
      beforeCreate() {
        // 只有 vue 实例才有 $options.router
        // 普通组件没有 $options.router
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router;
        }
      },
    });
  }

  constructor(options) {
    this.options = options;
    // mapping: path_name -> component
    this.routeMap = {};
    // observable
    this.data = _Vue.observable({
      current: "/",
    });
    this.init();
  }

  init() {
    this._initialize_routeMap();
    this._registry_component(_Vue);
    this._add_hashchange_event();
  }

  _initialize_routeMap() {
    // 遍历所有的路由规则 吧路由规则解析成键值对的形式存储到routeMap中
    this.options.routes.forEach((route) => {
      this.routeMap[route.path] = route.component;
    });
  }

  _registry_component(Vue) {
    // registry <router-link />
    Vue.component("router-link", {
      props: {
        to: String,
      },
      render(h) {
        return h(
          "a",
          {
            attrs: {
              href: this.to,
            },
            on: {
              click: this.clickhander,
            },
          },
          [this.$slots.default]
        );
      },
      methods: {
        clickhander(e) {
          // change hash in url
          location.hash = this.to;
          // change current route path
          this.$router.data.current = this.to;
          e.preventDefault();
        },
      },
    });

    // registry <router-view />
    const self = this; // this -> router object
    Vue.component("router-view", {
      render(h) {
        const current_path = self.data.current;
        const current_component = self.routeMap[current_path];

        return h(current_component);
      },
    });
  }

  _add_hashchange_event() {
    window.addEventListener("hashchange", () => {
      this.data.current = "/" + window.location.hash.substr(1);
    });
  }
}
