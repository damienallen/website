from flask import Flask, request, jsonify
from werkzeug.middleware.proxy_fix import ProxyFix
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, From
import logging
import os

from form import ContactForm

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app)
app.logger.setLevel(logging.DEBUG)


@app.route("/api")
def hello():
    return "Why, hello there kind stranger."


@app.route("/api/submit", methods=["POST"])
def submit():

    # Run validation
    contact_form = ContactForm(request.form)
    is_valid = contact_form.validate()
    status_code = 200 if is_valid else 400
    errors = [str(e) for e in contact_form.errors.items()]

    if request.method == "POST" and is_valid:

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
                app.logger.debug("Message sent sucessfully.")

        except Exception as e:
            app.logger.error(e)
            errors.append("Failed to connect to sendgrid.")
            status_code = 500

    return jsonify(request=request.form, errors=errors), status_code
