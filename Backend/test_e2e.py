"""
ArthikSetu — End-to-End Test Suite
Tests every API endpoint against a running server (http://localhost:8000).
Run:  python test_e2e.py
"""

import requests
import json
import sys
import os

BASE = "http://localhost:8000"

results = {"passed": 0, "failed": 0, "errors": []}


def _ok(name):
    results["passed"] += 1
    print(f"  [PASS] {name}")


def _fail(name, detail=""):
    results["failed"] += 1
    results["errors"].append(f"{name}: {detail}")
    print(f"  [FAIL] {name} — {detail}")


# ─── 1. Root health check ─────────────────────────────────────────────
def test_root():
    r = requests.get(f"{BASE}/")
    assert r.status_code == 200
    assert "ArthikSetu" in r.json().get("message", "")
    _ok("GET / health check")


# ─── 2. Dashboard ─────────────────────────────────────────────────────
def test_dashboard():
    r = requests.get(f"{BASE}/api/dashboard")
    assert r.status_code == 200
    d = r.json()
    assert "incomeSources" in d
    assert "earningsData" in d
    assert "totalMonthlyIncome" in d
    assert isinstance(d["totalMonthlyIncome"], (int, float))
    _ok("GET /api/dashboard")


# ─── 3. SMS Parsing ───────────────────────────────────────────────────
def test_parse_sms():
    payload = {
        "messages": [
            "Rs 1,200 credited to your a/c XX1234 on 12-Jan-24 by ZOMATO PAYOUT.",
            "Your UPI transaction to Swiggy for Rs.450 is successful"
        ]
    }
    r = requests.post(f"{BASE}/api/parse_sms", json=payload)
    assert r.status_code == 200
    d = r.json()
    assert "transactions" in d
    assert "summary" in d
    assert len(d["transactions"]) > 0
    _ok("POST /api/parse_sms")


# ─── 4. Chat ──────────────────────────────────────────────────────────
def test_chat():
    payload = {"message": "How can I save more?", "session_id": "test_e2e"}
    r = requests.post(f"{BASE}/api/chat", json=payload)
    assert r.status_code == 200
    d = r.json()
    assert "response" in d
    assert len(d["response"]) > 0
    _ok("POST /api/chat")


# ─── 5. Risk prediction ──────────────────────────────────────────────
def test_predict_risk():
    payload = {
        "data": [
            {"date": "2025-01", "amount": 42000},
            {"date": "2025-02", "amount": 38500},
            {"date": "2025-03", "amount": 45200},
            {"date": "2025-04", "amount": 31000},
            {"date": "2025-05", "amount": 36000},
        ]
    }
    r = requests.post(f"{BASE}/api/predict_risk", json=payload)
    assert r.status_code == 200
    d = r.json()
    assert "risk_level" in d
    _ok("POST /api/predict_risk")


# ─── 6. Decode message ───────────────────────────────────────────────
def test_decode_message():
    payload = {"message": "TDS u/s 194J deducted on payment of Rs 5,000 for professional services."}
    r = requests.post(f"{BASE}/api/decode_message", json=payload)
    assert r.status_code == 200
    d = r.json()
    assert "decoded_message" in d
    assert len(d["decoded_message"]) > 0
    _ok("POST /api/decode_message")


# ─── 7. Unified dashboard ────────────────────────────────────────────
def test_unified_dashboard():
    payload = {
        "platform_data": {"Swiggy": 15000, "Zomato": 12000, "Uber": 8000},
        "total_earnings": 35000,
    }
    r = requests.post(f"{BASE}/api/unified_dashboard", json=payload)
    assert r.status_code == 200
    d = r.json()
    assert d["total_earnings"] == 35000
    assert d["platform_count"] == 3
    _ok("POST /api/unified_dashboard")


# ─── 8. Scheme recommender ───────────────────────────────────────────
def test_simplify_scheme():
    payload = {"age": 30, "income": 150000, "occupation": "street vendor"}
    r = requests.post(f"{BASE}/api/simplify_scheme", json=payload)
    assert r.status_code == 200
    d = r.json()
    assert "schemes" in d
    _ok("POST /api/simplify_scheme")


# ─── 9. Recommend schemes ────────────────────────────────────────────
def test_recommend_schemes():
    payload = {"age": 25, "income": 120000, "occupation": "delivery partner"}
    r = requests.post(f"{BASE}/api/recommend_schemes", json=payload)
    assert r.status_code == 200
    d = r.json()
    assert "schemes" in d
    assert "count" in d
    _ok("POST /api/recommend_schemes")


# ─── 10. All schemes ─────────────────────────────────────────────────
def test_all_schemes():
    r = requests.get(f"{BASE}/api/all_schemes")
    assert r.status_code == 200
    d = r.json()
    assert "schemes" in d
    assert len(d["schemes"]) > 0
    _ok("GET /api/all_schemes")


# ─── 11. Loans ────────────────────────────────────────────────────────
def test_loans():
    r = requests.get(f"{BASE}/api/loans")
    assert r.status_code == 200
    d = r.json()
    assert "loans" in d
    assert "user_monthly_income" in d
    _ok("GET /api/loans")


