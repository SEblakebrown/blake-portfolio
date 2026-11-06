"""Example serverless order quote handler. No external Python packages required."""
import json
from decimal import Decimal, InvalidOperation

MAX_ITEMS = 25
MAX_QUANTITY = 100
MAX_UNIT_CENTS = 1_000_000

def quote_order(payload):
    """Return an integer-cent quote. Reject malformed or out-of-range input."""
    if not isinstance(payload, dict):
        raise ValueError("Request must be a JSON object")
    items = payload.get("items")
    if not isinstance(items, list) or not (1 <= len(items) <= MAX_ITEMS):
        raise ValueError("items must contain 1–25 entries")
    subtotal = 0
    for item in items:
        if not isinstance(item, dict):
            raise ValueError("Each item must be an object")
        sku = item.get("sku")
        qty = item.get("quantity")
        cents = item.get("unit_price_cents")
        if not isinstance(sku, str) or not (1 <= len(sku.strip()) <= 40):
            raise ValueError("Each SKU must be 1–40 characters")
        if type(qty) is not int or not (1 <= qty <= MAX_QUANTITY):
            raise ValueError("quantity must be an integer between 1 and 100")
        if type(cents) is not int or not (0 <= cents <= MAX_UNIT_CENTS):
            raise ValueError("unit_price_cents must be an integer between 0 and 1000000")
        subtotal += qty * cents
    return {"currency": "USD", "item_count": len(items), "subtotal_cents": subtotal}

def lambda_handler(event, context):
    try:
        raw = event.get("body", "{}") if isinstance(event, dict) else "{}"
        if isinstance(raw, str):
            payload = json.loads(raw)
        elif isinstance(raw, dict):
            payload = raw
        else:
            raise ValueError("body must be a JSON object")
        result = quote_order(payload)
        return {"statusCode": 200, "headers": {"content-type": "application/json"},
                "body": json.dumps(result)}
    except (ValueError, TypeError, json.JSONDecodeError) as exc:
        return {"statusCode": 400, "headers": {"content-type": "application/json"},
                "body": json.dumps({"error": str(exc)})}
