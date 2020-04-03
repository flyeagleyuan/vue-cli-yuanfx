<template>
  <div
    class="circle-wrapper"
    :class="{ 'on-drag': isOnDrag }"
    @touchstart="onTouchStart"
    @touchmove.prevent="onTouchMove"
    @touchend="onTouchEnd"
    @click="handleClick"
    ref="circle"
    :style="circleStyle"
  >
    <img src="ico_expand_button.png" alt="" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      circleStyle: {},
      isOnDrag: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.position = {
        distance: window.innerWidth - this.$refs.circle.offsetLeft - this.$refs.circle.clientWidth,
      };
      this.timer = setTimeout(() => {
        this.circleStyle = Object.assign({}, this.circleStyle, {
          opacity: 0.5,
          transition: '500ms all ease-out',
        });
      }, 5000);
    });
  },
  methods: {
    onTouchStart(e) {
      const events = e.touches[0] || e;
      this.circleStyle = Object.assign({}, this.circleStyle || {}, { x: events.pageX, y: events.pageY });
    },
    onTouchMove(e) {
      clearTimeout(this.timer);
      const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      const events = e.touches[0] || e;
      const circleEl = this.$refs.circle;
      this.isOnDrag = true;
      const width = circleEl.clientWidth,
        height = circleEl.clientHeight;
      let offsetX = events.pageX - width / 2,
        offsetY = events.pageY - height / 2 - scrollTop;
      if (offsetY + height > window.innerHeight) {
        offsetY = window.innerHeight - height;
      } else if (offsetY < 0) {
        offsetY = 0;
      }
      if (offsetX < this.position.distance) {
        offsetX = this.position.distance;
      } else if (offsetX + width + this.position.distance > window.innerWidth) {
        offsetX = window.innerWidth - width - this.position.distance;
      }
      this.position = Object.assign(this.position, {
        x: offsetX,
        y: offsetY,
      });
      this.circleStyle = {
        left: offsetX + 'px',
        top: offsetY + 'px',
      };
    },
    onTouchEnd() {
      const circleEl = this.$refs.circle;
      setTimeout(() => {
        this.isOnDrag = false;
      }, 200);
      const { x, y } = this.position;
      if (typeof x !== 'undefined' && typeof y !== 'undefined') {
        const leftPos =
          x > (window.innerWidth - circleEl.clientWidth / 2) / 2
            ? window.innerWidth - circleEl.clientWidth - this.position.distance
            : this.position.distance;
        this.circleStyle = {
          transition: '200ms all ease',
          top: y + 'px',
          left: leftPos + 'px',
        };
      }
      this.timer = setTimeout(() => {
        this.circleStyle = Object.assign({}, this.circleStyle, {
          opacity: 0.5,
          transition: '500ms all ease-out',
        });
      }, 3000);
    },
    handleClick() {
      clearTimeout(this.timer);
      if (this.position) {
        const { x, y } = this.position;
        if (typeof x !== 'undefined' && typeof y !== 'undefined') {
          this.circleStyle = { top: y, left: x };
          this.timer = setTimeout(() => {
            this.circleStyle = {
              top: y,
              left: x,
              opacity: 0.5,
              transition: '500ms all ease-out',
            };
          }, 3000);
        } else {
          this.circleStyle = {};
          this.timer = setTimeout(() => {
            this.circleStyle = {
              opacity: 0.5,
              transition: '500ms all ease-out',
            };
          }, 3000);
        }
      }
      this.$emit('on-click');
    },
  },
};
</script>

<style lang="less" scoped>
.circle-wrapper {
  position: fixed;
  width: 0.98rem;
  height: 0.98rem;
  border-radius: 50%;
  bottom: 3rem;
  right: 0.32rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  img {
    width: 100%;
    height: auto;
    pointer-events: none;
  }

  &.on-drag {
    will-change: left, top;
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
}
</style>
