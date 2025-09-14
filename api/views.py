import os
import json
import requests
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings  

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

@csrf_exempt
def brainchat(request):
    if request.method != "POST":
        return HttpResponseBadRequest("POST only")

    key = settings.GEMINI_API_KEY
    if not key:
        return HttpResponseBadRequest("Missing Gemini API key")

    try:
        body = json.loads(request.body.decode("utf-8"))
        user_msg = (body.get("message") or "").strip()
    except Exception:
        return HttpResponseBadRequest("Invalid JSON")

    if not user_msg:
        return HttpResponseBadRequest("Message is empty")

    payload = {
        "contents": [
            {"parts": [{"text": user_msg}]}
        ]
    }

    r = requests.post(GEMINI_URL, params={"key": key}, json=payload, timeout=20)
    if r.status_code != 200:
        return JsonResponse({"error": r.text}, status=r.status_code)

    data = r.json()
    reply = ""
    try:
        reply = data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception:
        reply = "(No reply)"

    return JsonResponse({"reply": reply})
