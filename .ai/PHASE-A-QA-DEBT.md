# Phase A QA - Technical Debt (MEDIUM Issues)

**Fixed by:** Dex (Developer)
**Date:** 2026-02-07
**Status:** Documented for future sprints

---

## M1. Function parameter rename: `deal_id` -> `p_deal_id`
- **Risk Level:** MEDIUM (LOW actual risk - not used as named params)
- **Issue:** `mark_deal_won`, `mark_deal_lost`, `reopen_deal` renamed params
- **Impact:** No app code uses named params (verified via grep), but external callers or Edge Functions could break
- **Recommendation:** Low priority - monitor for issues, document in API changelog

## M2. `audit_logs_insert` policy uses `WITH CHECK (true)`
- **Risk Level:** MEDIUM
- **Issue:** Authenticated users can INSERT arbitrary rows directly to audit_logs
- **Impact:** Malicious users could pollute audit logs (bypassed by log_audit_event() SECURITY DEFINER anyway)
- **Recommendation:** Add `WITH CHECK (user_id = auth.uid())` or use USING(false) for defense-in-depth
- **Owner:** @data-engineer to add check constraint in Phase D (Data Integrity)

## M3. Rate limiting uses token prefix instead of IP
- **Risk Level:** MEDIUM
- **Issue:** `left(p_token, 12)` means different tokens have separate buckets - attackers rotate through prefixes
- **Impact:** Rate limit can be bypassed by using multiple API keys
- **Recommendation:** Use actual client IP (`x-forwarded-for` header) as identifier in Supabase context
- **Owner:** @architect to review in Phase B (Production Observability)

## M4. `api_key_audit` view has no RLS filtering
- **Risk Level:** MEDIUM
- **Issue:** View joins api_keys and profiles without org_id filter
- **Impact:** Depends on underlying RLS - should work but add defense-in-depth
- **Recommendation:** Add WHERE clause to view: `AND ak.organization_id = public.get_my_organization_id()`
- **Owner:** @data-engineer to add to rotation migration or Phase B

---

## LOW Issues (Optional improvements)

**L1. Type assertions instead of proper RPC typing** - Consider generating Supabase types
**L2. `revoke_expired_api_keys()` has no access control** - Should be `service_role` only
**L3. Pre-commit script `grep -iP` requires GNU grep** - Will fail silently on macOS

---

*All CRITICAL and HIGH issues resolved. MEDIUM issues tracked for Phase B/D.*
