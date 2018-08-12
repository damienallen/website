from django.shortcuts import render
from django.core.mail import send_mail
from django.shortcuts import redirect
from django.template import Context
from django.template.loader import get_template
from ipware.ip import get_ip

import sendgrid
from sendgrid.helpers.mail import *

from base.forms import ContactForm


# display home page
def index(request):

    form_class = ContactForm

    ip = get_ip(request)
    if ip is not None:
        print(ip)
    else:
        print("we don't have an IP address for user")

    # build context object
    context = {
        'form': form_class,
    }

    return render(request, 'base/index.html', context)


# contact form
def contact(request):

    form_class = ContactForm

    if request.method == 'POST':

        form = form_class(data=request.POST)

        if form.is_valid():

            print(request.POST.get('g-recaptcha-response'))

            name = request.POST.get('name')
            email = request.POST.get('email')
            subject = request.POST.get('subject')
            message = request.POST.get('message')

            sg = sendgrid.SendGridAPIClient(apikey='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')
            from_email = Email(email)
            subject = '[Contact Form] %s' % subject
            to_email = Email('contact@dallen.co')
            content = Content("text/plain", message)
            mail = Mail(from_email, subject, to_email, content)
            response = sg.client.mail.send.post(request_body=mail.get())
            print(response.status_code)
            print(response.body)
            print(response.headers)

        else:
            print('Form validation failed')

    else:
        print('Only POST allowed')

    return redirect('index')
