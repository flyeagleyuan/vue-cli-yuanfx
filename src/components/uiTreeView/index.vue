<template>
  <ul :class="classes" ref="wrapper">
    <tree-menu
      :items="item"
      v-for="item in items"
      :key="item[uniqueKey]"
      :props="transportProps"
      :menu-index="menuIndex"
      v-bind="$attrs"
      :prefix-cls="prefixCls"
      :cascade="cascade"
      :relative-top="relativeTop"
      :collapse-click="collapseClick"
    ></tree-menu>
  </ul>
</template>

<script>
/**
 * @author Leevare Email:liwei2@finchina.com
 * @date 2019/2/13 16:59
 * @description 节点树目录组件
 */

import { cloneDeep, debounce } from 'lodash';
import TreeMenu from './TreeMenu';

const prefixCls = 'ui-tree';

export default {
  name: 'LeaseTree',
  props: {
    // 节点树数据
    data: {
      type: Array,
      default: () => [],
    },
    // 每个节点唯一标识符
    uniqueKey: {
      type: String,
      required: true,
    },
    props: {
      type: Object,
      default: () => ({}),
    },
    cascade: {
      type: Boolean,
      default: false,
    },
    relativeTop: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      prefixCls,
      items: cloneDeep(this.data),
      menuIndex: 0,
      isCollapse: false,
      root: null,
      // 此属性用于控制全部折叠与展开，防止treeMenu内部检测children变动而无法收起高亮的根级树
      collapseClick: false,
      transportProps: Object.assign({}, { title: 'root_name', children: 'children' }, this.props),
    };
  },
  components: {
    TreeMenu,
  },
  computed: {
    classes() {
      return [this.prefixCls];
    },
  },
  created() {
    this.$on('on-toggle-expand', this.handleToggleExpand);
    this.$nextTick(() => {
      this.highlightItem(this.items);
    });
  },
  mounted() {
    this.root = this.$refs.wrapper;
  },
  beforeDestroy() {
    delete window.setHighlight;
  },
  methods: {
    cancelAllActive() {
      this.cancelActive(this.items);
    },
    handleToggleExpand(items) {
      const children = this.props.children;
      if (!items[children] || !items[children].length) {
        this.handleItemClick(items);
      }
      this.cancelActive(this.items, [items]);
    },
    // 节点点击事件在这里处理
    handleItemClick(items) {
      this[this.uniqueKey] = items[this.uniqueKey];
      this.collapseClick = false;
      this.$emit('on-item-click', items);
    },
    // 排除excludes节点数组取消高亮
    cancelActive(items, excludes = []) {
      const children = this.props.children;
      items.forEach(item => {
        if (excludes.indexOf(item) === -1) {
          this.$set(item, 'active', false);
          if (item[children] && item[children].length > 0) {
            this.cancelActive(item[children], excludes);
          }
        }
      });
    },
    // 点击自动全部展开或全部收起
    handleCollapseClick: debounce(function() {
      // this.cancelActive(this.items);
      this.collapseClick = true;
      if (this.isCollapse) {
        this.toggleCollapseItems(this.items, true);
        this.isCollapse = false;
      } else {
        this.toggleCollapseItems(this.items, false);
        this.isCollapse = true;
      }
      this.$emit('on-toggle-change', this.isCollapse);
    }, 300),
    toggleCollapseItems(items, isExpand) {
      const children = this.props.children;
      items.forEach(item => {
        if (item[children] && item[children].length > 0) {
          this.$set(item, 'expand', isExpand);
          this.toggleCollapseItems(item[children], isExpand);
        }
      });
    },
    // 设置指定的节点高亮，节点必须包含唯一属性，用作定位
    setHighlight(uniqueKey) {
      this[this.uniqueKey] = uniqueKey;
      this.highlightItem(this.items);
    },
    // 高亮节点树
    highlightItem(items, isCollapse) {
      const children = this.props.children;
      this.isCollapse = typeof isCollapse === 'undefined' ? false : isCollapse;
      items.forEach(item => {
        this.$set(item, 'active', false);
        if (item[children] && item[children].length > 0) {
          this.$set(item, 'active', false);
          this.highlightItem(item[children], this.isCollapse);
        } else {
          if (item[this.uniqueKey] === this[this.uniqueKey]) {
            this.isCollapse = false;
            this.$set(item, 'active', true);
            this.$set(item, 'isClick', false);
          } else {
            this.$set(item, 'active', false);
          }
        }
      });
    },
  },
  watch: {
    data(value) {
      this.items = cloneDeep(value);
      // 默认展开所有
      this.toggleCollapseItems(this.items, true);
      this.$nextTick(() => {
        this.highlightItem(this.items);
      });
    },
  },
};
</script>

<style lang="less">
@prefix: ~'ui-tree';

.@{prefix} {
  font-size: 0.35rem;
  color: #3c3c3c;
  user-select: none;

  & > li {
    padding-left: 0.875rem;
    position: relative;

    &:before {
      content: '';
      width: 0.15rem;
      height: 0.15rem;
      background-color: #dfdfdf;
      border-radius: 50%;
      position: absolute;
      left: 0.4rem;
      margin-top: 0.45rem;
    }

    &.active {
      &:before {
        background-color: #ff7500;
      }
    }

    & > .@{prefix}-item-title {
      color: #111111;

      span {
        font-weight: 600;
      }
    }
  }

  li {
    padding-right: 0.3rem;
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

    &.active {
      & > .@{prefix}-item-title {
        color: #ff7500;
      }
    }

    &.disabled {
      opacity: 0.6;
      pointer-events: none;
      cursor: not-allowed;
    }

    ul {
      padding-left: 0.24rem;
    }
  }

  &-item-title {
    position: relative;
    user-select: none;

    .disabled {
      pointer-events: none;
      cursor: not-allowed;
      color: #bbbbbb;
    }
  }

  &-arrow {
    &:after {
      content: '';
      display: inline-block;
      border: 1px solid;
      border-color: #8c8c8c #8c8c8c transparent transparent;
      width: 0.15rem;
      height: 0.15rem;
      transform: rotate(-45deg);
      vertical-align: -0.075rem;
      margin-left: 0.1rem;
      margin-top: 0.125rem;
      transition: transform ease 200ms;
    }

    &.expand {
      &:after {
        transform: rotate(135deg);
        vertical-align: 0.1875rem;
      }
    }
  }

  &-arrow {
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -0.25rem;
  }

  li > .@{prefix}-item-title > span {
    padding: 0.275rem 0 0.275rem 0.08rem;
    align-items: center;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
