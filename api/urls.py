from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExpenseViewSet
from django.urls import path
from .views import brainchat

urlpatterns = [
    path("api/brainchat/", brainchat),

]
