<template>
  <div class="pane">
    <div class="group-title" ref="title">
      <slot name="title" :label="label">
        <span>{{ label }}</span>
      </slot>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      titleHeight: 0,
      group: null,
      title: null,
    };
  },
  inject: ['scrollIndex'],
  mounted() {
    this.scrollIndex.addPane(this);
    this.resize();
  },
  methods: {
    resize() {
      this.$nextTick(() => {
        const t = this.$refs.title;
        this.group = t;
        this.title = t.innerHTML;
        this.titleHeight = t.offsetHeight;
      });
    },
  },
  beforeDestroy() {
    this.scrollIndex.removePane(this);
  },
};
</script>
