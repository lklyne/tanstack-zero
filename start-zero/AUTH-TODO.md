# Authentication TODO Items

## Future Improvements

1. **Security Enhancements**

   - Add CSRF protection middleware for sensitive mutation endpoints
   - Set appropriate `SameSite` headers for all cookies based on deployment environment
   - Consider adding HTTP-only refresh token for improved security

2. **Offline Edge Cases**

   - Implement stale-while-revalidate pattern for expired cookies while offline
   - Add a grace period for expired tokens in offline mode
   - Handle network reconnection scenarios gracefully

3. **Performance Optimizations**

   - Add server-side helper for SSR routes that need JWT validation
   - Optimize Zero reinitialization to minimize redundant network requests
   - Cache JWT verification results to reduce decoding overhead

4. **Testing**
   - Add automated tests for cookie-based authentication flows
   - Test cross-tab signout in various browser environments
   - Validate refresh latency improvements with metrics
   - Verify browser compatibility, especially for the BroadcastChannel API

## Completed Items

1. **~Complete localStorage Removal~** ✅

   - ~After sufficient testing, completely remove all localStorage JWT storage code~
   - ~Update all references to use cookies exclusively~

2. **~Cross-tab Authentication~** ✅
   - ~Implemented reliable cross-tab signout using BroadcastChannel with localStorage fallback~
   - ~Applied proper cleanup to prevent memory leaks~
