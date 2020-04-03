<template>
  <div class="item-container">
    <div class="head">
      <div class="left">
        <h3>
          <a href @click.prevent="gotoF9(item.entityCode, item.entityName)" v-html="item.entityNameChange"></a>
        </h3>

        <p>
          {{ item.enterpriseNature | getCName }}{{ item.swIndustryTopLevel ? item.swIndustryTopLevel + '/' : ''
          }}{{ item.area | getAreaName }}
        </p>
      </div>

      <div class="right">
        <span v-if="item.isContinuousChanged">一年内连续调低</span>
        <span class="red" v-if="item.thisRaitingWatch">列入评级观察</span>
      </div>
    </div>

    <div class="content-body">
      <div class="row">
        <dl>
          <dt>评级日期</dt>
          <dd>{{ item.rantingDate | format('/') }}</dd>
        </dl>
        <dl>
          <dt>本次评级</dt>
          <dd>
            {{ item.thisRaiting }}
            <template v-if="item.lastRaiting && !isOverSea">
              <span v-if="changeLevel !== 0" :class="{ red: changeLevel > 0, green: changeLevel < 0 }">
                {{ Math.abs(changeLevel) }}个等级
              </span>
            </template>
          </dd>
        </dl>
      </div>

      <div class="row">
        <dl>
          <dt>评级展望</dt>
          <dd>{{ item.raitingOutlook | getRate }}</dd>
        </dl>
        <dl>
          <dt>上次评级</dt>
          <dd>
            {{ item.lastRaiting || '-' }}
            <!--<template v-if="item.lastRaiting && !isOverSea">-->
            <!--<span style="visibility: hidden" v-if="changeLevel !== 0"> {{ Math.abs(changeLevel) }}个等级 </span>-->
            <!--</template>-->
          </dd>
        </dl>
      </div>

      <div class="row">
        <dl>
          <dt>评级公司</dt>
          <dd>
            <a v-html="item.ragingOrgSimpleName" @click.prevent="gotoF9(item.raitingOrgCode, item.raitingOrgName)"></a>
          </dd>
        </dl>
        <dl>
          <dt>披露日期</dt>
          <dd>
            {{ item.declaredate ? item.declaredate.split(' ')[0] : '-' }}
            <!--<a-->
            <!--v-if="item.pdfPath"-->
            <!--class="icon"-->
            <!--:class="[getIconClass]"-->
            <!--target="_blank"-->
            <!--:href="-->
            <!--'http://pdf.gw.com.cn/pdf/pdfPath/MRGG/' +-->
            <!--item.pdfPath.replace(/\\/g, '/') +-->
            <!--(item.pdfPath.indexOf('?') === -1 ? '?' : '&') +-->
            <!--'Enclosure2018=true'-->
            <!--"-->
            <!--&gt;</a>-->
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
import { areaObj, enterpriseNature } from './relation';

let relativeObj = {};

export default {
  name: 'item',
  props: ['obj', 'keywords'],
  filters: {
    getAreaName(code) {
      return areaObj[code] || '';
    },
    getCName(code) {
      return enterpriseNature[code] ? enterpriseNature[code] + '/' : '';
    },
    format(v, s = '-') {
      if (isNaN(v)) return v;
      return v
        .toString()
        .substr(0, 8)
        .replace(/(\d{4})(\d{2})(\d{2})/, '$1' + s + '$2' + s + '$3');
    },
    getRate(v) {
      if (!v || isNaN(v)) v = 0;
      return ['-', '正面', '稳定', '负面'][parseInt(v)];
    },
  },
  data() {
    return {
      // item: this.obj.item,
    };
  },
  computed: {
    item() {
      let item = $.extend(true, {}, this.obj.item);

      if (this.keywords) {
        let reg = new RegExp(this.replaceSepcialTxt(this.keywords).replace(/\s/g, '|'), 'g');

        ['entityName', 'raitingOrgName', 'ragingOrgSimpleName'].forEach(k => {
          if (typeof item[k] === 'string') item[k] = item[k].replace(reg, '<i class="keywords">$&</i>');
        });
      }
      return item;
    },
    changeLevel() {
      return this.item.lastRaitingRanking - this.item.thisRaitingRanking;
    },
    getIconClass() {
      if (!this.item.pdfPath) return '';
      let arr = this.item.pdfPath.split('.'),
        ext = arr[arr.length - 1].toLowerCase();

      let c = ext;
      if (ext === 'jpg' || ext === 'jpeg' || ext === 'tiff' || ext === 'gif' || ext === 'bmp') {
        c = 'pic';
      } else if (ext === 'zip' || ext === '7z') {
        c = 'rar';
      } else if (ext === 'docx') {
        c = 'doc';
      } else if (ext === 'xlsx') {
        c = 'xls';
      } else if (ext === 'pptx') {
        c = 'ppt';
      } else if (ext === 'html') {
        c = 'htm';
      }
      return c;
    },
  },
  methods: {
    gotoF9(code, itName) {
      if (relativeObj[code]) {
        location = `fcnews://item?id=${relativeObj[code]}&type=company&name=${itName}`;
      } else {
        this.$get('/finchinaAPP/getDictData.action', {
          code,
          func: 'ITCODE8TO10',
        }).then(res => {
          const { data } = res;
          relativeObj[code] = data[0];
          location = `fcnews://item?id=${relativeObj[code]}&type=company&name=${itName}`;
        });
      }
    },
    replaceSepcialTxt(txt) {
      let specialArr = '$()*+.[]?^{}|'.split(''),
        results = [];
      txt.split('').forEach(s => {
        results.push(specialArr.indexOf(s) === -1 ? s : '\\' + s);
      });

      return results.join('');
    },
  },
};
</script>

