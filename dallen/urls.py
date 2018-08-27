from django.conf.urls import url, include, static
from django.conf import settings
from django.contrib import admin

urlpatterns = [
    url(r'^', include('base.urls')),
    url(r'^admin/', admin.site.urls),
] + static.static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
