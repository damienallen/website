from django.contrib import admin
from base.models import Email

# Register email model
@admin.register(Email)
class EmailAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'email',
        'subject',
        'ip',
        'timestamp',
    )
    readonly_fields = (
        'id',
        'name',
        'email',
        'subject',
        'message',
        'ip',
        'timestamp',
    )
