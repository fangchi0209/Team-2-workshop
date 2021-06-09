from module.connectMysql import connection_pool
import json

def selectData(pageNum, pageInp, keyWord):	#供"/api/attractions"使用
	if keyWord:								#pageNum=12 pageInp=user input number(start from 0)
		inputQuery = "SELECT a.* FROM (SELECT attraction_id FROM spot WHERE name LIKE %s ORDER BY attraction_id LIMIT %s, %s) b JOIN spot a ON a.attraction_id = b.attraction_id"
		inputValue = (("%"+keyWord+"%"), pageNum*pageInp, pageNum+1)
	else:
		inputQuery = "SELECT a.* FROM (SELECT attraction_id FROM spot ORDER BY attraction_id LIMIT %s, %s) b JOIN spot a ON a.attraction_id = b.attraction_id"
		inputValue = (pageNum*pageInp, pageNum+1)
	allResult = sqlSelect(inputQuery, inputValue)
	allResultNum = len(allResult)
	if "error" in allResult:
		return allResult
	else:
		if allResultNum - pageNum > 0:
			return allResult[:-1], pageInp+1
		else:
			return allResult, None

def selectById(spotId):					#供"/api/attraction/<int:attractionId>"使用
	inputQuery = "SELECT * FROM spot WHERE attraction_id = %s"
	inputValue = (spotId, )
	forOneId = True
	result = sqlSelect(inputQuery, inputValue, forOneId)
	if result:
		return result
	else:
		return {"error":True, "message":"景點編號不正確"}

def sqlSelect(sqlQuery, value, oneId=False):		#用oneId區別/api/attraction與/api/attractions 資料處理方式
	try:
		connection_object = connection_pool.get_connection()
		with connection_object.cursor() as cursor:
			cursor.execute(sqlQuery, value)
			sqlresult = cursor.fetchall()
		connection_object.close()
		responseData = []
		for result in sqlresult:
			dictData = {}
			dictData["id"] = result[0]
			dictData["name"] = result[1]
			dictData["category"] = result[2]
			dictData["description"] = result[3]
			dictData["address"] = result[4]
			dictData["transport"] = result[5]
			dictData["mrt"] = result[6]				
			dictData["latitude"] = float(result[7])
			dictData["longitude"] = float(result[8])
			dictData["images"] = json.loads(result[9])
			if oneId == True:
				return dictData
			else:
				responseData.append(dictData)
		return responseData
	except:
		return {"error":True, "message":"伺服器錯誤"}