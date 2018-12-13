from django.shortcuts import render

# Create your views here.

from django.http import HttpResponse

import json
from django.template.loader import get_template
from django.http import HttpResponse


def index(request):

    t = get_template('../templates/base.html')
    with open('receipes/data.json',encoding="utf8") as f:
        data = json.load(f)
    i = 0
    arr_title = []
    for list in data:
        arr_title.append(list)
        i = i+1
    html = t.render({'title': arr_title})
    return HttpResponse(html)

def detail(request, receipId):
    #text = "Displaying article Number : %s" %receipId
    t = get_template('../templates/detail.html')
    with open('receipes/data.json',encoding="utf8") as f:
        data = json.load(f)
    i = 0
    arr_title = []
    for list in data:
        arr_title.append(list)
        i = i + 1
    array = []
    for arr in arr_title:
        if int(arr['id']) == receipId:
            array.append(arr)
    html = t.render({'title': array,'r_id': receipId})
    return HttpResponse(html)





