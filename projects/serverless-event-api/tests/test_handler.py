import json
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from src.handler import quote_order, lambda_handler

class QuoteTests(unittest.TestCase):
    def test_quote(self):
        self.assertEqual(quote_order({"items": [{"sku":"A1","quantity":2,"unit_price_cents":1250}]}),
                         {"currency":"USD","item_count":1,"subtotal_cents":2500})
    def test_empty(self):
        with self.assertRaises(ValueError):
            quote_order({"items":[]})
    def test_bool_not_integer(self):
        with self.assertRaises(ValueError):
            quote_order({"items":[{"sku":"A1","quantity":True,"unit_price_cents":2}]})
    def test_limit(self):
        with self.assertRaises(ValueError):
            quote_order({"items":[{"sku":"A1","quantity":101,"unit_price_cents":2}]})
    def test_handler_success(self):
        response=lambda_handler({"body": json.dumps({"items":[{"sku":"A1","quantity":1,"unit_price_cents":99}]})},None)
        self.assertEqual(response["statusCode"],200)
        self.assertEqual(json.loads(response["body"])["subtotal_cents"],99)
    def test_bad_json(self):
        self.assertEqual(lambda_handler({"body":"not-json"},None)["statusCode"],400)
if __name__=="__main__":
    unittest.main()
