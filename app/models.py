from wtforms import Form, StringField, validators


class ContactForm(Form):
    name = StringField("Name", [validators.Length(min=1, max=30)])
    email = StringField("Email", [validators.Length(min=5, max=30), validators.Email()])
    subject = StringField("Subject", [validators.Length(min=1, max=100)])
    message = StringField("Message", [validators.Length(min=5, max=2000)])
    check = StringField("Check")
