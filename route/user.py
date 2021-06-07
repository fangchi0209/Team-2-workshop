from flask import request, jsonify, make_response
from flask_restful import Resource
from module.checkdata import checkData
from module.userMysql import checkSignUp, checkSignIn, changeExpire, checkUserStatus

class userApi(Resource):
    def get(self):
        cookieValue = request.cookies.get("sessionId")
        # 正常回復(True, searchResult, expendTime)
        checkResult = checkUserStatus(cookieValue)
        if checkResult == False:
            return {"data":"null"}, 200
        else:
            searchResult = checkResult[1]
            expendTime = checkResult[2]
            resp = make_response(jsonify({
                "data":{
                    "id":searchResult[0],
                    "name":searchResult[1],
                    "email":searchResult[2]
                }
            }), 200)
            resp.set_cookie(key="sessionId", value=cookieValue, expires=expendTime, samesite="Strict")
            return resp

    def post(self):
        #request.get_json()取得post過來的資料
        signUpData = request.get_json()
        name = signUpData["name"]
        email = signUpData["email"]
        password = signUpData["password"]
        if checkData(email, password, name) == False:
            return {
                "error": "true",
                "message": "請檢查輸入資料內容且不得為空白！"
            }, 400
        checkResult = checkSignUp(email, password, name)
        if "error" in checkResult:
            if checkResult["message"] == "伺服器內部錯誤！":
                return checkResult, 500
            else:
                return checkResult, 400
        else:
            return checkResult, 200

    def patch(self):
        #request.get_json()取得patch過來的資料
        signInData = request.get_json()
        email = signInData["email"]
        password = signInData["password"]
        if checkData(email, password) == False:
            return {
                "error": "true",
                "message": "請檢查輸入資料內容且不得為空白！"
            }, 400
        checkResult = checkSignIn(email, password)
        if "error" in checkResult:
            if checkResult["message"] == "伺服器內部錯誤！":
                return checkResult, 500
            else:
                return checkResult, 400
        #電子郵件及密碼符合的話，回復資料[0]為{"ok":"true"} [1]為cookievalue [2]為保存期限
        else:
            resp = make_response(checkResult[0], 200)
            resp.set_cookie(key="sessionId", value=checkResult[1], expires=checkResult[2], samesite="Strict")
            return resp

    def delete(self):
        cookieValue=request.cookies.get("sessionId")
        result = changeExpire(cookieValue)
        resp = make_response(result[0], 200)
        resp.set_cookie(key="sessionId", value=cookieValue, expires=result[1])
        return resp