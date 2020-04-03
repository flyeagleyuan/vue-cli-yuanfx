<template>
  <table-view
    :data="data"
    :columns="columns"
    :height="450"
    :sort-range="['asc', 'desc']"
    :highlight-row-condition="highlightCondition"
    :keep-highlight-row="keepHighlightRow"
    blank-placeholder="-"
  >
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
      // 查找高亮行的条件
      highlightCondition: { age: 18 },
      // 是否一直显示高亮行，无论根据highlightCondition找到对应数据与否
      keepHighlightRow: true,
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
        address: '上海市浦东新区杨高南路' + i + '号',
        address1: '',
        address2: '上海市浦东新区杨高南路' + i + '号',
      });
    }
    this.$loading.open();
    setTimeout(() => {
      this.columns = [
        {
          title: '序号',
          type: 'index',
          fixed: 'left',
          width: '1rem',
        },
        {
          title: '姓名',
          key: 'name',
          fixed: 'left',
          width: '1.5rem',
          className: 'name',
          sortable: true,
          autoSort: 'desc',
          sortMethod(a, b) {
            return a.localeCompare(b);
          },
          type: 'slot',
          slot: 'name',
        },
        {
          title: '年龄',
          key: 'age',
          sortable: true,
        },
        {
          title: '出生日期',
          key: 'birthday',
          render(h, { row }) {
            const date = new Date(parseInt(row['birthday']));
            return h('span', null, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
          },
        },
        {
          title: '地址',
          key: 'address',
          width: '2rem',
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
