<template>
  <table-view :data="data" :columns="columns" :height="450" blank-placeholder="-">
    <template #name="{ row, column }">
      <span>{{ row[column.key] }}</span>
    </template>
  </table-view>
</template>

<script>
import { resize } from '@/utils/dom';
import TableView from '@/components/uiTableScrollView';

export default {
  data() {
    return {
      columns: [],
      data: [],
      height: window.innerHeight,
    };
  },
  components: { TableView },
  created() {
    const d = [];
    for (let i = 0; i < 80; i++) {
      d.push({
        name: '张三' + i,
        age: parseInt(Math.random() * 60, 10),
        birthday: '919526400000',
        address: '上海市浦东新区杨高南路<strong>' + i + '</strong>号',
        address1: '',
        address2: '上海市浦东新区杨高南路' + i + '号',
      });
    }
    this.$loading.open();
    setTimeout(() => {
      this.columns = [
        // index使用
        {
          title: '序号',
          type: 'index',
          width: '1rem',
          indexMethod(row, index) {
            return index ** 2;
          },
        },
        // slot使用
        {
          title: '姓名',
          key: 'name',
          width: '1.5rem',
          className: 'name',
          type: 'slot',
          slot: 'name',
        },
        {
          title: '年龄',
          key: 'age',
        },
        // render函数使用
        {
          title: '出生日期',
          key: 'birthday',
          render(h, { row }) {
            const date = new Date(parseInt(row['birthday']));
            return h('span', null, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
          },
        },
        // html使用
        {
          title: '地址',
          key: 'address',
          width: '2rem',
          type: 'html',
        },
        {
          title: 'aaaa',
          key: 'address1',
          width: '3rem',
        },
        {
          title: 'bbbb',
          key: 'address2',
          width: '3rem',
        },
      ];
      this.data = d;
      this.$loading.close();
    }, 500);
  },
  mounted() {
    resize();
  },
};
</script>

<style lang="scss">
@import '~@/styles/commons';
</style>
