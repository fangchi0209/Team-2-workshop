from flask import request, jsonify, make_response, Blueprint
from module.checkdata import checkData
from module.userMysql import checkSignUp, checkSignIn, changeExpire, checkUserStatus

userApi = Blueprint("userApi", __name__)

@userApi.route("/user", methods=["GET"])
def userDataGet():
    cookieValue = request.cookies.get("sessionId")
    # 正常回復(True, searchResult, expendTime)
    checkResult = checkUserStatus(cookieValue)
    if checkResult == False:
        resp = make_response(jsonify({"data":None}), 200)
        return resp
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

@userApi.route("/user", methods=["POST"])
def userSubmitData():
    #request.get_json()取得post過來的資料
    signUpData = request.get_json()
    name = signUpData["name"]
    email = signUpData["email"]
    password = signUpData["password"]
    if checkData(email, password, name) == False:
        resp = make_response(jsonify({
            "error": True,
            "message": "請檢查輸入資料內容且不得為空白！"
        }), 400)
        return resp
    checkResult = checkSignUp(email, password, name)
    if "error" in checkResult:
        if checkResult["message"] == "伺服器內部錯誤！":
            resp = make_response(jsonify(checkResult), 500)
            return resp
        else:
            resp = make_response(jsonify(checkResult), 400)
            return resp
    else:
        resp = make_response(jsonify(checkResult), 200)
        return resp

@userApi.route("/user", methods=["PATCH"])
def userSignIn():
    #request.get_json()取得patch過來的資料
    signInData = request.get_json()
    email = signInData["email"]
    password = signInData["password"]
    if checkData(email, password) == False:
        resp = make_response(jsonify({
            "error": True,
            "message": "請檢查輸入資料內容且不得為空白！"
        }), 400)
        return resp
    checkResult = checkSignIn(email, password)
    if "error" in checkResult:
        if checkResult["message"] == "伺服器內部錯誤！":
            resp = make_response(jsonify(checkResult), 500)
            return resp
        else:
            resp = make_response(jsonify(checkResult), 400)
            return resp
    #電子郵件及密碼符合的話，回復資料[0]為{"ok":"true"} [1]為cookievalue [2]為保存期限
    else:
        resp = make_response(jsonify(checkResult[0]), 200)
        resp.set_cookie(key="sessionId", value=checkResult[1], expires=checkResult[2], samesite="Strict")
        return resp

@userApi.route("/user", methods=["DELETE"])
def userDelete():
    cookieValue=request.cookies.get("sessionId")
    result = changeExpire(cookieValue)
    resp = make_response(jsonify(result[0]), 200)
    resp.set_cookie(key="sessionId", value=cookieValue, expires=result[1])
    return resp