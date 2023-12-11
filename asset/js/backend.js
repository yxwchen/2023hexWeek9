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

let orderDAta;

// 取得訂單列表
function getOrderList(){
    let url = `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`;
    axios.get(url,
        {
            headers:{
                'Authorization':token
            }
        })
        .then(function (response) {
             console.log(response.data.orders);
            orderData = response.data.orders;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });

}

getOrderList();