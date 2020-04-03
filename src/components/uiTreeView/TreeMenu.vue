<template>
  <li @click.stop.prevent="handleItemClick" ref="item" :class="classes">
    <div :class="[`${prefixCls}-item-title`]">
      <slot :node="items" :title="title" :z-index="menuIndex">
        <node-content
          :title="title"
          :node="items"
          :tree="tree"
          :menu-index="menuIndex"
          :prefix-cls="prefixCls"
        ></node-content>
        <i :class="[{ expand: !items.expand }, `${prefixCls}-arrow`]" v-if="hasChild"></i>
      </slot>
    </div>
    <transition-expand>
      <ul v-show="items.expand" v-if="hasChild">
        <tree-menu
          v-for="item in items[props.children]"
          :key="item[tree.uniqueKey]"
          :items="item"
          :props="props"
          :relative-top="relativeTop"
          :menu-index="menuIndex + 1"
          :cascade="cascade"
          :prefix-cls="prefixCls"
          :collapse-click="collapseClick"
        ></tree-menu>
      </ul>
    </transition-expand>
  </li>
</template>

<script>
import TransitionExpand from '@/components/uiTransitionExpand/TransitionExpand';

let lastTime = 0;
const prefixes = 'webkit moz ms o'.split(' '); //各浏览器前缀

let requestAnimationFrame = window.requestAnimationFrame;
let cancelAnimationFrame = window.cancelAnimationFrame;

let prefix;
//通过遍历各浏览器前缀，来得到requestAnimationFrame和cancelAnimationFrame在当前浏览器的实现形式
for (let i = 0; i < prefixes.length; i++) {
  if (requestAnimationFrame && cancelAnimationFrame) {
    break;
  }
  prefix = prefixes[i];
  requestAnimationFrame = requestAnimationFrame || window[prefix + 'RequestAnimationFrame'];
  cancelAnimationFrame =
    cancelAnimationFrame || window[prefix + 'CancelAnimationFrame'] || window[prefix + 'CancelRequestAnimationFrame'];
}

if (!requestAnimationFrame || !cancelAnimationFrame) {
  requestAnimationFrame = function(callback) {
    const currTime = new Date().getTime();
    const timeToCall = Math.max(0, 16 - (currTime - lastTime));
    const id = window.setTimeout(function() {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };

  cancelAnimationFrame = function(id) {
    window.clearTimeout(id);
  };
}

const easeMove = (startPos, targetPos, rate, callback) => {
  if (startPos === targetPos || typeof startPos !== 'number') {
    return;
  }
  targetPos = targetPos || 0;
  rate = rate || 2;
  let timer;

  const step = () => {
    startPos = startPos + (targetPos - startPos) / rate;

    if (startPos < 1 || Math.abs(targetPos - startPos) < 1) {
      callback(targetPos, true);
      cancelAnimationFrame(timer);
      return;
    }
    callback(startPos, false);
    timer = requestAnimationFrame(step);
  };
  step();
};

const scrollTo = (element, position) => {
  easeMove(element.scrollTop, position, 4, function(value) {
    element.scrollTop = value;
  });
};

const getElementTop = element => {
  let actualTop = element.offsetTop,
    current = element.offsetParent;

  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }

  return actualTop;
};

const findComponentUpward = (context, componentName) => {
  let parent = context.$parent,
    name = parent.$options.name;

  while (parent && (!name || name !== componentName)) {
    parent = parent.$parent;

    if (parent) {
      name = parent.$options.name;
    }
  }

  return parent;
};
export default {
  name: 'TreeMenu',
  props: {
    items: {
      type: Object,
      default: () => ({}),
    },
    menuIndex: Number,
    collapseClick: Boolean,
    props: {
      type: Object,
      required: true,
    },
    cascade: {
      type: Boolean,
      default: false,
    },
    relativeTop: Number,
    prefixCls: String,
  },
  data() {
    return {
      tree: findComponentUpward(this, 'LeaseTree'),
      children: this.items[this.props.children],
    };
  },
  components: {
    TransitionExpand,
    NodeContent: {
      functional: true,
      props: {
        title: { required: true },
        node: { require: true, type: Object },
        menuIndex: Number,
        prefixCls: String,
        tree: Object,
      },
      render(h, ctx) {
        const { tree, node, title, menuIndex, prefixCls } = ctx.props;
        return h(
          'span',
          {
            class: [`${prefixCls}-index-${menuIndex}`, 'flex-row', { disabled: node.disabled }],
          },
          tree.$scopedSlots.default ? tree.$scopedSlots.default({ title, node, zIndex: menuIndex }) : title
        );
      },
    },
  },
  computed: {
    hasChild() {
      return this.children && this.children.length;
    },
    title() {
      return this.items[this.props.title];
    },
    classes() {
      return [
        'needsclick',
        this.items.className,
        `${this.prefixCls}-node-${this.menuIndex}`,
        `${this.prefixCls}-node`,
        { active: this.items.active },
      ];
    },
  },
  methods: {
    scrollToItem(uniqueKey) {
      if (this.items[this.tree.uniqueKey] === uniqueKey && !this.items.isClick) {
        this.$nextTick(() => {
          const offsetTop = getElementTop(this.$refs.item) + this.relativeTop;
          const el = this.tree.root;
          if (offsetTop > window.innerHeight) {
            const position = offsetTop - innerHeight / 2;
            scrollTo(el, position);
          } else {
            scrollTo(el, 0);
          }
        });
      }
    },
    handleItemClick() {
      if ((this.items.active && !this.hasChild) || this.items.disabled) {
        return;
      }
      this.$set(this.items, 'isClick', true);
      this.$set(this.items, 'active', true);
      if (this.hasChild) {
        this.$set(this.items, 'expand', !this.items.expand);
        if (this.tree) {
          this.tree.isCollapse = this.tree.items.every(item => !item.expand);
        }
      }

      this.tree && this.tree.$emit('on-toggle-expand', this.items, this.items.expand, this.tree.isCollapse);
    },
    isChildrenActive(items) {
      const children = this.props.children;
      return items.some(item => {
        if (Array.isArray(item[children]) && item[children].length > 0) {
          return this.isChildrenActive(item[children]);
        }
        return item.active;
      });
    },
  },
  watch: {
    children: {
      deep: true,
      handler: function(data) {
        if (data) {
          let isActive;
          if (!this.cascade) {
            const isRoot = this.tree.items.findIndex(d => d === this.items) > -1;
            const isChildrenActive = this.isChildrenActive(data);
            if (isChildrenActive && !this.collapseClick) {
              this.$set(this.items, 'expand', true);
            }
            isActive = (isRoot || this.items.active) && isChildrenActive;
            this.$set(this.items, 'active', isActive);
          } else {
            isActive = data.some(d => d.active);
            this.$set(this.items, 'active', isActive || this.items.active);
            isActive && !this.collapseClick && !this.items.isClick && this.$set(this.items, 'expand', isActive);
          }
        }
      },
    },
    'items.active': {
      handler: function(active) {
        const tree = this.tree;
        if (active && (!this.children || this.children.length === 0) && tree) {
          setTimeout(() => {
            this.scrollToItem(tree[tree.uniqueKey]);
          });
        }
      },
    },
  },
};
</script>
