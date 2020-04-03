export default {
  name: 'tabView',
  props: {
    // tab显示名
    label: String,
    // 禁用
    disabled: Boolean,
    // 懒加载
    lazy: Boolean,
    // tab名
    name: [String, Number],
  },
  data() {
    return {
      index: null,
      loaded: false,
    };
  },
  computed: {
    active() {
      const active = this.$parent.currentName === (typeof this.name === 'undefined' ? this.index : this.name);
      if (active) {
        this.loaded = true;
      }
      return active;
    },
  },
  render(h) {
    if (!this.lazy || this.loaded || this.active) {
      return h(
        'div',
        {
          class: [`${this.$parent.prefixCls}-body-item`],
          style: {
            display: this.active ? '' : 'none',
          },
        },
        this.$slots.default
      );
    }
    return null;
  },
};
