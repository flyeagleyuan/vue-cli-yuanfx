<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <table-view
    key="1"
    ref="main"
    :data="data"
    :columns="columns"
    :height="450"
    :page-row-size="22"
    :drag-bottom-load="true"
    :remove-blank-col="true"
    :remove-blank-row="true"
    :sort-range="['asc', 'desc']"
    :highlight-row-condition="{ age: 18 }"
    :keep-highlight-row="true"
    blank-placeholder="-"
    @on-scroll-left="handleScrollLeft"
    @on-touch="handleTouch"
  >
    <template #_highlight>
      <table-view
        key="2"
        ref="highlight"
        class="highlight"
        :data="highlightData"
        :columns="highlightColumns"
        blank-placeholder="-"
        :show-header="false"
        :page-row-size="22"
        :drag-bottom-load="true"
        :remove-blank-col="true"
        :remove-blank-row="true"
        @on-scroll-left="handleHighlightScrollLeft"
        @on-touch="handleHighlightTouch"
        @on-expand="handleExpand"
      ></table-view>
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
  computed: {
    highlightData() {
      return this.data.slice(0, 3).map(d => {
        d._isShowExpand = true;
        return d;
      });
    },
    highlightColumns() {
      return [
        {
          title: '',
          type: 'expand',
          fixed: 'left',
          width: '1rem',
        },
        ...this.columns.slice(1),
      ];
    },
  },
  created() {
    const d = [];
    for (let i = 0; i < 200; i++) {
      d.push({
        name: '张三' + i,
        age: parseInt(Math.random() * 100, 10),
        birthday: '919526400000',
        address: '上海市浦东新区杨高南路' + i + '号',
        address1: '',
        address2: '上海市浦东新区杨高南路' + i + '号',
        _isShowExpand: false,
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
  methods: {
    handleTouch(el) {
      this.el = el;
      this.$refs.highlight.firstTouchElement = null;
    },
    handleHighlightTouch(el) {
      this.el = el;
      this.$refs.main.firstTouchElement = null;
    },
    handleScrollLeft(distance) {
      const els = [this.$refs.main.$refs.header, this.$refs.main.$refs.tbody, this.$refs.main.$refs.highlightHeader];
      if (els.indexOf(this.el) > -1) {
        this.$refs.highlight.$refs.tbody.scrollLeft = distance;
      }
    },
    handleHighlightScrollLeft(distance) {
      if (this.el === this.$refs.highlight.$refs.tbody) {
        const els = [this.$refs.main.$refs.header, this.$refs.main.$refs.tbody, this.$refs.main.$refs.highlightHeader];
        els.forEach(el => {
          if (el) {
            el.scrollLeft = distance;
          }
        });
      }
    },
    handleExpand(row, index) {
      console.log('expand', row, index);
    },
  },
};
</script>

<style lang="scss">
@import '~@/styles/commons';
</style>

<style lang="less" scoped>
.highlight {
  border-bottom: 1px solid #dfdfdf;
}
</style>
