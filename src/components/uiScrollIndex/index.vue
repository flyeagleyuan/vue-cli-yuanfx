<template>
  <div class="flex-auto flex-column">
    <div class="flex-auto flex-row scroll-index">
      <keep-alive>
        <navigation-list
          v-if="!isShowShortcut"
          :labels="labels"
          class="flex-none navigation"
          @on-select="handleSelect"
          :index="currentIndex"
        ></navigation-list>
      </keep-alive>
      <div class="flex-auto flex-column">
        <slot name="header"></slot>
        <scroll
          class="flex-auto flex-column pr"
          :data="data"
          :scroll-options="scrollOptions"
          @scroll="handleScroll"
          ref="scroll"
        >
          <div class="scroll-nav-container">
            <slot></slot>
          </div>
          <div
            class="title-fixed-wrapper group-title"
            ref="fixed"
            v-show="fixedTitle"
            :class="{ 'group-shortcut': isShowShortcut }"
            v-html="fixedTitle"
          ></div>
        </scroll>
        <slot name="footer"></slot>
      </div>
    </div>
    <scroll-shortcut
      v-if="isShowShortcut"
      :initial-index="currentIndex"
      :labels="labels"
      :shortcut-dismiss-delay="shortcutDismissDelay"
    ></scroll-shortcut>
  </div>
</template>

<script>
import NavigationList from './NavigationList';
import Scroll from '@/components/uiScroll';
import ScrollShortcut from './ScrollShortcut';
import { prefixStyle } from '@/utils/dom';

const transform = prefixStyle('transform');

export default {
  props: {
    activeIndex: {
      type: Number,
      default: 0,
    },
    data: {
      type: Array,
      default: () => [],
    },
    type: {
      validator(value) {
        return [0, 1].indexOf(value) > -1;
      },
      default: 0,
    },
    shortcutDismissDelay: {
      type: Number,
      default: 1500,
    },
  },
  data() {
    return {
      scrollY: -1,
      diff: -1,
      panes: [],
      currentIndex: this.activeIndex,
      isShowShortcutTip: false,
      tipStyle: {},
    };
  },
  components: { NavigationList, Scroll, ScrollShortcut },
  provide() {
    return { scrollIndex: this };
  },
  computed: {
    labels() {
      return this.panes.map(pane => pane.label);
    },
    isShowShortcut() {
      return this.type === 1;
    },
    fixedTitle() {
      if (this.scrollY >= 0) {
        return '';
      }
      if (this.heightList) {
        const scroll = this.$refs.scroll;
        const y = -scroll.y;
        if (-this.scrollY === y || this.scrollY < scroll.maxScrollY) {
          for (let i = 0; i < this.heightList.length; i++) {
            if (this.heightList[i] <= y && this.heightList[i + 1] > y) {
              return this.panes[i] && this.panes[i].title;
            }
          }
        }
      }
      return this.panes[this.currentIndex] && this.panes[this.currentIndex].title;
    },
    currentShortcut() {
      return this.labels[this.currentIndex];
    },
    titleHeightList() {
      return this.panes.map(pane => pane.titleHeight);
    },
    paneGroups() {
      return this.panes.map(pane => pane.group);
    },
  },
  created() {
    this.scrollOptions = { probeType: 3 };
  },
  mounted() {
    this.$nextTick(() => {
      this._getHeightList();
    });
  },
  methods: {
    handleSelect(index) {
      this._scrollTo(index);
    },
    handleScroll({ y }) {
      this.scrollY = y;
    },
    _scrollTo(index) {
      this.$emit('on-select', index);
      this.scrollY = -this.heightList[index];
      this.$refs.scroll.scrollToElement(this.paneGroups[index]);
    },
    _getHeightList() {
      let height = 0;
      this.heightList = this.panes
        .map(pane => pane.$el)
        .reduce(
          (results, el) => {
            height += el.offsetHeight;
            return [...results, height];
          },
          [height]
        );
    },
    addPane(pane) {
      this.panes.push(pane);
    },
    removePane(pane) {
      const index = this.panes.indexOf(pane);
      index > -1 && this.panes.splice(index, 1);
    },
  },
  watch: {
    data() {
      this.panes.forEach(pane => pane.resize());
      this.$nextTick(() => {
        this._getHeightList();
      });
    },
    type() {
      this.panes.forEach(pane => pane.resize());
      this.$nextTick(() => {
        this._getHeightList();
      });
    },
    scrollY(y) {
      const heightList = this.heightList;
      if (y > 0) {
        this.currentIndex = 0;
        return;
      }
      for (let i = 0; i < heightList.length - 1; i++) {
        const height1 = heightList[i];
        const height2 = heightList[i + 1];
        if (-y >= height1 && -y < height2) {
          this.currentIndex = i;
          this.diff = height2 + y;
          return;
        }
      }

      this.currentIndex = heightList.length - 2;
    },
    diff(newVal) {
      const titleHeight = this.titleHeightList[this.currentIndex];
      let fixedTop = newVal > 0 && newVal < titleHeight ? newVal - titleHeight : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style[transform] = `translate3d(0,${fixedTop}px,0)`;
    },
    isShowShortcut() {
      this.$nextTick(() => {
        this.titleHeightList = this._getTitleHeightList();
        this._getHeightList();
        this.$refs.scroll.refresh();
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import './style';
</style>
