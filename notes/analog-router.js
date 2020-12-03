let _Vue = null;

export default class VueRouter {
  // for `Vue.use` to call `install`
  static install(Vue) {
    // 1. 判断插件是否已安装
    if (VueRouter.install.is_installed) {
      return;
    }
    VueRouter.install.is_installed = true;

    // 2. 把 vue 构造函数记录到全局变量
    _Vue = Vue;

    // 3. 创建 vue instance 时传入 router 对象，注入到 vue instance
    // mixin to all components
    _Vue.mixin({
      beforeCreate() {
        // vue instance has `router`, components' $options has no `router`
        // so, execute once only
        if (this.$options.router) {
          // `this.$options.router` is router instance of VueRouter
          _Vue.prototype.$router = this.$options.router;
          this.$options.router.init();
        }
      },
    });
  }

  constructor(options) {
    this.options = options;
    this.route_map = {};
    // observable: transform object to *responsive object*
    this.data = _Vue.observable({
      current: "/", // deafult root path
    });
  }

  init() {
    this.create_route_map();
    this.init_components(_Vue);
    this.init_event();
  }

  create_route_map() {
    // traversal all route
    // transform route rules to key-value pair
    // store it ro `route_map`

    this.options.routes.forEach((the_route) => {
      this.route_map[the_route.path] = the_route.component;
    });
  }

  init_components(Vue) {
    // create <route-link> component
    Vue.component("router-link", {
      props: {
        to: String,
      },
      // below need compiler support:
      // template: '<a :href="to"><slot></slot></a>',

      // h is from vue, to create virtual dom
      render(h) {
        const selector = `a`;
        const properties = {
          attrs: {
            href: this.to, // component'sF prop: to
          },
          on: {
            click: this.clickHandler,
          },
        };
        const children_elements = [this.$slots.default];

        return h(selector, properties, children_elements);
      },
      methods: {
        clickHandler(e) {
          history.pushState({}, "", this.to);
          this.$router.data.current = this.to;
          e.preventDefault();
        },
      },
    });

    const self = this; // self -> VueRouter's instance
    // create <router-view>
    Vue.component(`router-view`, {
      render(h) {
        const component = self.route_map[self.data.current];
        return h(component);
      },
    });
  }

  init_event() {
    window.addEventListener(`popstate`, () => {
      this.data.current = window.location.pathname;
    });
  }
}
