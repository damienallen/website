from ipware.ip import get_ip
import sendgrid
import requests

from django.shortcuts import render
from django.shortcuts import redirect
from django.http import JsonResponse

from dallen.secret import *
from base.models import Email
from base.forms import ContactForm


# display home page
def index(request):

    context = {
        'form': ContactForm,
    }

    return render(request, 'index.html', context)


# contact form
def contact(request):

    if request.method == 'POST':

        form = ContactForm(data=request.POST)
        ip_address = get_ip(request)

        if form.is_valid():

            name = request.POST.get('name')
            email = request.POST.get('email')
            subject = request.POST.get('subject')
            message = request.POST.get('message')

            sg = sendgrid.SendGridAPIClient(apikey=SENDGRID_KEY)
            from_email = sendgrid.helpers.mail.Email(email)
            subject = '[Contact Form] %s' % subject
            to_email = sendgrid.helpers.mail.Email(CONTACT_EMAIL)
            content = sendgrid.helpers.mail.Content("text/plain", message)
            mail = sendgrid.helpers.mail.Mail(from_email, subject, to_email, content)

            # Captcha check
            r = requests.post(
                'https://www.google.com/recaptcha/api/siteverify',
                data={
                    'secret': RECAPTCHA_SECRET,
                    'response': request.POST.get('g-recaptcha-response', None),
                    'remoteip': ip_address
                }
            )
            print(r.status_code, r.json()['success'])
            if not r.json()['success']:
                return JsonResponse(
                    {
                        'sent': False,
                        'captcha': False,
                        'message': 'Captcha check failed!'
                    },
                    status=400
                )

            # Save email to database
            Email.objects.create(
                name=name,
                email=email,
                subject=subject.replace('[Contact Form] ', ''),
                message=message,
                ip=ip_address
            )

            # Send email
            response = sg.client.mail.send.post(request_body=mail.get())
            print(response.status_code)
            print(response.headers)

            if response.status_code == 200:
                return JsonResponse(
                    {
                        'sent': True,
                        'captcha': True,
                        'message': 'Message delivered!'
                    },
                    status=200
                )

            else:
                return JsonResponse(
                    {
                        'sent': False,
                        'captcha': True,
                        'message': 'Error %s, please try again!' % response.status_code
                    },
                    status=400
                )

        else:
            return JsonResponse(
                {
                    'sent': False,
                    'captcha': None,
                    'message': 'Invalid form input!',
                    'errors': form.errors
                },
                status=400
            )

    else:
        return JsonResponse(
            {
                'sent': False,
                'captcha': None,
                'message': 'Only POST method allowed!'
            },
            status=400
        )
