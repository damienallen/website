from flask import Flask, request, jsonify
from werkzeug.middleware.proxy_fix import ProxyFix
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, From
import logging
import os
import requests

from form import ContactForm

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app)

# Forward logs to gunicorn
gunicorn_error_logger = logging.getLogger("gunicorn.error")
app.logger.handlers.extend(gunicorn_error_logger.handlers)
app.logger.setLevel(logging.INFO)


@app.route("/api")
def hello():
    return "Why, hello there kind stranger."


@app.route("/api/submit", methods=["POST"])
def submit():

    # Run validation
    contact_form = ContactForm(request.form)
    is_valid = contact_form.validate()
    status_code = 200 if is_valid else 400
    form_errors = [e for e in contact_form.errors.items()]

    # Response
    status = {
        "sent": False,
        "message": "Invalid request"
    }

    if request.method == "POST" and is_valid:

        # Captcha check
        r = requests.post(
            "https://www.google.com/recaptcha/api/siteverify",
            data={
                "secret": os.environ.get("RECAPTCHA_SECRET"),
                "response": request.form.get("recaptcha", None),
                "remoteip": request.remote_addr
            }
        )

        if not r.json()["success"]:
            status["message"] = "Captcha check failed!"
            return jsonify(status=status, form_errors=form_errors), 400

        # Extract request data
        name = request.form.get("name")
        from_email = request.form.get("email")
        subject = request.form.get("subject")
        message = request.form.get("message")

        # Get contact email from environment
        to_email = os.environ.get("CONTACT_EMAIL")

        # Build sendgrid mail object
        message = Mail(
            from_email=From(from_email, name),
            to_emails=to_email,
            subject=f"[Contact Form] {subject}",
            html_content=message,
        )

        try:
            sg = SendGridAPIClient(os.environ.get("SENDGRID_KEY"))
            response = sg.send(message)
            
            if response.status_code == 202:
                status["sent"] = True
                status["message"] = "Message sent sucessfully."
            else:
                status["message"] = "Sendgrid failed to send message."
                status_code = 500

        except Exception as e:
            app.logger.error(e)
            status["message"] = "Failed to connect to sendgrid."
            status_code = 500

    return jsonify(status=status, form_errors=form_errors), status_code
