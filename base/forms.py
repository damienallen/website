from django import forms
from base.models import Email

class ContactForm(forms.ModelForm):

    class Meta:
        model = Email
        fields = ['name', 'email', 'subject', 'message']

        widgets = {
            'name': forms.TextInput(attrs={'placeholder': 'Name', 'class': 'form-input'}),
            'email': forms.TextInput(attrs={'placeholder': 'Email', 'class': 'form-input'}),
            'subject': forms.TextInput(attrs={'placeholder': 'Subject', 'class': 'form-input'}),
            'message': forms.Textarea(attrs={'data-uk-htmleditor': '', 'class': 'form-message'})
        }