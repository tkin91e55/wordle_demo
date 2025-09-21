from django.urls import path
from .views import index,visit,poll,submit

# multiplayer views and endpoints
urlpatterns = [
    path('', visit, name='index'),
    path('<int:room_size>/', index, name='visit'),
    path('<int:room_size>/room/<str:room_id>/', index, name='join_room'),

    path('api/sync/<str:room_id>/', poll, name='poll'),
    path('api/check_ans_m/', submit, name='check_ans_multi'),
]
