from flask import Flask, request, jsonify
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app)


@app.route("/api")
def hello():
    return f"Why, hello there kind stranger."


@app.route("/api/submit", methods=["POST"])
def submit():
    return jsonify(request=request.form)
