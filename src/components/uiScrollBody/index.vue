<template>
  <div class="scroll-body-content">
    <slot name="header"></slot>
    <ul>
      <li v-for="(item, idx) in list" :key="idx">
        <slot :item="item"></slot>
      </li>
    </ul>
    <slot name="footer"></slot>
    <bottom-status v-if="!errType && (!isFirstLoad && list.length > 3)" :status="hasNextPage"></bottom-status>
    <no-data v-if="!isFirstLoad && !list.length" :type="errType"></no-data>
  </div>
</template>

<script>
import noData from '../uiNoData/index';
import bottomStatus from '../uiBottomStatus/index';
import { throttle } from 'lodash';
import { appCollapse } from '../../utils/appAssist';

export default {
  props: {
    url: {
      type: String,
      required: true,
    },
    opts: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      loading: false,
      list: [],
      hasNextPage: true,
      isFirstLoad: true,
      errType: 0,
    };
  },
  watch: {
    opts: {
      deep: true,
      handler() {
        this.isFirstLoad = true;
        this.getData();
      },
    },
  },
  components: { noData, bottomStatus },
  created() {
    this.getData();
  },
  mounted() {
    this.$nextTick(() => {
      $(window).on(
        'scroll',
        throttle(() => {
          let scrollTop = document.documentElement.scrollTop || window.pageYOffset,
            wHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
            conHeight = document.querySelector('.scroll-body-content').scrollHeight;

          if (document.body.style.position !== 'fixed') appCollapse(scrollTop > 0);

          this.$emit('bodyScroll', scrollTop);

          if (!this.loading && this.hasNextPage && conHeight < wHeight + scrollTop + 40) this.getData();
        }),
        50
      );
    });
  },
  methods: {
    getData() {
      this.loading = true;

      if (this.isFirstLoad) {
        this.$loading.open();
        $('html').scrollTop(0);
        this.list = [];
      }

      this.errType = 0;

      this.$nextPage(this.url, this.opts)
        .then(res => {
          if (res.returncode === 0) {
            this.hasNextPage = !(!res.data.length || res.data.length % 15 !== 0);
            this.list.push(...res.data);
          } else {
            console.error(JSON.parse(JSON.stringify(res)));
          }

          if (this.isFirstLoad) this.$loading.close();

          this.isFirstLoad = false;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.hasNextPage = false;
          this.isFirstLoad = false;
          let code = err['returncode'];
          if (code === 202 || code === 500) this.errType = 1;
          this.$loading.close();
        });
    },
  },
};
</script>

<style lang="less">
:root {
  -webkit-overflow-scrolling: touch;
}
.scroll-body-content {
  ul,
  li {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  > ul {
    > li {
      position: relative;
      /*padding: 0 0.24rem;*/
      border-bottom: 0.16rem solid #f6f6f6;
      overflow: hidden;

      &:last-of-type {
        border-bottom: none;
      }
    }
  }
}
</style>
