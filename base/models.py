from django.db import models
from django.utils import timezone

# Create your models here.
class Email(models.Model):

    name = models.CharField(max_length=25)
    email = models.EmailField()
    subject = models.CharField(max_length=50)
    message = models.TextField(max_length=5000)

    ip = models.GenericIPAddressField()
    timestamp = models.DateTimeField(default=timezone.now)