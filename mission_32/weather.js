// API
const url = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=CWB-0A4AAE63-1212-4C3D-9C26-AD82E6CDE2A2&elementName=MaxAT,PoP12h,T,RH,Wx'
const url2 = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=CWB-0A4AAE63-1212-4C3D-9C26-AD82E6CDE2A2&elementName='

// DOM
const select = document.querySelector('#select')
const today = document.querySelector('.today')
const cards = document.querySelector('.cards')

// static data 使用此筆資料
let latestData = null

// 先宣告
let city =  null
let time = null
let temperature = null
let weather = null
let bodyTemperature = null
let rainProbability = null
let humidity = null

// AJAX 取資料
const getDateAJAX = () => {
    fetch(url)
    .then((res)=>{
       return res.json()
    })
    .then((result)=>{
        // console.log(result);
        let data = result.records.locations[0].location
        // 取得資料後複製一份到全域 後續動作皆使用同一筆data 不然資料流很亂
        latestData = [...data]
        let cityIndex = 0

        // 先依照資料筆數來 render select 的項目
        setOption(cityIndex)
    })
}

// 設定 select 的 option
const setOption = (cityIndex) =>{
    let display = ''
    // 取用全域的資料
    for(let i = 0 ; i < latestData.length ; i++){
        display += 
        `
        <option value="${i}">${latestData[i].locationName}</option>
        `      
    }
    select.innerHTML = display
    // console.log(cityIndex);
    // console.log(data);
    changeCity(cityIndex)
}

// 更換 city 觸發
const changeCity = (cityIndex) =>{
    // 重新指派新的 cityIndex
    cityIndex = select.value
    // 再往裡面傳
    showCards(latestData,cityIndex)
    showMainCard(latestData,cityIndex)
}
select.addEventListener('change', changeCity)

// 資料處理
const timeHandler = (unhandleData) =>{
    // 這邊只剩下時間 15 筆
    // console.log(unhandleData);
    let result = [];
    for (let i = 3; i < unhandleData.weatherElement[0].time.length; i+=2) {
        result.push((unhandleData.weatherElement[0].time[i].startTime).slice(0,11))       
    }
    // console.log(result);
    return result
}
const temperatureHandler = (unhandleData) =>{
    // console.log(unhandleData);
    let result = [];
    for (let i = 3; i < unhandleData.weatherElement[1].time.length; i+=2) {
        result.push(unhandleData.weatherElement[1].time[i].elementValue[0].value)       
    }
    // console.log(result);
    return result
}
const weatherHandler = (unhandleData) =>{
    // console.log(unhandleData);
    let result = [];
    for (let i = 3; i < unhandleData.weatherElement[4].time.length; i+=2) {
        result.push(unhandleData.weatherElement[4].time[i].elementValue[0].value)       
    }
    // console.log(result);
    return result
}
const bodyTemperatureHandler = (unhandleData) =>{
    // console.log(unhandleData);
    let result = [];
    for (let i = 3; i < unhandleData.weatherElement[3].time.length; i+=2) {
        result.push(unhandleData.weatherElement[3].time[i].elementValue[0].value)       
    }
    // console.log(result);
    return result
}
const rainProbabilityHandler = (unhandleData) =>{
    // console.log(unhandleData);
    let result = [];
    for (let i = 3; i < unhandleData.weatherElement[0].time.length; i+=2) {
        result.push(unhandleData.weatherElement[0].time[i].elementValue[0].value)       
    }
    // console.log(result);
    return result
}
const humidityHandler = (unhandleData) =>{
    // console.log(unhandleData);
    let result = [];
    for (let i = 3; i < unhandleData.weatherElement[2].time.length; i+=2) {
        result.push(unhandleData.weatherElement[2].time[i].elementValue[0].value)       
    }
    // console.log(result);
    return result
}

// 生成 main-card
const showMainCard = (latestData,cityIndex) =>{
    let display = ''
    // 這邊影響內容
    let unhandleData = latestData[cityIndex]
    locationName = unhandleData.locationName
    time = unhandleData.weatherElement[0].time[0].startTime
    timeConvert = time.slice(0,11)
    temperature = unhandleData.weatherElement[1].time[0].elementValue[0].value
    weather = unhandleData.weatherElement[4].time[0].elementValue[0].value
    bodyTemperature = unhandleData.weatherElement[3].time[0].elementValue[0].value
    rainProbability = unhandleData.weatherElement[0].time[0].elementValue[0].value
    humidity = unhandleData.weatherElement[2].time[0].elementValue[0].value

    display += 
    `
    <h2>${locationName}</h2>
    <h3>${timeConvert}</h3>
    <div class="weather-temp">
    <img src="img/資產 1.png" alt="" />
    <h3>${temperature}°C</h3>
    </div>
    <div class="info">
    <table>
        <thead>
        <tr>
            <th colspan="2">天氣資訊</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>天氣現象</td>
            <td>${weather}</td>
        </tr>
        <tr>
            <td>體感溫度</td>
            <td>${bodyTemperature}°C</td>
        </tr>
        <tr>
            <td>降雨機率</td>
            <td>${rainProbability}%</td>
        </tr>
        <tr>
            <td>相對溼度</td>
            <td>${humidity}%</td>
        </tr>
        </tbody>
    </table>
    `
    
    today.innerHTML = display
} 

// 生成 cards
const showCards = (latestData,cityIndex) =>{
    let unhandleData = latestData[cityIndex]

    city = latestData[cityIndex].locationName
    // 將資料處理成 [Array6]
    time = timeHandler(unhandleData)
    temperature = temperatureHandler(unhandleData)
    weather = weatherHandler(unhandleData)
    bodyTemperature = bodyTemperatureHandler(unhandleData)
    rainProbability = rainProbabilityHandler(unhandleData)
    humidity = humidityHandler(unhandleData)
    let display = ''
    for(let i = 0 ; i < 6 ; i++ ){
        display +=
        `
        <div class="card">
        <h2>${city}</h2>
        <h3>${time[i]}</h3>
        <div class="weather-temp">
        <img src="img/資產 1.png" alt="" />
        <h3>${temperature[i]}°C</h3>
        </div>
        <div class="info">
        <table>
            <thead>
            <tr>
                <th colspan="2">天氣資訊</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>天氣現象</td>
                <td>${weather[i]}</td>
            </tr>
            <tr>
                <td>體感溫度</td>
                <td>${bodyTemperature[i]}°C</td>
            </tr>
            <tr>
                <td>降雨機率</td>
                <td>${rainProbability[i] === ' ' ? '未測出' : rainProbability[i]+'%'}</td>
            </tr>
            <tr>
                <td>相對溼度</td>
                <td>${humidity[i]}%</td>
            </tr>
            </tbody>
        </table>
        </div>
        </div>
        `
    }
    
    cards.innerHTML = display
}



getDateAJAX()


// 整體流程回顧
// 1. 頁面載入時 呼叫 (getDateAJAX) 取得資料後先複製一份存在全域 供後續統一使用 
// 2. 呼叫 (getDateAJAX) 時先依照資料筆數 產生對應數量的 option (setOption)
// 3. 起始畫面是預設 value 為 0 的 option
// 4. 要設定 option 改變時觸發 change 事件 讓 cityIndex 重新指派對應的 value
// 5. chgange 事件內執行 (showCards) (showMainCard) 讓畫面依照 cityIndex 更新
