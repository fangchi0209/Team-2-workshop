from flask import request, make_response, jsonify, Blueprint
from module.userMysql import checkUserStatus
from module.favoriteMysql import submitFavorite, getFavoriteData, deleteFavoriteData

favoriteApi = Blueprint("favoriteApi", __name__)

@favoriteApi.route("/favorite", methods=["GET"])
def userFavoriteData():
    cookieValue = request.cookies.get("sessionId")
    # 檢查使用者是否有cookie，正常回復(True, 使用者相關資料, 查詢當下再延長的expendTime)
    checkResult = checkUserStatus(cookieValue)
    if checkResult == False:
        resp = make_response(jsonify(error=True, message="未登入系統，拒絕存取"), 403)
        return resp
    # searchResult(user_id, name, email)
    userData = checkResult[1]
    expendTime = checkResult[2]
    getFavoriteDataResult = getFavoriteData(userData[0])
    respBody = jsonify(getFavoriteDataResult)
    if "error" in getFavoriteDataResult:
        resp = make_response(respBody, 500)
        return resp
    else:
        resp = make_response(respBody, 200)
        resp.set_cookie(key="sessionId", value=cookieValue, expires=expendTime)
        return resp

@favoriteApi.route("/favorite", methods=["POST"])
def submitUserFavorite():
    cookieValue = request.cookies.get("sessionId")
    # 檢查使用者是否有cookie，正常回復(True, 使用者相關資料, 查詢當下再延長的expendTime)
    checkResult = checkUserStatus(cookieValue)
    if checkResult == False:
        resp = make_response(jsonify(error=True, message="未登入系統，拒絕存取"), 403)
        return resp
    # searchResult(user_id, name, email)
    userData = checkResult[1]
    expendTime = checkResult[2]
    # request.get_json()取得post過來的資料
    requestBody = request.get_json()
    attractionId = requestBody["attractionId"]
    # 檢查使用者提供資料正確性，景點id是否為整數
    idCheckResult = isinstance(attractionId, int)
    if idCheckResult == False:
        resp = make_response(jsonify(error=True, message="建立失敗，輸入資料錯誤"), 400)
        return resp
    # 將收藏景點送進資料庫(送user_id, attraction_id)
    submitResult = submitFavorite(userData[0], attractionId)
    respBody = jsonify(submitResult)
    if "error" in submitResult:
        resp = make_response(respBody, 500)
        return resp
    else:
        resp = make_response(respBody, 200)
        resp.set_cookie(key="sessionId", value=cookieValue, expires=expendTime)
        return resp

@favoriteApi.route("/favorite/<attractionId>", methods=["DELETE"])
def deleteUserFavorite(attractionId):
    cookieValue = request.cookies.get("sessionId")
    # 檢查使用者是否有cookie，正常回復(True, 使用者相關資料, 查詢當下再延長的expendTime)
    checkResult = checkUserStatus(cookieValue)
    if checkResult == False:
        resp = make_response(jsonify(error=True, message="未登入系統，拒絕存取"), 403)
        return resp
    # searchResult(user_id, name, email)
    userData = checkResult[1]
    expendTime = checkResult[2]
    # 刪除使用者該attractionId景點收藏
    deleteFavoriteResult = deleteFavoriteData(userData[0], attractionId)
    respBody = jsonify(deleteFavoriteResult)
    if "error" in deleteFavoriteResult:
        resp = make_response(respBody, 500)
        return resp
    else:
        resp = make_response(respBody, 200)
        resp.set_cookie(key="sessionId", value=cookieValue, expires=expendTime)
        return resp