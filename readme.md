# pddclient

[![npm version](https://img.shields.io/npm/v/pddclient.svg?style=flat-square)](
https://www.npmjs.com/package/pddclient)

Node.js版的多多客接口

## 安装
```
npm install pddclient --save
```

## 使用方法
### Promise
```javascript
const pddClient = require('pddclient');

const client = new pddClient({
  client_id: 'client_id',
  client_secret: 'client_secret',
});


client.execute("pdd.ddk.goods.search", {
    keyword: "推荐"
    , with_coupon: true
    , page_size: 20
    , page: 1
    , sort_type: 1
    , list_id: ''
}).then(res=>{
    console.log(res);
});

```
### Async / await
```javascript


const pddClient = require('pddclient');

async function search(){
    const client = new PddClient({
                client_id: 'client_id',
                client_secret: 'client_secret'
            });
    let result;
    try{
        result = await client.execute("pdd.ddk.goods.search", {
            keyword: "推荐"
            , with_coupon: true
            , page_size: 20
            , page: 1
            , sort_type: 1
            , list_id: ''
        })
      }catch(e){
        console.log(e);
      }
    console.log(e)
}
search()
```

## License
MIT