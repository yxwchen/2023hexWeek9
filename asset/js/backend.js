/*
順序：
設定api_path、token
取得訂單列表
渲染訂單列表
刪除單筆訂單
刪除全部訂單
修改訂單資料（訂單狀態？？？）
加入C3圖表-做圓餅圖，做全品項營收比重，類別含四項，篩選出前三名營收品項，其他 4~8 名都統整為「其它」
*/


// C3.js 預設
let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
        type: "pie",
        columns: [
            ['Louvre 雙人床架', 1],
            ['Antony 雙人床架', 2],
            ['Anty 雙人床架', 3],
            ['其他', 4],
        ],
        colors: {
            "Louvre 雙人床架": "#DACBFF",
            "Antony 雙人床架": "#9D7FEA",
            "Anty 雙人床架": "#5434A7",
            "其他": "#301E5F",
        }
    },
});

// api設定
const api_path = "claire";
const token = 'CJUeYiL1PhMH7vkuiK0tzsiagrD2';

let orderData;

// 取得訂單列表
function getOrderList() {
    let url = `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`;
    axios.get(url, {
            headers: {
                'Authorization': token
            }
        })
        .then(function (response) {
            console.log(response.data.orders);
            orderData = response.data.orders;
            renderOrderList(); // 在這裡呼叫 renderOrderList
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });

}
// 渲染訂單列表
const orderListItem = document.querySelector('.orderListItem');

function renderOrderList() {
    let str = '';
    orderData.forEach(function (item) {
        let productNames = item.products.map(product => product.title).join('<br>'); //找產品名稱用的陣列方法 by chatGPT
        str += `
        <tr>
                    <td>${item.id}</td>
                    <td>
                        <p>${item.user.name}</p>
                        <p>${item.user.tel}</p>
                    </td>
                    <td>${item.user.address}</td>
                    <td>${item.user.email}</td>
                    <td>
                        <p>${productNames}</p>
                    </td>
                    <td>${item.createdAt}</td>
                    <td class="orderStatus">
                        <a href="#">已處理</a>
                    </td>
                    <td>
                        <input type="button" class="delSingleOrder-Btn" data-id="${item.id}" value="刪除">
                    </td>
                </tr>
        `
    })

    orderListItem.innerHTML = str;
}
// 刪除單筆 監聽事件
orderListItem.addEventListener('click', function (e) {
    const deleteOrderList = e.target.getAttribute('class');
    // console.log(deleteOrderList);
    if (deleteOrderList !== "delSingleOrder-Btn") {
        return
    } else {
        const orderId = e.target.getAttribute("data-id");
        // console.log(orderId);
        deleteOrderItem(orderId);
    }
})
// 刪除單筆
function deleteOrderItem(orderId) {
    let url = `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`;
    axios.delete(url, {
            headers: {
                'Authorization': token
            }
        })
        .then(function (response) {
            console.log(response.data);
            getOrderList(); //刪除完重新取得訂單列表
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}
// 刪除全部 監聽事件
const deleteAllBtn = document.querySelector('.discardAllBtn');
deleteAllBtn.addEventListener('click', function (e) {
    deleteOrderAllItem();
    alert('已全部刪除所有訂單');
})
// 刪除全部
function deleteOrderAllItem() {
    let url = `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`;
    axios.delete(url, {
            headers: {
                'Authorization': token
            }
        })
        .then(function (response) {
            console.log(response.data);
            getOrderList(); //刪除完重新取得訂單列表
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}

getOrderList();