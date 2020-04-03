<template>
  <div id="app">
    <menu-head :menus="menu" @menuChange="menuChange" ref="menu"></menu-head>

    <content-body url="/finchinaAPP/getMainRating.action" :opts="condition" @bodyScroll="scrollTopChange">
      <template v-slot:header>
        <div class="ctrl-area">
          <ul>
            <li v-for="s in fastMenu" :key="s">
              <a :class="{ selected: s.selected }" @click.stop="clickMenu(s)">{{ s.name }}</a>
            </li>
          </ul>
        </div>
      </template>

      <template v-slot:default="obj">
        <item :obj="obj" :keywords="keywords" :isOverSea="isOverSea"></item>
      </template>
    </content-body>
  </div>
</template>

<script>
import { resize } from '@/utils/dom';
import menuHead from '../../components/uiMenuHead/menuHead';
import contentBody from '../../components/uiScrollBody/index';
import menu from './menus';
import item from './item';

let user = (location.href.match(/\buser=([^&]*)/) || ['', ''])[1],
  token = (location.href.match(/\btoken=([^&]*)/) || ['', ''])[1];

let fastMenu = ['评级调低', '评级展望负面', '列入评级观察'].map(s => {
  return { name: s, selected: false };
});

export default {
  data() {
    return {
      menu: $.extend(true, [], menu),
      condition: { user, token },
      fastMenu: $.extend(true, [], fastMenu),
      keywords: '',
    };
  },
  components: {
    menuHead,
    contentBody,
    item,
  },
  mounted() {
    resize();
    window.search = this.search;

    this.$nextTick(() => {
      if (!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) $('#app').addClass('android');
    });
  },
  methods: {
    scrollTopChange(scrollTop) {
      $('#app')[scrollTop > 0 ? 'addClass' : 'removeClass']('scroll');
    },
    clickMenu(obj) {
      obj.selected = !obj.selected;

      this.menu[0].list.forEach(o => {
        o.list.forEach(item => {
          item.selected = item.name === obj.name ? obj.selected : false;
        });
      });

      this.menuChange($.extend(true, [], this.menu), 0);
    },
    search(txt) {
      this.condition = { user, token, keyword: txt };
      this.menu = $.extend(true, [], menu);
      this.fastMenu = $.extend(true, [], fastMenu);
      this.keywords = txt;
      this.$refs.menu.closeCover();
    },
    menuChange(menus, idx) {
      this.menu = menus;

      let condition = {};

      menus[idx].list.forEach(obj => {
        let keys = typeof obj.key === 'string' ? [obj.key] : obj.key;
        let sCondition = {};
        keys.forEach(key => (sCondition[key] = []));

        obj.list.forEach(o => {
          if (o.selected) sCondition[o.key || obj.key].push(o.value);
        });

        keys.forEach(key => (condition[key] = sCondition[key].join()));
      });

      if (!idx) {
        let selectObj;
        menus[0].list.forEach(obj => {
          obj.list.forEach(o => {
            if (o.selected) selectObj = o;
          });
        });
        //顶部菜单与同步快捷菜单    变动方向 单选
        this.fastMenu.forEach(o => {
          o.selected = selectObj && selectObj.name === o.name ? selectObj.selected : false;
        });
      }

      let newCondition = $.extend(true, {}, this.condition, condition);

      Object.keys(newCondition).forEach(k => {
        if (newCondition[k] === '') delete newCondition[k];
      });

      if (JSON.stringify(this.condition) !== JSON.stringify(newCondition)) this.condition = newCondition;
    },
  },
  computed: {
    isOverSea() {
      return ['80058815', '80065841', '80065840'].indexOf(this.condition.raitingOrgCode) !== -1;
    },
  },
};
</script>

<style lang="scss">
@import '../../styles/commons';
/*@import '../../styles/icon';*/
a {
  text-decoration: none;
}

ul,
li,
dl,
dt,
dd {
  padding: 0;
  margin: 0;
  list-style: none;
}

.indicator {
  .indicator-mask {
    background: transparent !important;
  }
}
#app {
  height: 100%;
  padding-top: 0.64rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .ctrl-area {
    position: relative;
    background: #fff;
    width: 100%;
    overflow: hidden;

    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      height: 1px;
      background: #efefef;
      width: 100%;
      transform: scaleY(0.5);
    }

    ul {
      padding: 0.16rem 0.32rem;
      li {
        display: inline-block;
        margin: 0 0.12rem 0 0;

        a {
          color: #8c8c8c;
          font-size: 0.24rem;
          line-height: 1;
          padding: 0.16rem;
          display: block;
          text-decoration: none;
          background: #f6f6f6;
          border-radius: 0.28rem;

          &.selected {
            background: #fe9247;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
