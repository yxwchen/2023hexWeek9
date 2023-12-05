/* 
順序：
1：初始化，取得產品與購物車列表 ˇ
2：新增購物車品項，並再次初始化購物車列表
3：修改購物車狀態(刪除全部、刪除單筆)，並再次初始化購物車列表
4：送出購買訂單，並再次初始化購物車列表
5：觀看後台訂單 
api:https://livejs-api.hexschool.io/
*/

// 請代入自己的網址路徑
const api_path = "claire";
// 需要的資料集宣告
let productData;
let cartData;

// 取得產品資料列表
function getProductList() {
    let url = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`;
    axios
        .get(url)
        .then(function (response) {
            // console.log(response.data.products); 測試有回應api裡面的資料集
            productData = response.data.products;
            //console.log(productData); 確認api資料有寫入到 productData變數裡
            renderProductList();
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}
// 渲染產品資料
function renderProductList() {
    const productList = document.querySelector(".productWrap");
    let str = '';
    productData.forEach(function (item) {
        str += `<li class="productCard">
<h4 class="productType">新品</h4>
<img src="${item.images}"
    alt="">
<a href="#" class="addCardBtn">加入購物車</a>
<h3>${item.title}</h3>
<del class="originPrice">NT$${item.origin_price}</del>
<p class="nowPrice">NT$${item.price}</p>
</li>`;
        //console.log(str); 測試有取到item的資料寫入到str
        productList.innerHTML = str;
    })
}
// 取得購物車列表
function getCartList() {
    let url = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`;
    axios
        .get(url)
        .then(function (response) {
            // console.log(response.data.carts); 測試有回應api裡面的資料集
            cartData = response.data.carts;
            //console.log(cartData); //確認api資料有寫入到 cartData
            renderCartList();
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}
// 渲染購物車列表
function renderCartList() {
    const shoppingCartItem = document.querySelector('.shoppingCart-Item');
    let str = '';

    cartData.forEach(function (item) {
        const itemTotalPrice = item.product.price * item.quantity;
        str += `
        <tr>
        <td>
            <div class="cardItem-title">
                <img src="${item.product.images}" alt="">
                <p>${item.product.title}</p>
            </div>
        </td>
        <td>NT$${item.product.price}</td>
        <td>${item.quantity}</td>
        <td>NT$${itemTotalPrice}</td>
        <td class="discardBtn">
            <a href="#" class="material-icons">
                clear
            </a>
        </td>
        </tr>
    `
        //console.log(item);
    })

    shoppingCartItem.innerHTML = str;
}
// TODO 新增購物車品項 
function addCartItem() {
    let url = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`;
    axios
        .post(url, {
            data: {
                "productId": "g0tlPzEH72mGh6aVdYUa",
                "quantity": 5
            }
        })
        .then(function (response) {
            console.log(response.data); //測試有回應api裡面的資料集
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}


getProductList();
getCartList();
addCartItem();