# See https://docs.djangoproject.com/en/1.9/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '[DJANGO SECRET KEY]'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = [
    'localhost',
    'example.com',
]

# Sendgrid API key
SENDGRID_KEY = '[SENDGRID API KEY]'

# Recaptcha API key
RECAPTCHA_SECRET = '[RECAPTCHA SECRET CODE]'

# Contact details
CONTACT_EMAIL = 'contact@example.com'
