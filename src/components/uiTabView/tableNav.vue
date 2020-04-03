<template>
  <div :class="classes" ref="nav" @touchmove="onTouchMove" @touchstart="onTouchStart">
    <div :class="[`${prefixCls}-active-bar`]" ref="bar" v-show="isShowBar"></div>
    <div
      :key="index"
      :class="getItemWrapClass(tab)"
      v-for="(tab, index) in tabs"
      @click="onTabClick(tab, tab.name || tab.index || index, $event)"
    >
      <span :class="getItemClass(tab)">
        <tab-label :tab="tab" />
      </span>
    </div>
  </div>
</template>

<script>
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
  easeMove(element.scrollLeft, position, 4, function(value) {
    element.scrollLeft = value;
  });
};
export default {
  props: {
    tabs: Array,
    prefixCls: String,
    currentName: String,
    onTabClick: {
      type: Function,
      default: () => {},
    },
  },
  components: {
    tabLabel: {
      functional: true,
      props: {
        tab: Object,
      },
      render(h, ctx) {
        const { tab } = ctx.props;
        return h('span', null, tab.$slots.label || tab.label);
      },
    },
  },
  computed: {
    classes() {
      return [`${this.prefixCls}-items`];
    },
    isShowBar() {
      return this.tabs.some(tab => tab.active);
    },
  },
  methods: {
    onTouchStart(e) {
      const events = e.touches[0] || e;
      this.movePosition = { x: events.pageX, y: events.pageY };
    },
    onTouchMove(e) {
      const events = e.touches[0] || e;
      const yDistance = events.pageY - this.movePosition.y;
      if (Math.abs(yDistance) > 5) {
        e.preventDefault();
      }
    },
    scrollToActiveTab() {
      const tab = this.$refs.nav;
      const activeTab = this.$el.querySelector(`.${this.prefixCls}-is_active`);
      if (activeTab) {
        const posInfo = activeTab.getBoundingClientRect();
        if (activeTab.x < window.innerWidth) {
          scrollTo(tab, tab.scrollLeft + (window.innerWidth - posInfo.width) / 2);
        } else {
          scrollTo(tab, tab.scrollLeft + posInfo.x - posInfo.width);
        }
      }
    },
    scrollBarToActiveTab() {
      const bar = this.$refs.bar;
      const tab = this.$refs.nav;
      const activeTab = this.$el.querySelector(`.${this.prefixCls}-is_active`);
      if (activeTab) {
        const posInfo = activeTab.getBoundingClientRect();
        if (activeTab.x < window.innerWidth) {
          bar.style.left = tab.scrollLeft + (window.innerWidth - posInfo.width) / 2 + 'px';
          bar.style.cssText = `left: ${tab.scrollLeft + (window.innerWidth - posInfo.width) / 2}px;`;
        } else {
          bar.style.left = tab.scrollLeft + posInfo.left + (posInfo.width - bar.clientWidth) / 2 + 'px';
          bar.style.cssText = `left: ${tab.scrollLeft + posInfo.left + (posInfo.width - bar.clientWidth) / 2}px;`;
        }
      }
    },
    getItemWrapClass(tab) {
      return [
        `${this.prefixCls}-item_wrap`,
        {
          [`${this.prefixCls}-is_active`]: tab.active,
          [`${this.prefixCls}-is_disabled`]: tab.disabled,
        },
      ];
    },
    getItemClass(tab) {
      return [{ active: tab.active, disabled: tab.disabled }, `${this.prefixCls}-item`];
    },
  },
  mounted() {
    this.isFirstLoad = true;
    this.$nextTick(() => {
      this.scrollToActiveTab();
      this.scrollBarToActiveTab();
    });
  },
  updated() {
    this.$nextTick(() => {
      if (this.isFirstLoad) {
        this.scrollToActiveTab();
        this.isFirstLoad = false;
      }
      this.scrollBarToActiveTab();
    });
  },
};
</script>
