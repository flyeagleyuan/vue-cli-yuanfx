<template>
  <table-view
    :data="data"
    :columns="columns"
    :height="450"
    :page-col-size="3"
    :page-row-size="22"
    :drag-bottom-load="true"
    :drag-right-load="true"
    :remove-blank-col="true"
    :remove-blank-row="true"
    :sort-range="['asc', 'desc']"
    :highlight-row-condition="{ age: 18 }"
    :keep-highlight-row="true"
    blank-placeholder="-"
    @on-scroll-vertical="handleScrollVertical"
    @on-scroll-left="handleScrollLeft"
    @on-sort="handleSort"
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
        address: '上海市浦东新区<strong>杨高南路' + i + '</strong>号',
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
          width: '80px',
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
  methods: {
    handleScrollVertical(scrollTop) {
      console.log(`向上滚动了${scrollTop}`);
    },
    handleSort({ key, order, column }) {
      console.log(`点击了排序，排序的键为${key}，排序的方式为${order}，排序的列为${JSON.stringify(column)}`);
    },
    handleScrollLeft(distance, rightDistance) {
      console.log(`向左拖动距离${distance},距离右侧距离${rightDistance}`);
    },
  },
};
</script>

<style lang="scss">
@import '~@/styles/commons';
</style>
