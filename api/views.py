from datetime import datetime
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db.models import Sum
from .models import Expense
from .serializers import ExpenseSerializer

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.queryset = Expense.objects.all().order_by("-created_at")
    serializer_class = ExpenseSerializer

@api_view(["GET"])
def monthly_totals(request):
    """
    /api/summary/?month=2025-09  (YYYY-MM)
    Returns totals by category for that month.
    """
    month = request.GET.get("month")
    if not month:
        month = datetime.utcnow().strftime("%Y-%m")
    year, mon = month.split("-")
    qs = Expense.objects.filter(created_at__year=year, created_at__month=mon)
    agg = (
        qs.values("category")
          .annotate(total=Sum("amount"))
          .order_by("category")
    )
    by_cat = {row["category"]: float(row["total"] or 0) for row in agg}
    month_total = sum(by_cat.values())
    return Response({"month": month, "totalsByCategory": by_cat, "monthTotal": month_total})