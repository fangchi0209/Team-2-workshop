from flask import Flask, render_template
from route.attractionApi import attractionsApi, attractionApi
from route.user import userApi
from route.booking import bookingApi
from route.order import ordersApi, orderApi
from route.favorite import favoriteApi

app = Flask(__name__, static_url_path="/cowork")

app.config["JSON_AS_ASCII"]=False			#False避免中文顯示為ASCII編碼
app.config["TEMPLATES_AUTO_RELOAD"]=True	#True當flask偵測到template有修改會自動更新
app.config["JSON_SORT_KEYS"]=False			#False不以物件名稱進行排序顯示

# Pages
@app.route("/cowork")
def index():
	return render_template("index.html")
@app.route("/cowork/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/cowork/booking")
def booking():
	return render_template("booking.html")
@app.route("/cowork/thankyou")
def thankyou():
	return render_template("thankyou.html")
@app.route("/cowork/favorite")
def favorite():
	return render_template("favorite.html")

#Api
app.register_blueprint(attractionsApi, url_prefix="/cowork/api")
app.register_blueprint(attractionApi, url_prefix="/cowork/api")
app.register_blueprint(ordersApi, url_prefix="/cowork/api")
app.register_blueprint(orderApi, url_prefix="/cowork/api")
app.register_blueprint(favoriteApi, url_prefix="/cowork/api")
app.register_blueprint(userApi, url_prefix="/cowork/api")
app.register_blueprint(bookingApi, url_prefix="/cowork/api")

if __name__ == "__main__":
	app.run(host="0.0.0.0", port=5000, debug=True)