<template>
  <div>
    <h2>单独checkbox</h2>
    <div class="wrapper">
      <ui-checkbox v-model="checkbox1" true-value="trueValue" false-value="falseValue" type="circle">选项1</ui-checkbox>
      <p>选中结果： {{ checkbox1 }}</p>
    </div>
    <h2>checkbox组合</h2>
    <div class="wrapper">
      <ui-checkbox-group v-model="checkbox2" type="circle">
        <ui-checkbox label="first">选项1</ui-checkbox>
        <ui-checkbox label="second">选项2</ui-checkbox>
        <ui-checkbox label="third" disabled>选项3被禁用</ui-checkbox>
        <ui-checkbox label="forth">选项4</ui-checkbox>
      </ui-checkbox-group>
      <p>选中结果： {{ checkbox2 }}</p>
    </div>
    <div class="wrapper">
      <ui-checkbox-group v-model="checkbox3">
        <ui-checkbox label="first">选项1</ui-checkbox>
        <ui-checkbox label="second">选项2</ui-checkbox>
        <ui-checkbox label="third" disabled>选项3被禁用</ui-checkbox>
        <ui-checkbox label="forth">选项4</ui-checkbox>
      </ui-checkbox-group>
      <p>选中结果： {{ checkbox3 }}</p>
    </div>
  </div>
</template>

<script>
import { resize } from '@/utils/dom';
import uiCheckbox from '@/components/uiCheckbox';
import uiCheckboxGroup from '@/components/uiCheckboxGroup';

export default {
  data() {
    return {
      msg: 'Welcome',
      checkbox1: 'trueValue',
      checkbox2: ['second'],
      checkbox3: ['first'],
    };
  },
  components: { uiCheckbox, uiCheckboxGroup },
  mounted() {
    resize();
  },
};
</script>

<style lang="scss">
@import '~@/styles/commons';
</style>

<style lang="less" scoped>
.wrapper {
  font-size: 0.26rem;
}
</style>
