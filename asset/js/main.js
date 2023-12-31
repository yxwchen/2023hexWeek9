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
const productList = document.querySelector(".productWrap");
const shoppingCartItem = document.querySelector('.shoppingCart-Item');
let cartTotalPrice;
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
// 渲染產品資料(chatgpt幫忙除錯 要再看過全部渲染的邏輯問題在哪)
function renderProductList(product) {
    let str = '';

    // 如果 product 未定義或為空，將 filteredData 設為整個 productData
    const filteredData = (product && product.trim() !== '') ?
        productData.filter(item => product === item.category || product === '全部') :
        productData;

    // console.log(productData);
    // console.log(filteredData);

    filteredData.forEach(function (item) {
        str += `<li class="productCard">
<h4 class="productType">新品</h4>
<img src="${item.images}" alt="">
<a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
<h3>${item.title}</h3>
<del class="originPrice">NT$${item.origin_price}</del>
<p class="nowPrice">NT$${item.price}</p>
</li>`;
    });

    //console.log(str);
    productList.innerHTML = str;
}
// Ｑ原本自己寫的渲染頁面 但初始化載入都沒有產品列表。
// function renderProductList(product) {
//     let str = '';
//     let filteredData = [];
//     const filterData = productData.filter(function (item) {
//         if (product === item.category) {
//             filteredData.push(item);
//             return true;
//         }
//         //全部品項
//         if (product === '全部') {
//             filteredData.push(item);
//             return true;

//         }
//     })


//     console.log(productData);
//     console.log(filteredData);
//     console.log(filterData);
//     filterData.forEach(function (item) {
//         str += `<li class="productCard">
// <h4 class="productType">新品</h4>
// <img src="${item.images}"
//     alt="">
// <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
// <h3>${item.title}</h3>
// <del class="originPrice">NT$${item.origin_price}</del>
// <p class="nowPrice">NT$${item.price}</p>
// </li>`;
//     })
//     console.log(str);
//     productList.innerHTML = str;
// }
// 取得購物車列表
function getCartList() {
    let url = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`;
    axios
        .get(url)
        .then(function (response) {
            // console.log(response.data.carts); 測試有回應api裡面的資料集
            cartData = response.data.carts;
            cartTotalPrice = response.data.finalTotal;
            // console.log(cartTotalPrice);
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
    let str = '';
    const totalPrice = document.querySelector('.cart-totalPrice');

    if (cartData.length > 0) {
        cartData.forEach(function (item) {
            //console.log(item);
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
            <a href="#" data-id="${item.id}" class="material-icons">
                clear
            </a>
        </td>
        </tr>
    `
        })
        // 總金額計算 
        totalPrice.textContent = `NT$${cartTotalPrice}`;
    } else {
        // 如果購物車為空，將 str 設置為無資料
        str = '購物車目前無資料';
        totalPrice.textContent = 'NT$0';
    }


    shoppingCartItem.innerHTML = str;
}

// 新增購物車監聽事件
productList.addEventListener('click', function (e) {
    // console.log(e.target.getAttribute('class'));
    const addCartList = e.target.getAttribute('class');
    if (addCartList !== 'addCardBtn') {
        return
    } else {
        //取id
        const productId = e.target.getAttribute("data-id");
        addCartItem(productId);
    }
})
// 新增購物車 
function addCartItem(id) {
    let url = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`;
    axios
        .post(url, {
            data: {
                "productId": id,
                "quantity": 1
            }
        })
        .then(function (response) {
            //console.log(response.data); //測試有回應api裡面的資料集
            getCartList();
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}
// 刪除單筆監聽事件
shoppingCartItem.addEventListener('click', function (e) {
    // console.log(e.target.getAttribute('class'));
    const deleteCartList = e.target.getAttribute('class');
    if (deleteCartList !== 'material-icons') {
        return
    } else {
        const productId = e.target.getAttribute("data-id");
        //console.log(productId);
        deleteCartItem(productId);
    }
})
// 刪除單筆
function deleteCartItem(cardId) {
    let url = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cardId}`;
    axios.delete(url)
        .then(function (response) {
            console.log(response.data);
            getCartList(); //刪除完重新取得購物車列表
            renderCartList(); //刪除完重新渲染購物車列表
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}
//刪除購物車所有品項 監聽事件
const deleteAllBtn = document.querySelector('.discardAllBtn');
deleteAllBtn.addEventListener('click', function (e) {
    deleteAllCartItem();
    renderCartList(); // 在這裡加上重新渲染購物車列表的操作
})
// 刪除購物車所有品項
function deleteAllCartItem() {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
        .then(function (response) {
            //console.log(response.data);
            alert('刪除全部購物車成功!');
            getCartList(); // 刪除完重新取得購物車列表
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}

//  篩選品項 監聽事件
const selectItem = document.querySelector('.productSelect');
selectItem.addEventListener('change', filter);

function filter() {
    //console.log(selectItem.value);
    renderProductList(selectItem.value);
}

// 送出購買訂單 監聽事件
let orderData = {
    user: {

    }
};
const sendOrderBtn = document.querySelector('.orderInfo-btn');
sendOrderBtn.addEventListener('click', function (e) {
    // console.log('aaa');
    e.preventDefault(); //取消表單的默認行為
    // 判斷購物車資料
    if (cartData.length == 0) {
        alert('購物車沒有產品，請先新增一筆');
        return
    }
    //判斷送出表單欄位資料
    const customerName = document.querySelector('#customerName').value;
    const customerPhone = document.querySelector('#customerPhone').value;
    const customerEmail = document.querySelector('#customerEmail').value;
    const customerAddress = document.querySelector('#customerAddress').value;
    const customeTradeWay = document.querySelector('#tradeWay').value;

    // console.log(customerName,customerPhone,customerEmail,customerAddress,customeTradeWay);
    if (customerName == '' || customerPhone == '' || customerEmail == '' || customerAddress == '') {
        alert('請填寫訂單資訊');
        return
    } else {
        orderData.user.name = customerName;
        orderData.user.tel = customerPhone;
        orderData.user.email = customerEmail;
        orderData.user.address = customerAddress;
        orderData.user.payment = customeTradeWay;
    }
    // console.log(orderData);
    //執行送出訂單api 
    createOrder();

})

// "user": {
//     "name": "六角學院",
//     "tel": "07-5313506",
//     "email": "hexschool@hexschool.com",
//     "address": "高雄市六角學院路",
//     "payment": "Apple Pay"
//   }

// 送出購買訂單
function createOrder() {
    let url = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`;
    axios
        .post(url, {
            data: orderData
        })
        .then(function (response) {
            alert('訂單建立成功');
            console.log(response.data); //測試有回應api裡面的資料集

        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}

getProductList();
getCartList();