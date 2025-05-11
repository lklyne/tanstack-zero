# Changelog

## [Unreleased]

### Added

- Cookie-first authentication for instant, offline-first auth on refresh
- Cross-tab sign-out synchronization using localStorage events

### Changed

- Updated Better Auth configuration to use JWT cookie with 15-minute expiration
- Refactored `_authed/_authed.tsx` to prioritize reading cookies synchronously
- Enhanced sign-out function to properly clear all auth tokens

### Removed

- Deprecated localStorage JWT storage in favor of cookies
