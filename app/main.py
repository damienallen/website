from flask import Flask, escape, request
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app)


@app.route("/api")
def hello():
    name = request.args.get("name", "World")
    return f"Hello, {escape(name)}!"
