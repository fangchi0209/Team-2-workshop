from module.connectMysql import connection_pool
import json

def submitFavorite(userId, attractionId):
    # 先看有沒有重複收藏
    selectQuery = "SELECT favorite_id FROM favorite WHERE user_id = %s AND attraction_id = %s"
    selectValue = (userId, attractionId)
    result = sqlSelect(selectQuery, selectValue)
    if len(result) == 0:
        insertQuery = "INSERT INTO favorite (user_id, attraction_id) VALUES (%s, %s)"
        insertValue = (userId, attractionId)
        # 輸入成功回傳{"ok":True} 失敗{"error":True, "message":"伺服器內部錯誤！"}
        return insertData(insertQuery, insertValue)
    else:
        return {"error":True, "message":"景點重複收藏"}

def getFavoriteData(userId):
    selectQuery = "SELECT s.attraction_id, s.name, s.category, s.description, s.address, s.transport, s.mrt, s.latitude, s.longitude, s.images FROM favorite f INNER JOIN spot s ON f.attraction_id = s.attraction_id WHERE user_id = %s"
    selectValue = (userId, )
    result = sqlSelect(selectQuery, selectValue)
    if len(result) == 0:
        return {"data":None}
    elif "error" in result:
        # 回傳伺服器內部錯誤訊息
        return result
    else:
        #result = (attraction_id, name, category, description, address, transport, mrt, latitude, longitude, images)
        favoriteSet = []
        for favorite in result:
            # 照片網址由json格式轉為字串
            images = json.loads(favorite[9])
            favoriteData = {
                "id":favorite[0],
                "name":favorite[1],
                "category":favorite[2],
                "description":favorite[3],
                "address":favorite[4],
                "transport":favorite[5],
                "mrt":favorite[6],
                "latitude":float(favorite[7]),
                "longitude":float(favorite[8]),
                "images":images[0]
            }
            favoriteSet.append(favoriteData)
        return {"data":favoriteSet}

def deleteFavoriteData(userId, attractionId):
    deleteQuery = "DELETE FROM favorite WHERE user_id = %s AND attraction_id = %s"
    deleteValue = (userId, attractionId)
    return deleteRowData(deleteQuery, deleteValue)

def insertData(sqlQuery, value):
    try:
        connection_object = connection_pool.get_connection()
        with connection_object.cursor() as cursor:
            cursor.execute(sqlQuery, value)
            connection_object.commit()
        connection_object.close()
        return {"ok":True}
    except:
        return {"error":True, "message":"伺服器內部錯誤！"}

def sqlSelect(sqlQuery, value):
    try:
        connection_object = connection_pool.get_connection()
        with connection_object.cursor() as cursor:
            cursor.execute(sqlQuery, value)
            sqlresult = cursor.fetchall()
        connection_object.close()
        return sqlresult
    except:
        return {"error":True, "message":"伺服器內部錯誤！"}

def deleteRowData(sqlQuery, value):
    try:
        connection_object = connection_pool.get_connection()
        with connection_object.cursor() as cursor:
            cursor.execute(sqlQuery, value)
            connection_object.commit()
        connection_object.close()
        return {"ok":True}
    except:
        return {"error":True, "message":"伺服器內部錯誤！"}