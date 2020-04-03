<template>
  <div class="ui-tabs">
    <slot name="header"></slot>
    <div :class="wrapClass">
      <div :class="tabClass">
        <table-nav ref="nav" :tabs="tabs" :prefix-cls="prefixCls" :onTabClick="handleTabClick"></table-nav>
      </div>
      <div :class="[`${prefixCls}-body`, bodyClass]" @scroll.passive="handleScroll" ref="body">
        <slot></slot>
      </div>
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script>
import TableNav from './tableNav';
import { oneOf } from './utils';

const prefixCls = 'ui-tab';

export default {
  name: 'tabListView',
  props: {
    // 选中的tab名
    activeName: String,
    // 选中的tab，是为了使用v-model语法糖
    value: [String, Number],
    // 标签位置
    tabPosition: {
      validator: v => oneOf(v, ['bottom', 'top']),
      default: 'top',
    },
    // 记忆滚动位置
    memory: {
      validator: v => typeof v === 'boolean' || oneOf(v, ['x', 'y', '']),
      default: false,
    },
    bodyClass: String,
    headerClass: String,
  },
  data() {
    return {
      currentName: this.value || this.activeName,
      tabs: [],
      prefixCls,
    };
  },
  components: { TableNav },
  computed: {
    tabClass() {
      return [`${this.prefixCls}-header-${this.tabPosition}`, `${this.prefixCls}-header`, this.headerClass];
    },
    wrapClass() {
      return [
        `${this.prefixCls}-wrapper`,
        {
          [`${this.prefixCls}-is_top`]: this.tabPosition === 'top',
          [`${this.prefixCls}-is_bottom`]: this.tabPosition === 'bottom',
        },
      ];
    },
  },
  created() {
    this.caches = {};
    if (!this.currentName) {
      this.setCurrentName('0');
    }
  },
  mounted() {
    this.getTabsInstance();
  },
  updated() {
    this.getTabsInstance();
  },
  methods: {
    getTabsInstance() {
      if (this.$slots.default) {
        const tabSlots = this.$slots.default.filter(
          vnode => vnode.tag && vnode.componentOptions && vnode.componentOptions.Ctor.options.name === 'tabView'
        );
        const tabs = tabSlots.map(({ componentInstance }) => componentInstance);
        if (!(tabs.length === this.tabs.length && tabs.every((tab, index) => tab === this.tabs[index]))) {
          tabs.forEach((tab, index) => (tab.index = `${index}`));
          this.tabs = tabs;
        }
      } else if (this.tabs.length !== 0) {
        this.tabs = [];
      }
    },
    setCurrentName(value) {
      if (value !== this.currentName) {
        this.currentName = value;
        this.$emit('input', value);
      }
    },
    handleTabClick(tab, tabName, event) {
      if (tab.disabled || tab.active) return;
      this.setCurrentName(tabName);
      if (oneOf(this.memory, [true, '']) && this.caches[tabName]) {
        const body = this.$refs.body;
        this.$nextTick(() => {
          if (body) {
            if (this.memory === 'x') {
              body.scrollLeft = this.caches[tabName].x;
            } else if (this.memory === 'y') {
              body.scrollTop = this.caches[tabName].y;
            } else {
              body.scrollLeft = this.caches[tabName].x;
              body.scrollTop = this.caches[tabName].y;
            }
          }
        });
      }
      this.$emit('tab-click', tab, event);
    },
    handleScroll(e) {
      if (oneOf(this.memory, ['', true])) {
        this.caches[this.currentName] = {
          y: e.target.scrollTop,
          x: e.target.scrollLeft,
        };
      }
    },
  },
  watch: {
    activeName(value) {
      this.setCurrentName(value);
    },
    value(value) {
      this.setCurrentName(value);
    },
    currentName() {
      if (this.$refs.nav) {
        this.$nextTick(() => {
          this.$refs.nav.$nextTick(() => {
            this.$refs.nav.scrollBarToActiveTab();
          });
        });
      }
    },
  },
};
</script>

<style lang="less">
@prefix: ~'ui-tab';
.ui-tabs {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: auto;
  padding: 0;
}
.@{prefix} {
  &-is_bottom,
  &-is_top {
    display: flex;
    flex: auto;
    flex-direction: column;
    overflow: hidden;
    user-select: none;
  }

  &-is_bottom {
    .@{prefix}-header {
      order: 2;
    }
    .@{prefix}-body {
      order: 1;
    }
  }

  &-header {
    border-top: 1px solid #dfdfdf;
    background-color: #fff;
    color: #5c5c5c;
    font-size: 0.375rem;
    display: flex;
    width: 100%;
    flex: none;
    padding: 0 0.1rem;
    box-sizing: border-box;
    user-select: none;
  }
  &-active-bar {
    width: 0.525rem;
    height: 0.075rem;
    background-color: #1482f0;
    position: absolute;
    bottom: 0.2rem;
    left: 0;
    transition: left 0.25s ease;
  }
  &-items {
    position: relative;
    flex: auto;
    display: flex;
    justify-content: space-between;
    max-width: 100%;
    height: 1.3rem;
    overflow-x: auto;
    padding-bottom: 0.2rem;
    margin-bottom: -0.2rem;
    color: #5c5c5c;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  &-item_wrap {
    width: 33.3333%;
    flex: none;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

    .active {
      color: #1482f0;
      font-size: 0.4rem;
    }
    .disabled {
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.6;
    }
  }

  &-is_disabled {
    cursor: not-allowed;
    pointer-events: none;
  }

  &-item {
    height: 100%;
    line-height: 1.3rem;
    display: inline-block;
    user-select: none;
    transition: color 500ms;
  }

  &-body {
    flex: auto;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 100%;
  }
}
</style>
