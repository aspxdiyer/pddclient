//import crypto from 'crypto';
let crypto = require("crypto")

function hash(method, s, format) {
  const sum = crypto.createHash(method);
  const isBuffer = Buffer.isBuffer(s);
  sum.update(s, isBuffer ? 'binary' : 'utf8');
  return sum.digest(format || 'hex');
}

function md5(s, format) {
  return hash('md5', s, format);
}

function YYYYMMDDHHmmss(dd, options) {
  let d = dd || new Date();
  if (!(d instanceof Date)) {
    d = new Date(d);
  }

  let dateSep = '-';
  let timeSep = ':';
  if (options) {
    if (options.dateSep) {
      dateSep = options.dateSep;
    }
    if (options.timeSep) {
      timeSep = options.timeSep;
    }
  }
  let date = d.getDate();
  if (date < 10) {
    date = `0${date}`;
  }
  let month = d.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let hours = d.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let mintues = d.getMinutes();
  if (mintues < 10) {
    mintues = `0${mintues}`;
  }
  let seconds = d.getSeconds();
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${d.getFullYear()}${dateSep}${month}${dateSep}${date} ${hours}${timeSep}${mintues}${timeSep}${seconds}`;
}

function checkRequired(params, keys) {
  return new Promise((resolve, reject) => {
    let thisKeys = keys;
    if (!Array.isArray(thisKeys)) {
      thisKeys = [thisKeys];
    }
    for (let i = 0; i < thisKeys.length; i++) {
      const k = thisKeys[i];
      if (!{}.hasOwnProperty.call(params, k)) {
        const err = new Error(`${k} required`);
        err.name = 'ParameterMissingError';
        reject(err);
      }
    }
    resolve();
  });
}

function getApiResponseName(apiName) {
  const reg = /\./g;
  let thisApiName = apiName;
  switch (thisApiName) {
    case "pdd.ddk.top.goods.list.query"://多多客获取爆款排行商品接口
      thisApiName = "top_goods_list_get_response";
      break;
    case "pdd.ddk.theme.goods.search"://多多进宝主题商品查询
      thisApiName = "theme_list_get_response";
      break;
    case "pdd.ddk.goods.pid.query"://查询已经生成的推广位信息
      thisApiName = "p_id_query_response";
      break;
    case "pdd.ddk.weapp.qrcode.url.gen"://多多客生成单品推广小程序二维码url
      thisApiName = "weapp_qrcode_generate_response";
      break;
    case "pdd.ddk.goods.basic.info.get"://获取商品基本信息
      thisApiName = "goods_basic_detail_response";
      break;
    case "pdd.ddk.goods.detail"://多多进宝商品详情查询
      thisApiName = "goods_detail_response";
      break;
    case "pdd.ddk.goods.unit.query"://查询商品的推广计划
      thisApiName = "ddk_goods_unit_query_response";
      break;
    case "pdd.ddk.coupon.info.query"://查询优惠券信息
      thisApiName = "ddk_coupon_info_query_response";
      break;
    case "pdd.ddk.goods.search"://多多进宝商品查询
      thisApiName = "goods_search_response";
      break;
    case "pdd.ddk.merchant.list.get"://多多客查店铺列表接口
      thisApiName = "merchant_list_response";
      break;
    case "pdd.ddk.mall.goods.list.get"://查询店铺商品
      thisApiName = "goods_info_list_response";
      break;
    case "pdd.ddk.theme.list.get"://多多进宝主题列表查询
      thisApiName = "theme_list_get_response";
      break;
      
    case "pdd.ddk.goods.recommend.get"://运营频道商品查询API
    thisApiName = "goods_basic_detail_response";
    break;
      
    case "pdd.ddk.goods.promotion.url.generate"://多多进宝推广链接生成
    thisApiName = "goods_promotion_url_generate_response";
    break;
    case "pdd.ddk.goods.zs.unit.url.gen"://多多进宝转链接口
      thisApiName = "goods_zs_unit_generate_response";
      break;



    case "pdd.ddk.rp.prom.url.generate"://生成营销工具推广链接
      thisApiName = "rp_promotion_url_generate_response";
      break;
    case "pdd.ddk.lottery.url.gen"://多多客生成转盘抽免单url
      thisApiName = "lottery_url_response";
      break;

    case "pdd.ddk.cms.prom.url.generate"://生成商城-频道推广链接
      thisApiName = "cms_promotion_url_generate_response";
      break;
    case "pdd.ddk.resource.url.gen"://生成多多进宝频道推广
      thisApiName = "resource_url_response";
      break;
    case "pdd.ddk.theme.prom.url.generate"://多多进宝主题推广链接生成
      thisApiName = "theme_promotion_url_generate_response";
      break;
    case "pdd.ddk.mall.url.gen"://多多客生成店铺推广链接
      thisApiName = "mall_coupon_generate_url_response";
      break;
    case "pdd.ddk.order.detail.get"://查询订单详情
      thisApiName = "order_detail_response";
      break;
    case "pdd.ddk.order.list.increment.get"://最后更新时间段增量同步推广订单信息
      thisApiName = "order_list_get_response";
      break;
    case "pdd.ddk.order.list.range.get"://用时间段查询推广订单接口
      thisApiName = "order_list_get_response";
      break;


    case "pdd.ddk.finance.cpa.query"://查询CPA数据
      thisApiName = "finance_cpa_query_response";
      break;
    case "pdd.ddk.goods.pid.generate"://创建多多进宝推广位
      thisApiName = "p_id_generate_response";
      break;

    default:
      {
        if (thisApiName.match('^pdd')) {
          thisApiName = thisApiName.substr(4);
        }
        if (thisApiName.match('^ddk')) {
          thisApiName = thisApiName.substr(4);
        }
        thisApiName = thisApiName.replace(reg, '_') + "_response";
        break;
      }
  }
  return thisApiName;
}

const util = {
  checkRequired,
  md5,
  YYYYMMDDHHmmss,
  getApiResponseName,
};

module.exports = util
//export default util;
