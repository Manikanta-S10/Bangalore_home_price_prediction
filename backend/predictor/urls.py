from django.urls import path
from .views import get_locations, predict_home_price

urlpatterns = [
    path('get_locations/', get_locations, name='get_locations'),
    path('predict_home_price/', predict_home_price, name='predict_home_price'),
    
]