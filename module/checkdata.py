import re
from datetime import datetime, date

def checkData(email, password, name=None):
    nameRule = r"^\S{1,60}$"
    emailRule = r"@"
    passwordRule = r"^\S{4,16}$"
    if name == None:
        nameResult = True
    else:
        nameResult = re.fullmatch(nameRule, name)
    emailResult = re.search(emailRule, email)
    passwordResult = re.fullmatch(passwordRule, password)
    return ((nameResult != None) and (emailResult != None) and (passwordResult != None))

def checkBookingData(attractionId, bookingDate, bookingTime, bookingPrice):
    # 將日期由string格式轉為datetime格式
    bookingDate = datetime.strptime(bookingDate, "%Y-%m-%d")
    # 景點id是否為整數
    idResult = isinstance(attractionId, int)
    # 日期是否為日期
    dateResult = isinstance(bookingDate, date)
    # 時段是否為afternoon或morning
    timeResult = bookingTime in ("afternoon", "morning")
    # 價格是否為2000或2500
    priceResult = bookingPrice in (2000, 2500)
    if idResult and dateResult and timeResult and priceResult:
        return True
    else:
        return False

def checkOrderData(primeValue, attractionId, orderPrice, orderDate, orderTime, name, email, phone):
    # prime value不為空值
    primeResult = (primeValue != None)
    # 景點id是否為整數
    idResult = isinstance(attractionId, int)
    # 價格是否為2000或2500
    priceResult = orderPrice in (2000, 2500)
    # 將日期由string格式轉為datetime格式
    orderDate = datetime.strptime(orderDate, "%Y-%m-%d")
    # 日期是否為日期
    dateResult = isinstance(orderDate, date)
    # 時段是否為afternoon或morning
    timeResult = orderTime in ("afternoon", "morning")
    # 聯繫名稱是否確實(非空白)
    nameRule = r"^\S{1,60}$"
    nameResult = re.fullmatch(nameRule, name)
    # email是否有"@"
    emailRule = r"@"
    emailResult = re.search(emailRule, email)
    # 手機是否為10碼數字
    phoneRule = r"\d{10}"
    phoneResult = re.fullmatch(phoneRule, phone)
    if primeResult and idResult and priceResult and dateResult and timeResult and nameResult and emailResult and phoneResult:
        return True
    else:
        return False