<style lang="less">
.android {
  .item-container .head div.right span {
    padding-top: 0.1rem;
  }
}
.item-container {
  padding: 0.2rem 0.32rem 0.12rem;
  line-height: 1;

  .keywords {
    color: #fc2626 !important;
    font-style: normal;
  }

  .head {
    display: flex;
    margin: 0 0 0.2rem;

    .left {
      flex: auto;
      h3 {
        font-size: 0.32rem;
        font-family: 'PingFangSC-Medium', 'PingFang SC Medium', 'microsoft yahei', '宋体', tahoma, arial, simsun,
          sans-serif;
        line-height: 0.4rem;
        margin: 0 0 0.12rem;
        a {
          color: #111;
        }
      }

      p {
        font-family: 'PingFangSC-Light', 'PingFang SC Light', 'microsoft yahei', '宋体', tahoma, arial, simsun,
          sans-serif;
        color: #5c5c5c;
        margin: 0 0 0.12rem;
      }
    }

    div.right {
      flex: none;
      font-family: 'PingFangSC-Light', 'PingFang SC Light', 'microsoft yahei', '宋体', tahoma, arial, simsun, sans-serif;
      color: #78bc6f;
      white-space: nowrap;
      text-align: right;
      padding-top: 0.04rem;
      font-size: 0.2rem;

      span {
        padding: 0.06rem 0.08rem;
        margin: 0 0 0.1rem;
        display: block;
        position: relative;

        &.red {
          display: inline-block;
          color: #fb7171;
          margin: 0;

          &:after {
            border-color: rgba(251, 113, 113, 0.2);
          }
        }

        &:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 200%;
          height: 200%;
          box-sizing: border-box;
          border: 1px solid #c1dfad;
          transform: scale(0.5);
          transform-origin: left top;
        }
      }
    }
  }

  .content-body {
    .row {
      margin: 0 0 0.2rem;
      overflow: hidden;

      &:last-of-type {
        margin-bottom: 0;
      }

      dl {
        float: left;
        width: 50%;
        box-sizing: border-box;
        padding: 0 0 0 4.4%;
        display: flex;
        line-height: 0.32rem;

        &:first-of-type {
          padding: 0 4.4% 0 0;
        }

        dt {
          font-family: 'PingFangSC-Light', 'PingFang SC Light', 'microsoft yahei', '宋体', tahoma, arial, simsun,
            sans-serif;
          color: #8c8c8c;
          width: 33%;
          flex: none;
          white-space: nowrap;
        }

        dd {
          text-align: right;
          flex: auto;
          color: #111;
          font-size: 0.26rem;

          span {
            font-size: 0.24rem;
            padding: 0 0 0 0.16rem;
            position: relative;
            white-space: nowrap;
            &:before {
              content: '';
              position: absolute;
              top: 50%;
              left: 0.02rem;
              width: 0.11rem;
              height: 0.24rem;
              transform: translateY(-50%);
            }

            &.green {
              color: #0cbe45;

              &:before {
                background: url(../../assets/images/arrow_down.png) no-repeat;
                background-size: contain;
              }
            }

            &.red {
              color: #fe3a2f;

              &:before {
                background: url(../../assets/images/arrow_up.png) no-repeat;
                background-size: contain;
              }
            }
          }
        }
      }
    }
  }
}

.icon {
  width: 0.32rem;
  height: 0.32rem;
  display: inline-block;
  vertical-align: top;
  background-size: contain;
  position: relative;
  top: -0.04rem;
}
</style>
