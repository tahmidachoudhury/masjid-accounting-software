"""
Domain rule tests — these are the spec.
Each test names the rule it enforces so failures read as spec violations.
"""


def _cause(client, name="Test Cause", allowed_types=None, target=None):
    body = {"name": name, "allowed_types": allowed_types or []}
    if target:
        body["target_pence"] = target
    return client.post("/causes", json=body).json()


def _donate(client, amount=10_000, dtype="sadaqah", cause_id=None, source="manual"):
    body = {"amount_pence": amount, "donation_type": dtype, "source": source}
    if cause_id:
        body["cause_id"] = cause_id
    return client.post("/donations", json=body)


# ── Uncategorised exclusion ────────────────────────────────────────────────

def test_uncategorised_excluded_from_balances(client):
    resp = _donate(client, dtype="uncategorised", source="bulk_import")
    assert resp.status_code == 201

    balances = client.get("/balances").json()["balances"]
    assert all(b["donation_type"] != "uncategorised" for b in balances)


def test_uncategorised_excluded_from_cause_progress(client):
    cause = _cause(client, target=100_000)
    cid = cause["id"]

    _donate(client, amount=50_000, dtype="general", cause_id=cid)
    _donate(client, amount=10_000, dtype="uncategorised", cause_id=cid, source="bulk_import")

    progress = client.get(f"/causes/{cid}/progress").json()
    assert progress["raised_pence"] == 50_000


# ── Cause allowed_types enforcement ───────────────────────────────────────

def test_allowed_types_rejects_disallowed_type(client):
    cause = _cause(client, allowed_types=["sadaqah"])
    resp = _donate(client, dtype="zakat", cause_id=cause["id"])
    assert resp.status_code == 422
    assert "allowed" in resp.json()["detail"].lower()


def test_allowed_types_accepts_allowed_type(client):
    cause = _cause(client, allowed_types=["sadaqah"])
    resp = _donate(client, dtype="sadaqah", cause_id=cause["id"])
    assert resp.status_code == 201


def test_empty_allowed_types_accepts_any_type(client):
    cause = _cause(client, allowed_types=[])
    for dtype in ("zakat", "sadaqah", "lillah", "general"):
        resp = _donate(client, dtype=dtype, cause_id=cause["id"])
        assert resp.status_code == 201, f"Expected 201 for {dtype}"


# ── No fund commingling ────────────────────────────────────────────────────

def test_each_type_has_separate_balance(client):
    _donate(client, amount=10_000, dtype="zakat")
    _donate(client, amount=2_000, dtype="sadaqah")
    _donate(client, amount=5_000, dtype="general")

    by_type = {b["donation_type"]: b["amount_pence"] for b in client.get("/balances").json()["balances"]}
    assert by_type["zakat"] == 10_000
    assert by_type["sadaqah"] == 2_000
    assert by_type["general"] == 5_000


def test_zakat_balance_does_not_include_sadaqah(client):
    _donate(client, amount=10_000, dtype="zakat")
    _donate(client, amount=99_000, dtype="sadaqah")

    by_type = {b["donation_type"]: b["amount_pence"] for b in client.get("/balances").json()["balances"]}
    assert by_type["zakat"] == 10_000


# ── Integer pence enforcement ──────────────────────────────────────────────

def test_float_amount_rejected(client):
    resp = client.post("/donations", json={"amount_pence": 100.50, "donation_type": "sadaqah", "source": "manual"})
    assert resp.status_code == 422


def test_zero_amount_rejected(client):
    resp = _donate(client, amount=0)
    assert resp.status_code == 422


def test_negative_amount_rejected(client):
    resp = _donate(client, amount=-500)
    assert resp.status_code == 422


# ── Reclassify flow ────────────────────────────────────────────────────────

def test_reclassify_moves_donation_into_balances(client):
    resp = _donate(client, amount=50_000, dtype="uncategorised", source="bulk_import")
    donation_id = resp.json()["id"]

    # Not in balances yet
    before = {b["donation_type"] for b in client.get("/balances").json()["balances"]}
    assert "uncategorised" not in before

    patch_resp = client.patch(f"/donations/{donation_id}", json={"donation_type": "sadaqah"})
    assert patch_resp.status_code == 200
    assert patch_resp.json()["donation_type"] == "sadaqah"

    after = {b["donation_type"]: b["amount_pence"] for b in client.get("/balances").json()["balances"]}
    assert after["sadaqah"] == 50_000


def test_reclassify_already_classified_is_rejected(client):
    resp = _donate(client, dtype="sadaqah")
    donation_id = resp.json()["id"]

    patch_resp = client.patch(f"/donations/{donation_id}", json={"donation_type": "general"})
    assert patch_resp.status_code == 422


# ── Cause progress ─────────────────────────────────────────────────────────

def test_cause_progress_sums_correctly(client):
    cause = _cause(client, target=1_000_000)
    cid = cause["id"]

    _donate(client, amount=25_000, dtype="general", cause_id=cid)
    _donate(client, amount=15_000, dtype="sadaqah", cause_id=cid)

    progress = client.get(f"/causes/{cid}/progress").json()
    assert progress["raised_pence"] == 40_000
    assert progress["target_pence"] == 1_000_000
    assert progress["percentage"] == 4.0


def test_cause_progress_no_target(client):
    cause = _cause(client)
    _donate(client, amount=5_000, dtype="general", cause_id=cause["id"])

    progress = client.get(f"/causes/{cause['id']}/progress").json()
    assert progress["raised_pence"] == 5_000
    assert progress["target_pence"] is None
    assert progress["percentage"] is None
