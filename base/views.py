from django.shortcuts import render


# display home page
def index(request):

    test = ''

    # build context object
    context = {
        'test': test,
    }

    return render(request, 'base/index.html', context)
