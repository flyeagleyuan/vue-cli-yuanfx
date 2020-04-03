import BScroll from '@better-scroll/core';

export default {
  props: {
    data: Array,
    delayRefresh: {
      type: Number,
      default: 0,
    },
    scrollOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      scroll: null,
    };
  },
  computed: {
    y() {
      return this.scroll && this.scroll.y;
    },
  },
  deactivated() {
    this.scroll && this.scroll.stop();
  },
  mounted() {
    this.scroll = new BScroll(
      this.$refs.scroll,
      Object.assign(
        {},
        {
          click: true,
        },
        this.scrollOptions
      )
    );
    this.scroll.on('scroll', pos => {
      this.$emit('scroll', pos);
    });
    this.$nextTick(() => {
      this.scroll.refresh();
    });
  },
  render(r) {
    return r(
      'div',
      {
        class: 'scroll-wrapper',
        ref: 'scroll',
      },
      this.$slots.default
    );
  },
  methods: {
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          setTimeout(() => {
            this.scroll.refresh();
          }, this.delayRefresh);
        });
      },
    },
  },
};
