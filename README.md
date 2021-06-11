# Git/GitHub Collaboration Workshop
### https://www.taipeitoursite.com/cowork

## Teamwork Distribution

<table>
  <tr>
    <td>李芳岐 (簡稱H, F2)</td>
    <td>李震瑋 (簡稱B) </td>
    <td>魏伊廷 (簡稱F1)  </td>
  </tr>
  <tr>
    <td>repo host / deploy / map developer</td>
    <td>back-end code-base provider / developer </td>
    <td>front-end code-base provider / developer </td>
  </tr>
  <tr>
    <td>Host collaboration Repo, confirm Pull Request from B, F1<br>
      建立 API 規格 (/api/favorite)<br>
      在景點頁新增 map.js 顯示地圖<br>
      build database & table in EC2<br>
      deploy on EC2<br></td>
    <td>撰寫前後端工作流程<br>
       新增 app.route("/favorite")<br>
       post / get / delete methods<br>
       設計 favorite table 資料表 <br>
       新增檢查是否重複收藏</td>
    <td>各頁面愛心圖示 toggle / loading effect<br>
      收藏頁 layout, 串 GET api render 畫面<br>
      首頁、景點頁、收藏頁 串 GET api 顯示收藏狀態; 串 POST/DELETE api 做收藏互動 <br>
      nav bar include favorite, add hamburger menu for RWD</td>
</table>

<br>

## [新增：我的收藏功能與頁面、個別景點地圖]


### Initial Code Base Integration

1. 由 H 先建立一個空的 index.html 作為 host repo ，有 main, develop branch

2. B 與 F1 fork host repo 到自己的 github repo，clone 到本機

3. 前後端 code base 合併
 - B 將所有後端程式新增到自己的 repo，發 merge 到 develop 的 PR 給 H
 - F1 將所有前端程式新增到自己的 repo，發 merge 到 develop 的 PR 給 H

4. H confirm 兩個 PR， 組成一個有前後端程式的專案

5. deploy 到 H 的 EC2 上	

![GITHUB](https://github.com/fangchi0209/Team-2-workshop/blob/main/前後端整合與部屬.jpg)


### 工作細部流程

1. F1 與 F2 協調，確認 attraction.html 新增地圖功能上所需新增的 html 內容部分

2. 地圖功能由 F2 用 map.js 分開製作

3. api 規格訂定
  - 由 H 開立我的收藏功能所需的 get / post /delete api 規格與實作流程  https://app.swaggerhub.com/apis-docs/fangchi0209/favoriteAPI/1.0.0#/
  - H 與 F1, B 討論調整 api 規格

4. 開發工作劃分
 - 由 B 負責我的收藏後端 db 資料表設計/建置、 api 建置
 - 由 F1 負責我的收藏前端愛心圖示串接 api 互動，收藏頁 layout 製作
 - 由 F2 負責景點頁新增地圖，串接第三方 api

5. 整合分工開發成果、部署
  - 由 H 審核 F1, B Pull Request
  - H 於 EC2 上部署以 port 5000部署, 使用 nginx 代理與網域路徑'cowork'設定
  - F1, B 調整配合 'cowork' 路徑的設定 


![GITHUB](https://github.com/fangchi0209/Team-2-workshop/blob/main/協作流程圖.jpg)


### [ 景點收藏 網頁前後端動作 ]

#### 1.景點被收藏
##### 前端：使用者點擊index, attraction頁面愛心，先發GET user API判斷有沒有登入，有登入發POST給favorite API，沒登入出現登入面板
##### 後端：接受前端post資料，儲存到favorite table 成功回覆 {"ok": true} 200； 錯誤 400 403 500(類似booking api post錯誤內容)
##### 前端：收到後端回覆的post結果，成功就把愛心狀態改變為“收藏”狀態，沒成功不做動作

#### 2.景點被取消收藏
##### 前端：使用者點擊index, attraction, favorite頁面愛心，發DELETE給favorite API
##### 後端：接受前端DELETE資料，將該景點資料由favorite table刪除，成功回覆 {"ok": true} 200； 錯誤 403(沒登入不給刪)
##### 前端：
 - index attraction頁面：收到後端回覆的delete結果，成功就把愛心狀態改變為“沒收藏”狀態，沒成功不做動作
 - favorite頁面：收到後端回覆的delete結果，成功就把愛心狀態改變為“沒收藏”狀態，沒成功不做動作

#### 3.進入favorite頁面
##### 前端：進入頁面先判斷使用者是否登入，沒登入導回首頁，有登入，發GET給favorite API
##### 後端：收到前端請求，到favorite table把該使用者收藏的景點資料回覆給前端，成功回覆 {資料} 200；錯誤 403(沒登入不給資料)
##### 前端：前端收到回覆資料呈現頁面

#### 4.index,attraction, favorite 頁面收藏景點愛心圖示顯示
##### 前端：進入頁面先判斷使用者是否登入，有登入，發GET給favorite API
##### 後端：收到前端請求，到favorite table把該使用者收藏的景點資料回覆給前端，成功回覆 {資料} 200；錯誤 403(沒登入不給資料)
##### 前端：
 - index頁面：畫出每個景點時，確認那個景點的id是否有在後端回覆的資料內，有則呈現愛心狀態為“收藏”狀態，無則愛心狀態為“沒收藏”狀態
 - attraction頁面：確認該景點id是否有在後端回覆的資料內，有則呈現愛心狀態為“收藏”狀態，無則愛心狀態為“沒收藏”狀態

#### 5.nav bar我的收藏
##### 前端：被點擊先發GET user API判斷有沒有登入，有登入導到favorite頁面，沒登入出現登入面板
##### 後端：判斷使用者是否登入



