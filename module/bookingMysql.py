from module.connectMysql import connection_pool
import json
from datetime import datetime

def submitBookingData(userId, attractionId, tripDate, tripTime, tripPrice):
    # 確認有無前次預訂資料
    inputQuery = "SELECT booking_id FROM booking WHERE user_id = %s"
    inputValue = (userId, )
    insertQuery = "INSERT INTO booking (user_id, attraction_id, trip_date, trip_time, trip_price) VALUES (%s, %s, %s, %s, %s)"
    insertValue = (userId, attractionId, tripDate, tripTime, tripPrice)
    result = sqlSelect(inputQuery, inputValue)
    if result == None:
        # 無前次資料，輸入資料後回傳正確訊息
        return insertData(insertQuery, insertValue)
    elif "error" in result:
        # 回傳伺服器內部錯誤訊息
        return result
    else:
        deleteResult = deletePreData(userId)
        if "error" in deleteResult:
            # 回傳伺服器內部錯誤訊息            
            return deleteResult
        return insertData(insertQuery, insertValue)

def getAttractionData(userId):
    inputQuery = "SELECT s.attraction_id, s.name, s.address, s.images, b.trip_date, b.trip_time, b.trip_price FROM booking b INNER JOIN spot s ON b.attraction_id = s.attraction_id WHERE b.user_id = %s;"
    inputValue = (userId, )
    result = sqlSelect(inputQuery, inputValue)
    if result == None:
        return {"data":"null"}
    elif "error" in result:
        # 回傳伺服器內部錯誤訊息
        return result
    else:
        # result = (attraction_id, name, address, images[], trip_date, trip_time, trip_price)
        attraction={}
        attraction["id"] = result[0]
        attraction["name"] = result[1]
        attraction["address"] = result[2]
        images = json.loads(result[3])
        attraction["image"] = images[0]
        data={}
        data["attraction"] = attraction
        # 將日期由datetime格式轉為string格式
        dateString = datetime.strftime(result[4], "%Y-%m-%d")
        data["date"] = dateString
        data["time"] = result[5]
        data["price"] = result[6]
        return {"data":data}

def deletePreData(userId):
    deleteQuery = "DELETE FROM booking WHERE user_id = %s"
    deleteValue = (userId, )
    # 刪除前次資料後，輸入資料
    deleteResult = deleteRowData(deleteQuery, deleteValue)
    return deleteResult

def sqlSelect(sqlQuery, value):
    try:
        connection_object = connection_pool.get_connection()
        with connection_object.cursor() as cursor:
            cursor.execute(sqlQuery, value)
            sqlresult = cursor.fetchone()
        connection_object.close()
        return sqlresult
    except:
        return {"error":"true", "message":"伺服器內部錯誤！"}

def insertData(sqlQuery, value):
    try:
        connection_object = connection_pool.get_connection()
        with connection_object.cursor() as cursor:
            cursor.execute(sqlQuery, value)
            connection_object.commit()
        connection_object.close()
        return {"ok":"true"}
    except:
        return {"error":"true", "message":"伺服器內部錯誤！"}

def deleteRowData(sqlQuery, value):
    try:
        connection_object = connection_pool.get_connection()
        with connection_object.cursor() as cursor:
            cursor.execute(sqlQuery, value)
            connection_object.commit()
        connection_object.close()
        return {"ok":"true"}
    except:
        return {"error":"true", "message":"伺服器內部錯誤！"}