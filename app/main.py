import os
import smtplib
from email.message import EmailMessage

from flask import Flask, jsonify, request
from models import ContactForm
from werkzeug.middleware.proxy_fix import ProxyFix

# Init flask app
app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app)


@app.route("/api")
def hello():
    return "Why, hello there kind stranger."


@app.route("/api/submit", methods=["POST"])
def submit():

    # Run validation
    app.logger.info(request.form)
    contact_form = ContactForm(request.form)
    is_valid = contact_form.validate()
    status_code = 200 if is_valid else 400
    form_errors = [e for e in contact_form.errors.items()]

    # Response
    status = {}
    if not request.method == "POST" or not is_valid:
        status = {"sent": False, "message": "Invalid request"}

    else:
        # Extract request data
        name = contact_form.data.get("name")
        from_email = contact_form.data.get("email")
        subject = contact_form.data.get("subject")
        message = contact_form.data.get("message")

        # Honeypot check
        honeypot_text = contact_form.data.get("check")
        honeypot_failed = honeypot_text != ""
        if honeypot_failed:
            app.logger.warning("Bot check failed!")
            return jsonify(status=status, form_errors=form_errors), 403

        # Get contact email from environment
        to_email = os.environ.get("CONTACT_EMAIL")

        # Build email object
        email = EmailMessage()
        email.set_content(message)
        email["Subject"] = f"[Form: {name}] {subject}"
        email["From"] = from_email
        email["To"] = to_email

        smtp_server = smtplib.SMTP(os.environ.get("SMTP_SERVER"), 587)
        try:
            smtp_server.ehlo()
            smtp_server.starttls()
            smtp_server.ehlo()
            smtp_server.login(os.environ.get("SMTP_USER"), os.environ.get("SMTP_PASS"))
            smtp_server.send_message(message)

            status["sent"] = True
            status["message"] = "Message sent sucessfully."

        except Exception as e:
            status["message"] = f"Failed to send message: {e}"
            app.logger.error(status["message"])
            status_code = 500

        finally:
            if smtp_server is not None:
                smtp_server.quit()

    return jsonify(status=status, form_errors=form_errors), status_code