# ─── 12. Tax calculation ─────────────────────────────────────────────
def test_tax_calculation():
    r = requests.get(f"{BASE}/api/tax_calculation")
    assert r.status_code == 200
    d = r.json()
    assert "annual_income" in d
    assert "tax_payable" in d
    assert "taxable_income" in d
    _ok("GET /api/tax_calculation")


# ─── 13. Generate report ─────────────────────────────────────────────
def test_generate_report():
    r = requests.get(f"{BASE}/api/generate_report")
    assert r.status_code == 200
    assert "ARTHIKSETU" in r.text
    _ok("GET /api/generate_report")


# ─── 14. Download report ─────────────────────────────────────────────
def test_download_report():
    r = requests.get(f"{BASE}/api/download_report/annual_2024")
    assert r.status_code == 200
    assert "ARTHIKSETU" in r.text
    _ok("GET /api/download_report/{id}")


# ─── 15. OTP send ────────────────────────────────────────────────────
def test_send_otp():
    payload = {"target": "9876543210", "type": "phone"}
    r = requests.post(f"{BASE}/api/send_otp", json=payload)
    assert r.status_code == 200
    d = r.json()
    assert d["success"] is True
    _ok("POST /api/send_otp (phone)")


# ─── 16. OTP verify ──────────────────────────────────────────────────
def test_verify_otp():
    # First send OTP
    requests.post(f"{BASE}/api/send_otp", json={"target": "9876543210", "type": "phone"})
    # Now verify with demo OTP
    payload = {"target": "9876543210", "type": "phone", "otp": "123456"}
    r = requests.post(f"{BASE}/api/verify_otp", json=payload)
    assert r.status_code == 200
    d = r.json()
    assert d["success"] is True
    _ok("POST /api/verify_otp (demo OTP)")


# ─── 17. OTP verify — wrong code ─────────────────────────────────────
def test_verify_otp_fail():
    requests.post(f"{BASE}/api/send_otp", json={"target": "9000000000", "type": "phone"})
    payload = {"target": "9000000000", "type": "phone", "otp": "000000"}
    r = requests.post(f"{BASE}/api/verify_otp", json=payload)
    assert r.status_code == 200
    d = r.json()
    assert d["success"] is False
    _ok("POST /api/verify_otp — wrong code rejected")


# ─── 18. Privacy: Export earnings ─────────────────────────────────────
def test_export_earnings():
    r = requests.get(f"{BASE}/api/export_earnings")
    assert r.status_code == 200
    d = r.json()
    assert "earnings" in d
    _ok("GET /api/export_earnings")


# ─── 19. Privacy: Privacy settings ───────────────────────────────────
def test_privacy_settings():
    r = requests.get(f"{BASE}/api/privacy_settings")
    assert r.status_code == 200
    d = r.json()
    assert "permissions" in d
    _ok("GET /api/privacy_settings")


# ─── 20. Privacy: Delete all data ────────────────────────────────────
def test_delete_all_data():
    r = requests.delete(f"{BASE}/api/delete_all_data")
    assert r.status_code == 200
    d = r.json()
    assert d["status"] == "deleted"
    _ok("DELETE /api/delete_all_data")


# ─── 21. Add & clear income ──────────────────────────────────────────
def test_add_and_clear_income():
    r = requests.post(f"{BASE}/api/add_income", data={"name": "TestIncome", "amount": 5000, "source": "E2E"})
    assert r.status_code == 200
    d = r.json()
    assert d["status"] == "success"
    _ok("POST /api/add_income")

    r2 = requests.delete(f"{BASE}/api/clear_income")
    assert r2.status_code == 200
    _ok("DELETE /api/clear_income")


# ─── 22. Document verify — no file (expect 422) ──────────────────────
def test_verify_document_no_file():
    r = requests.post(f"{BASE}/api/verify_document")
    assert r.status_code == 422  # missing required file
    _ok("POST /api/verify_document — 422 on missing file")


# ─── Runner ──────────────────────────────────────────────────────────

ALL_TESTS = [
    test_root,
    test_dashboard,
    test_parse_sms,
    test_chat,
    test_predict_risk,
    test_decode_message,
    test_unified_dashboard,
    test_simplify_scheme,
    test_recommend_schemes,
    test_all_schemes,
    test_loans,
    test_tax_calculation,
    test_generate_report,
    test_download_report,
    test_send_otp,
    test_verify_otp,
    test_verify_otp_fail,
    test_export_earnings,
    test_privacy_settings,
    test_delete_all_data,
    test_add_and_clear_income,
    test_verify_document_no_file,
]


def main():
    print("=" * 60)
    print("  ArthikSetu — End-to-End API Test Suite")
    print("=" * 60)
    print()

    for test_fn in ALL_TESTS:
        try:
            test_fn()
        except AssertionError as e:
            _fail(test_fn.__name__, str(e))
        except Exception as e:
            _fail(test_fn.__name__, f"Exception: {e}")

    print()
    print("-" * 60)
    total = results["passed"] + results["failed"]
    print(f"  Results: {results['passed']}/{total} passed, {results['failed']} failed")
    if results["errors"]:
        print()
        for err in results["errors"]:
            print(f"  ✗ {err}")
    print("-" * 60)
    return 0 if results["failed"] == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
