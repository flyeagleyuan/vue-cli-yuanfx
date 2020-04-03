<template>
  <div class="wrapper flex-auto overflowY-hidden">
    <scroll :data="labels" ref="scroll">
      <ul>
        <li
          v-for="(label, index) in labels"
          :key="index"
          @click="handleItemClick(index)"
          :class="{ active: currentIndex === index }"
          ref="item"
        >
          <span>{{ label }}</span>
        </li>
      </ul>
    </scroll>
  </div>
</template>

<script>
import Scroll from '@/components/uiScroll';

export default {
  props: {
    labels: {
      type: Array,
      default: () => [],
    },
    index: {
      type: Number,
      default: 0,
    },
    animationTime: {
      type: Number,
      default: 500,
    },
  },
  data() {
    return {
      currentIndex: 0,
    };
  },
  components: {
    Scroll,
  },
  mounted() {
    this.$nextTick(() => {
      this._getHeightList();
      this.items = this.$refs.item;
      this.wrapper = this.$refs.scroll.$el;
    });
  },
  methods: {
    handleItemClick(index) {
      this.currentIndex = index;
      this.$emit('on-select', index);
    },
    _getHeightList() {
      const els = this.$refs.item;
      this.heightList = [];
      if (els) {
        let height = 0;
        this.heightList.push(height);
        for (let el of [...els]) {
          height += el.offsetHeight;
          this.heightList.push(height);
        }
      }
    },
  },
  watch: {
    labels() {
      this.$nextTick(() => {
        this._getHeightList();
        this.items = this.$refs.item;
        this.wrapper = this.$refs.scroll.$el;
      });
    },
    index(v) {
      this.currentIndex = v;
      const wrapperHeight = this.wrapper.offsetHeight;
      let y = this.$refs.scroll.y;
      if (this.heightList[v + 1] + y > wrapperHeight && v !== this.labels.length - 1) {
        const minHeight = this.heightList[v] - wrapperHeight;
        const half = (minHeight + this.heightList[v]) / 2;
        for (let [index, height] of this.heightList.entries()) {
          if (half < height) {
            return this.$refs.scroll.scrollToElement(this.items[index], this.animationTime);
          }
        }
      } else if (this.heightList[v] + y <= 0 && v > 0) {
        return this.$refs.scroll.scrollToElement(this.items[v - 1], this.animationTime);
      }

      if (v === this.labels.length - 1) {
        this.$refs.scroll.scrollToElement(this.items[v], this.animationTime);
      }
    },
  },
};
</script>
