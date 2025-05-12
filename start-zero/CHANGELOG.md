# Changelog

## [Unreleased]

### Added

- Cookie-first authentication for instant, offline-first auth on refresh
- Cross-tab sign-out synchronization using BroadcastChannel API with localStorage fallback

### Changed

- Updated Better Auth configuration to use JWT cookie with 15-minute expiration
- Refactored `_authed/_authed.tsx` to prioritize reading cookies synchronously
- Enhanced sign-out function to properly clear all auth tokens
- Improved cross-tab communication for sign-out events
- Updated login form to work with cookie-based auth instead of manual JWT storage

### Removed

- Completely removed localStorage JWT storage in favor of cookies
- Eliminated all deprecated JWT helper functions
- Removed unused code paths in authentication flow
