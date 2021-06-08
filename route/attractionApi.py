from flask import Blueprint, request, jsonify
from module.attractionMysql import selectData, selectById

attractionsApi = Blueprint("attractionsApi", __name__)
attractionApi = Blueprint("attractionApi", __name__)

@attractionsApi.route("/attractions")
def dataWithPage():
	eachPage = 12	#每頁12筆資料
	page = int(request.args.get("page"))
	keyword = request.args.get("keyword")
	returnData = selectData(eachPage, page, keyword)
	if type(returnData) is dict:
		return jsonify(returnData), 500
	else:
		return jsonify(
			{
				"nextPage":returnData[1],
				"data":returnData[0]
			}
		), 200

@attractionApi.route("/attraction/<int:attractionId>")
def dataWithId(attractionId):
	returnData = selectById(attractionId)
	if "error" in returnData:
		if returnData["message"] == "伺服器錯誤":
			return jsonify(returnData), 500
		else:
			return jsonify(returnData), 400
	else:
		return jsonify(
			{
				"data":returnData
			}
		), 200
