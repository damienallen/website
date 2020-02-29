from flask import Flask, request, jsonify
from werkzeug.middleware.proxy_fix import ProxyFix
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os

from form import ContactForm

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app)


@app.route("/api")
def hello():
    return f"Why, hello there kind stranger."


@app.route("/api/submit", methods=["POST"])
def submit():

    contact_form = ContactForm(request.form)

    is_valid = contact_form.validate()
    validation_errors = [str(e) for e in contact_form.errors.items()]

    if request.method == "POST" and is_valid:

        # Extract request data
        # name = request.form.get("name")
        from_email = request.form.get("email")
        subject = request.form.get("subject")
        message = request.form.get("message")

        to_email = os.environ.get("CONTACT_EMAIL")

        # Send email
        message = Mail(
            from_email=from_email,
            to_emails=to_email,
            subject=f"[Contact Form] {subject}",
            html_content=message,
        )

        try:
            sg = SendGridAPIClient(os.environ.get("SENDGRID_KEY"))
            response = sg.send(message)
            print(response.status_code)
            print(response.body)
            print(response.headers)
        except Exception as e:
            print(str(e))

    return jsonify(request=request.form, errors=validation_errors)
