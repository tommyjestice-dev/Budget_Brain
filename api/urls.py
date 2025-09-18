from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExpenseViewSet, brainchat

router = DefaultRouter()
router.register(r"expenses", ExpenseViewSet, basename="expense")

urlpatterns = [
    path("", include(router.urls)),          
    path("brainchat/", brainchat, name="brainchat"),
]
