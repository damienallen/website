import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

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
        form_message = contact_form.data.get("message")

        message = MIMEText(
            f"""
        From: {name} <{from_email}>
        <br>
        Subject: {subject}
        <br><br><br>
        {form_message}
        <br><br><br>
        Sent from my website.
        """,
            "html",
        )

        # Honeypot check
        honeypot_text = contact_form.data.get("check")
        honeypot_failed = honeypot_text != ""
        if honeypot_failed:
            status["sent"] = False
            status["message"] = "Bot check failed!"
            app.logger.warning(status["message"])
            return jsonify(status=status, form_errors=form_errors), 403

        # Get contact email from environment
        to_email = os.environ.get("CONTACT_EMAIL")

        # Build email object
        email = MIMEMultipart("alternative")
        email["Subject"] = f"[Form] {name} <{from_email}> -> {subject}"
        email["From"] = from_email
        email["To"] = to_email
        email.attach(message)

        # Send via SMTP
        smtp_host = os.environ.get("SMTP_SERVER")
        smtp_user = os.environ.get("SMTP_USER")
        smtp_pass = os.environ.get("SMTP_PASS")
        smtp_server = smtplib.SMTP(smtp_host, 587)

        try:
            smtp_server.ehlo()
            smtp_server.starttls()
            smtp_server.ehlo()
            smtp_server.login(smtp_user, smtp_pass)
            app.logger.info(f"{smtp_host} ")
            smtp_server.sendmail(from_email, to_email, message.as_string())
            smtp_server.send_message(email)

            status["sent"] = True
            status["message"] = "Message sent sucessfully."

        except Exception as e:
            status["message"] = "Failed to send message."
            app.logger.error(e)
            status_code = 500

        finally:
            if smtp_server is not None:
                smtp_server.quit()

    return jsonify(status=status, form_errors=form_errors), status_code
