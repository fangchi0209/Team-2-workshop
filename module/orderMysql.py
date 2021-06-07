from module.connectMysql import connection_pool
from random import randint
from datetime import datetime
import json

def submitorderingData(userId, attractionId, tripDate, tripTime, tripPrice, name, email, phone, payment_status):
    # 產生orderSerialNumber(當下日期+8碼整數)，亦為銀行端訂單編號
    bank_transaction_id = datetime.strftime(datetime.today(), "%Y%m%d")+"".join([str(randint(0,9)) for num in range(8)])
    # 確認orderSerialNumber無重複
    inputQuery = "SELECT order_serial_number FROM ordering WHERE order_serial_number = %s"
    inputValue = (bank_transaction_id, )
    checkresult = sqlSelect(inputQuery, inputValue)
    while (checkresult != None):
        if "error" in checkresult:
            # 回傳伺服器內部錯誤訊息
            return checkresult
        # 重新產生orderSerialNumber
        bank_transaction_id = datetime.strftime(datetime.today(), "%Y%m%d")+"".join([str(randint(0,9)) for num in range(8)])
        # 確認orderSerialNumber無重複
        inputQuery = "SELECT order_serial_number FROM ordering WHERE order_serial_number = %s"
        inputValue = (bank_transaction_id, )
        checkresult = sqlSelect(inputQuery, inputValue)
    # orderSerialNumber無重複，將付款訂單資料輸入ordering table，回傳流水號
    insertQuery = "INSERT INTO ordering (order_serial_number, user_id, attraction_id, trip_date, trip_time, trip_price, name, email, phone, payment_status) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    insertValue = (bank_transaction_id, userId, attractionId, tripDate, tripTime, tripPrice, name, email, phone, payment_status)
    result = insertData(insertQuery, insertValue)
    if "error" in result:
        # 回傳伺服器內部錯誤訊息
        return result
    return bank_transaction_id

def submitpaymentData(bank_transaction_id, merchantId, orderPrice, tappayNumber, detail):
    insertQuery = "INSERT INTO payment_query (order_serial_number, merchant_id, amount, tappay_number, detail) VALUES (%s, %s, %s, %s, %s)"
    insertValue = (bank_transaction_id, merchantId, orderPrice, tappayNumber, detail)
    result = insertData(insertQuery, insertValue)
    if "error" in result:
        # 回傳伺服器內部錯誤訊息
        return result
    selectQuery = "SELECT query_id FROM payment_query WHERE order_serial_number = %s"
    selectValue = (bank_transaction_id, )
    # 回傳query_id，供payment_response用
    return sqlSelect(selectQuery, selectValue)

def submitresponseData(data, queryId):
    if data["status"] != 0:
        # 交易未成功
        insertQuery = "INSERT INTO payment_response (query_id, payment_status, message, rec_trade_id) VALUES (%s, %s, %s, %s)"
        insertValue = (queryId, data["status"], data["msg"], data["rec_trade_id"])
    else:
        #交易成功
        insertQuery = "INSERT INTO payment_response (query_id, payment_status, message, rec_trade_id, order_serial_number, amount, tappay_number, acquirer, transaction_time_millis) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        insertValue = (queryId, data["status"], data["msg"], data["rec_trade_id"], data["bank_transaction_id"], data["amount"], data["order_number"], data["acquirer"], data["transaction_time_millis"])
    result = insertData(insertQuery, insertValue)
    return result

def getOrderData(orderNumber):
    inputQuery = "SELECT o.trip_date, o.trip_time, o.trip_price, o.name, o.email, o.phone, o.payment_status, s.attraction_id, s.name, s.address, s.images FROM ordering o INNER JOIN spot s ON o.attraction_id = s.attraction_id WHERE order_serial_number = %s"
    inputValue = (orderNumber, )
    result = sqlSelect(inputQuery, inputValue)
    if result == None:
        return {"data":"null"}
    elif "error" in result:
        # 回傳伺服器內部錯誤訊息
        return result
    else:
        # result = (trip_date, trip_time, trip_price, name, email, phone, payment_status, attraction_id, name, address, images)
        # 將日期由datetime格式轉為string格式
        dateString = datetime.strftime(result[0], "%Y-%m-%d")
        # 照片網址由json格式轉為字串
        images = json.loads(result[10])
        data = {
            "number":orderNumber,
            "date":dateString,
            "time":result[1],
            "price":result[2],
            "contact":{
                "name":result[3],
                "email":result[4],
                "phone":result[5]
            },
            "status":int(result[6]),
            "trip":{
                "attraction":{
                    "id":result[7],
                    "name":result[8],
                    "address":result[9],
                    "image":images[0]
                }
            }
        }
        return {"data":data}

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

def updateStatus(status, order_serial_number):
    sqlQuery = "UPDATE ordering SET payment_status = %s WHERE order_serial_number = %s"
    value = (status, order_serial_number)
    try:
        connection_object = connection_pool.get_connection()
        with connection_object.cursor() as cursor:
            cursor.execute(sqlQuery, value)
            connection_object.commit()
        connection_object.close()
        return {"ok":"true"}
    except:
        return {"error":"true", "message":"伺服器內部錯誤！"}