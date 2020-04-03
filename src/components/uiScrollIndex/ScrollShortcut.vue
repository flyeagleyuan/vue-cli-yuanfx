<template>
  <div class="shortcut-wrapper">
    <div class="shortcut">
      <ul>
        <li
          v-for="(label, index) in labels"
          :key="index"
          :class="{ active: currentIndex === index }"
          @touchstart="handleShortCutTouchStart($event, index)"
          @touchmove.stop.prevent="handleShortCutTouchMove"
          @touchend="handleShortCutTouchEnd"
          ref="shortcut"
        >
          <shortcut-item :label="label" :index="index" :active="currentIndex === index"></shortcut-item>
        </li>
      </ul>
    </div>
    <transition name="fade">
      <div class="tip-wrapper" ref="tip" :style="tipStyle" v-if="isShowShortcutTip">
        <div class="shortcut-tip">
          <shortcut-tip :label="currentShortcut" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    labels: {
      type: Array,
      default: () => [],
    },
    initialIndex: {
      type: Number,
      default: 0,
    },
    shortcutDismissDelay: Number,
  },
  data() {
    return {
      currentIndex: this.initialIndex,
      tipStyle: {},
      isShowShortcutTip: false,
    };
  },
  inject: ['scrollIndex'],
  computed: {
    currentShortcut() {
      return this.labels[this.currentIndex];
    },
  },
  created() {
    this.pos = {};
  },
  components: {
    ShortcutItem: {
      props: {
        label: [String, Number],
        index: Number,
        active: Boolean,
      },
      functional: true,
      inject: ['scrollIndex'],
      render(h, ctx) {
        const { label, index, active } = ctx.props;
        const _scopeSlots = ctx.injections.scrollIndex ? ctx.injections.scrollIndex.$scopedSlots : {};
        return _scopeSlots.shortcut ? _scopeSlots.shortcut({ label, index, active }) : h('span', null, label);
      },
    },
    ShortcutTip: {
      props: {
        label: [String, Number],
      },
      functional: true,
      inject: ['scrollIndex'],
      render(h, ctx) {
        const _scopeSlots = ctx.injections.scrollIndex ? ctx.injections.scrollIndex.$scopedSlots : {};
        const { label } = ctx.props;
        return label !== void 0 && _scopeSlots.tip ? _scopeSlots.tip({ label }) : h('', null, ctx.props.label);
      },
    },
  },
  methods: {
    handleShortCutTouchStart(e, index) {
      this.isInTouch = true;
      const event = e.touches[0] || e;
      this.pos.y1 = event.pageY;
      this.pos.shortcutHeight = this.$refs.shortcut[0].offsetHeight;
      this.pos.currentIndex = this.currentIndex = index;
      this._scrollTo(index);
    },
    handleShortCutTouchMove(e) {
      const event = e.touches[0] || e;
      this.pos.y2 = event.pageY;
      const delta = Math.ceil((this.pos.y2 - this.pos.y1) / this.pos.shortcutHeight);
      let currentIndex = delta + this.pos.currentIndex;
      if (currentIndex < 0) {
        currentIndex = 0;
      } else if (currentIndex > this.labels.length - 1) {
        currentIndex = this.labels.length - 1;
      }
      this.currentIndex = currentIndex;
      this._scrollTo(currentIndex);
    },
    handleShortCutTouchEnd() {
      this.isInTouch = false;
    },
    _scrollTo(index) {
      this.scrollIndex && this.scrollIndex._scrollTo(index);
    },
  },
  watch: {
    initialIndex(index) {
      this.currentIndex = index;
    },
    currentIndex(index) {
      clearTimeout(this.shortcutTimer);
      this.isShowShortcutTip = this.isInTouch;
      if (this.isShowShortcutTip) {
        this.$nextTick(() => {
          const shortcuts = this.$refs.shortcut;
          const { left, top } = shortcuts[index].getBoundingClientRect();
          const tip = this.$refs.tip;
          if (tip) {
            const shortcut = this.$refs.shortcut[index];
            this.tipStyle = {
              left: left - tip.offsetWidth + 'px',
              top: top - (tip.offsetHeight - shortcut.offsetHeight) / 2 + 'px',
            };
          }
          this.shortcutTimer = setTimeout(() => {
            this.isShowShortcutTip = false;
          }, this.shortcutDismissDelay);
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.shortcut {
  position: absolute;
  color: #707070;
  right: 0;
  font-size: 0.2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
}
ul {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
li {
  padding: 0.03rem 0.2rem;
  text-align: center;
  /deep/ & > .shortcut-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 0.3rem;
    height: 0.3rem;
    border-radius: 50%;
    box-sizing: border-box;
    padding: 0.06rem;
  }
  /deep/ &.active {
    color: #1482f0;
    & > .shortcut-item {
      background-color: #1482f0;
      color: #ffffff;
    }
  }
}
.tip-wrapper {
  position: absolute;
  z-index: 20;
  width: 1.08rem;
}
.shortcut-tip {
  width: 0.9rem;
  height: 0.9rem;
  background-color: #c9c9c9;
  border-radius: 50%;
  font-weight: bold;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.48rem;
  &:after {
    content: '';
    border: 0.38rem solid;
    border-color: transparent transparent transparent #c9c9c9;
    position: absolute;
    left: 0.7rem;
    top: 50%;
    transform: translateY(-50%);
  }
}
.fade-leave-active {
  transition: all 0.3s;
}
.fade-leave-to {
  opacity: 0;
}
</style>
