import os
import json
import requests
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings  
from rest_framework import viewsets
from .models import Expense
from .serializers import ExpenseSerializer

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.order_by("-created_at")
    serializer_class = ExpenseSerializer


# api/views.py
import json, requests
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .models import Expense
from .serializers import ExpenseSerializer

MODEL_ID = getattr(settings, "GEMINI_MODEL", "gemini-2.5-flash")  # configurable
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_ID}:generateContent"

@csrf_exempt
def brainchat(request):
    if request.method != "POST":
        return HttpResponseBadRequest("POST only")

    # 1) Parse input safely
    try:
        body = json.loads(request.body.decode("utf-8"))
        user_msg = (body.get("message") or "").strip()
    except Exception as e:
        return HttpResponseBadRequest(f"Invalid JSON: {e}")
    if not user_msg:
        return HttpResponseBadRequest("Message is empty")

    # 2) Build the prompt (✅ this defines `prompt`)
    expenses = Expense.objects.order_by("-created_at")[:250]
    expense_data = ExpenseSerializer(expenses, many=True).data
    prompt = (
        "You are a helpful financial assistant for the 'Budget Brain' app. "
        "Use the expense data when it clearly helps answer the question; "
        "otherwise say you don’t have enough info from the data. "
        "Keep answers concise and practical.\n\n"
        f"Expense Data (JSON): {json.dumps(expense_data, ensure_ascii=False)}\n"
        f'User Question: "{user_msg}"'
    )

    # 3) Key check
    api_key = getattr(settings, "GEMINI_API_KEY", "").strip()
    if not api_key:
        return JsonResponse({
            "reply": "(Gemini unavailable — missing API key.)",
            "meta": {"used_model": MODEL_ID}
        }, status=200)

    # 4) Call Gemini (REST)
    try:
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        r = requests.post(
            GEMINI_URL,
            params={"key": api_key},
            json=payload,
            timeout=20,
        )

        if r.status_code != 200:
            # Log upstream error and return graceful fallback
            print("DEBUG upstream:", r.status_code, r.text[:500])
            return JsonResponse({
                "reply": "(Gemini temporarily unavailable — using fallback.)",
                "meta": {"error": f"{r.status_code} {r.text[:300]}", "used_model": MODEL_ID}
            }, status=200)

        data = r.json()
        reply = (
            data.get("candidates", [{}])[0]
                .get("content", {})
                .get("parts", [{}])[0]
                .get("text", "")
        ).strip() or "(No reply)"

        return JsonResponse({"reply": reply, "meta": {"used_model": MODEL_ID}}, status=200)

    except Exception as e:
        print("DEBUG exception:", e)
        return JsonResponse({
            "reply": "(Gemini temporarily unavailable — using fallback.)",
            "meta": {"error": str(e), "used_model": MODEL_ID}
        }, status=200)
