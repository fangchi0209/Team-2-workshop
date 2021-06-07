from mysql.connector import pooling
import os
from dotenv import load_dotenv
load_dotenv()

#建立connection_pool供attraction API與user API使用
#connection pool let api have more permanent connections to MySQL
connection_pool = pooling.MySQLConnectionPool(
    host="localhost",
    user=os.getenv("db_user"),
    password=os.getenv("db_password"),
    database="stage2",
    pool_name="mypool",
    pool_size=5
)