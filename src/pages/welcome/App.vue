<template>
  <div class="flex-row flex-auto">{{ msg }} {{ showName }}</div>
</template>

<script>
import { resize } from '@/utils/dom';
import { getUrlSearches } from '@/utils/urls';

const { name } = getUrlSearches();

export default {
  data() {
    return {
      msg: 'Welcome',
      showName: decodeURIComponent(name),
    };
  },
  mounted() {
    resize();
  },
};
</script>

<style lang="scss">
@import '~@/styles/commons';
</style>

<style lang="less" scoped>
div {
  justify-content: center;
  align-items: center;
  font-size: 0.48rem;
}
</style>
