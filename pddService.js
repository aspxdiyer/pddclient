var PddClient = require('pddclent')

var service = {
    client: function () {
        const client = new PddClient({
            client_id: 'client_id',
            client_secret: 'client_secret'
        });
        return client;
    },
    list: async function (opts) {
        try {

            let keyword = opts.keyword || "";
            let page = opts.page || 1;
            let page_size = opts.page_size || 20;
            let with_coupon = opts.with_coupon || true;
            let list_id = opts.list_id || "";

            let sort_type = opts.sort_type || 0;

            let client = this.client();
            let result = await client.execute("pdd.ddk.goods.search", {
                keyword: keyword
                , with_coupon: with_coupon
                , page_size: page_size
                , page: page
                , sort_type: sort_type
                , list_id: list_id
            });
            let total = result.total_count;
            var json_list = result.goods_list;
            //console.log(json_list);
            var data = [];
            json_list.forEach(item => {
                data.push({
                    mall_coupon_id: item.mall_coupon_id
                    , mall_coupon_total_quantity: item.mall_coupon_total_quantity
                    , mall_coupon_remain_quantity: item.mall_coupon_remain_quantity
                    , mall_coupon_start_time: item.mall_coupon_start_time
                    , mall_coupon_end_time: item.mall_coupon_end_time
                    , create_at: item.create_at
                    , goods_id: item.goods_id
                    , goods_name: item.goods_name
                    , goods_desc: item.goods_desc
                    , goods_thumbnail_url: item.goods_thumbnail_url
                    , goods_image_url: item.goods_image_url
                    , goods_gallery_urls: item.goods_gallery_urls
                    , min_group_price: item.min_group_price
                    , min_normal_price: item.min_normal_price
                    , mall_name: item.mall_name
                    , merchant_type: item.merchant_type
                    , category_id: item.category_id
                    , category_name: item.category_name
                    , search_id: item.search_id
                    , coupon_discount: item.coupon_discount
                })
            })
            return { status: 0, data: data, total: total, pagesize: page_size, page: page, search_id: result.search_id, list_id: result.list_id };
        } catch (e) {
            return { status: -1, msg: e };

        }
    },
    top_list: async function (opts) {
        try {
            let p_id = opts.p_id || "";
            let page = opts.page || 1;
            let page_size = opts.page_size || 20;
            let sort_type = opts.sort_type || 1;
            let list_id = opts.list_id || "";
            let offset = (page - 1) * page_size;
            let limit = page_size;//offset + page_size+1;

            if (page == 1) {
                limit = page_size + 1;
            }
            //let offset = 
            console.log("offset",offset,"limit",limit)
            let client = this.client();
            let result = await client.execute("pdd.ddk.top.goods.list.query", {
                p_id: p_id
                , offset: offset
                , sort_type: sort_type
                , limit: limit
                , list_id: list_id
            });
            let total = result.total_count;
            var json_list = result.list;
            //console.log(json_list);
            var data = [];
            json_list.forEach(item => {
                data.push({
                    mall_coupon_id: 0
                    , mall_coupon_total_quantity: 0
                    , mall_coupon_remain_quantity: 0
                    , mall_coupon_start_time: 0
                    , mall_coupon_end_time: 0
                    , create_at: 0
                    , goods_id: item.goods_id
                    , goods_name: item.goods_name
                    , goods_desc: item.goods_desc
                    , goods_thumbnail_url: item.goods_thumbnail_url
                    , goods_image_url: item.goods_image_url
                    , goods_gallery_urls: item.goods_gallery_urls
                    , min_group_price: item.min_group_price
                    , min_normal_price: item.min_normal_price
                    , mall_name: item.mall_name
                    , merchant_type: item.merchant_type
                    , category_id: 0
                    , category_name: ""
                    , search_id: item.search_id
                    , coupon_discount: item.coupon_discount
                })
            })
            return { status: 0, data: data, total: total, pagesize: page_size, page: page, search_id: result.search_id, list_id: result.list_id };

        }
        catch (e) {
            return { status: -1, msg: e };
        }
    },
    goods: async function (opts) {//多多进宝推广链接生成
        try {
            let goods_id_list = opts.goods_id_list;
            let p_id = opts.p_id || "";
            let search_id = opts.search_id || "";
            let generate_short_url = opts.generate_short_url || true;
            let multi_group = opts.multi_group || false;
            let generate_weapp_webview = opts.generate_weapp_webview || true;
            let generate_we_app = opts.generate_we_app || true;
            let generate_qq_app = opts.generate_qq_app || true;
            //console.log(search_id)
            //, option={p_id="9967655_133871353",search_id=""}
            let client = this.client();
            let res = await client.execute("pdd.ddk.goods.promotion.url.generate", {
                p_id: p_id
                , goods_id_list: goods_id_list.split(',')
                , generate_short_url: generate_short_url
                , multi_group: multi_group
                , generate_weapp_webview: generate_weapp_webview
                , generate_we_app: generate_we_app
                , search_id: search_id
                , generate_qq_app: generate_qq_app
            });
            res.status = 0;
            return res;
        }
        catch (e) {
            return { status: -1, msg: e };
        }
    },
    goods_detail: async function (opts) {//多多进宝商品详情查询
        try {            
            let goods_id_list = opts.goods_id_list;
            let p_id = opts.p_id || "";
            let search_id = opts.search_id || "";

            let client = this.client();
            let res = await client.execute("pdd.ddk.goods.detail", {
                p_id: p_id
                , goods_id_list: goods_id_list.split(',')
                , search_id: search_id
            });
            return { status: 0, data: res.goods_details[0] };
        } catch (e) {
            return { status: -1, msg: e };
        }
    }
}

module.exports = service;