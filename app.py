from flask import Flask, render_template
from flask_cors import CORS
from flask_restful import Api
from route.attractionApi import attractionsApi, attractionApi
from route.user import userApi
from route.booking import bookingApi
from route.order import ordersApi, orderApi

app = Flask(__name__, static_folder="public", static_url_path="/")
api = Api(app)

CORS(app)									#設定所有的domains and routes接受跨來源資源共用(CORS)
app.config["JSON_AS_ASCII"]=False			#False避免中文顯示為ASCII編碼
app.config["TEMPLATES_AUTO_RELOAD"]=True	#True當flask偵測到template有修改會自動更新
app.config["JSON_SORT_KEYS"]=False			#False不以物件名稱進行排序顯示

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

#Api
app.register_blueprint(attractionsApi, url_prefix="/api")
app.register_blueprint(attractionApi, url_prefix="/api")
app.register_blueprint(ordersApi, url_prefix="/api")
app.register_blueprint(orderApi, url_prefix="/api")
api.add_resource(userApi, "/api/user")
api.add_resource(bookingApi, "/api/booking")

if __name__ == "__main__":
	app.run(host="0.0.0.0", port=3000)