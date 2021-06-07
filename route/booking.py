from flask import request, make_response
from flask_restful import Resource
from module.userMysql import checkUserStatus
from module.checkdata import checkBookingData
from module.bookingMysql import submitBookingData, getAttractionData, deletePreData

class bookingApi(Resource):
    def get(self):
        cookieValue = request.cookies.get("sessionId")
        # 檢查使用者是否有cookie，正常回復(True, 使用者相關資料, 查詢當下再延長的expendTime)
        checkResult = checkUserStatus(cookieValue)
        if checkResult == False:
            return {"error":"true", "message":"未登入系統，拒絕存取"}, 403
        # searchResult(user_id, name, email)
        searchResult = checkResult[1]
        expendTime = checkResult[2]
        # 由資料庫中取出所需資料
        getAttractionDataResult = getAttractionData(searchResult[0])
        if "error" in getAttractionDataResult:
            return getAttractionDataResult, 500
        else:
            resp = make_response(getAttractionDataResult, 200)
            resp.set_cookie(key="sessionId", value=cookieValue, expires=expendTime)
            return resp

    def post(self):        
        cookieValue = request.cookies.get("sessionId")
        # 檢查使用者是否有cookie，正常回復(True, 使用者相關資料, 查詢當下再延長的expendTime)
        checkResult = checkUserStatus(cookieValue)
        if checkResult == False:
            return {"error":"true", "message":"未登入系統，拒絕存取"}, 403
        # searchResult(user_id, name, email)
        searchResult = checkResult[1]
        expendTime = checkResult[2]
        # request.get_json()取得post過來的資料
        bookingData = request.get_json()
        attractionId = bookingData["attractionId"]
        bookingDate = bookingData["date"]
        bookingTime = bookingData["time"]
        bookingPrice = bookingData["price"]
        # 檢查使用者提供資料正確性
        checkBookingDataResult = checkBookingData(attractionId, bookingDate, bookingTime, bookingPrice)
        if checkBookingDataResult == False:
            return {"error":"true", "message":"建立失敗，輸入資料錯誤"}, 400
        # 將訂單資料送進資料庫
        submitResult = submitBookingData(searchResult[0], attractionId, bookingDate, bookingTime, bookingPrice)
        if "error" in submitResult:
            return submitResult, 500
        else:
            resp = make_response(submitResult, 200)
            resp.set_cookie(key="sessionId", value=cookieValue, expires=expendTime)
            return resp

    def delete(self):
        cookieValue = request.cookies.get("sessionId")
        # 檢查使用者是否有cookie，正常回復(True, 使用者相關資料, 查詢當下再延長的expendTime)
        checkResult = checkUserStatus(cookieValue)
        if checkResult == False:
            return {"error":"true", "message":"未登入系統，拒絕存取"}, 403
        # searchResult(user_id, name, email)
        searchResult = checkResult[1]
        expendTime = checkResult[2]
        # 刪除資料庫中預定行程資料
        deleteBookingDataResult = deletePreData(searchResult[0])
        if "error" in deleteBookingDataResult:
            return deleteBookingDataResult, 500
        else:
            resp = make_response(deleteBookingDataResult, 200)
            resp.set_cookie(key="sessionId", value=cookieValue, expires=expendTime)
            return resp