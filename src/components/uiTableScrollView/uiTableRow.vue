<template>
  <tr :class="[row.className]">
    <slot></slot>
  </tr>
</template>

<script>
export default {
  name: 'row',
  props: {
    row: Object,
  },
};
</script>
