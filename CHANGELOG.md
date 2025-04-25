# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The format is inspired by, but not limited to, [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [[1.0.4](https://github.com/alexander-krjuchkov/random-ip-in-subnet/compare/v1.0.3...v1.0.4)] - 2025-04-25

### Changed

- **Documentation:** Clarify project purpose and unique aspects, remove redundancy, improve overall structure and readability.
- **Internal improvements:** Fix typos in test descriptions (no changes to test logic).

## [[1.0.3](https://github.com/alexander-krjuchkov/random-ip-in-subnet/compare/v1.0.2...v1.0.3)] - 2025-03-17

### Changed

- **Internal improvements:** Update all development dependencies to their latest versions.

## [[1.0.2](https://github.com/alexander-krjuchkov/random-ip-in-subnet/compare/v1.0.1...v1.0.2)] - 2025-03-04

### Changed

- **Documentation:** Clarify the changelog entries.

## [[1.0.1](https://github.com/alexander-krjuchkov/random-ip-in-subnet/compare/v1.0.0...v1.0.1)] - 2025-02-22

### Changed

- **Documentation:** Minor improvements to make the documentation more user-friendly.

## [[1.0.0](https://github.com/alexander-krjuchkov/random-ip-in-subnet/compare/v0.2.2...v1.0.0)] - 2025-02-22

### Added

- **Documentation:**
  - Add changelog to the project, including historical entries for all versions (0.1.0 to 1.0.0).
  - Make inline code documentation available to library users.
- **Error handling:** Introduce `ValidationError` class for library-specific exceptions.

### Changed

- **Breaking changes:** Refactor public API function names for clarity and future IPv6 support:
  - Rename `getRandomIpInSubnet` to `getRandomIPv4InSubnet`.
  - Rename `getRandomIpInSubnets` to `getRandomIPv4FromSubnetList`.
- **Internal improvements:**
  - Conduct extensive internal refactoring for better maintainability.
  - Improve testing to achieve 100% coverage of significant code.

### Fixed

- **Behavior:** Fix IP address generation for CIDR notations with non-zero host bits. Previously, for notations like `192.0.2.128/24`, the library incorrectly generated addresses from `192.0.2.128` to `192.0.2.255`. Now, it correctly ignores the host bits in the IP address and generates addresses from `192.0.2.1` to `192.0.2.254` (excluding network/broadcast addresses), consistent with the standard network address `192.0.2.0/24`.

## [[0.2.2](https://github.com/alexander-krjuchkov/random-ip-in-subnet/compare/v0.2.1...v0.2.2)] - 2025-02-14

### Added

- **Testing:** New test suites:
  - **Randomized invariant testing:** Ensure the basic guarantees of random results.
  - **PRNG backward compatibility tests:** Verify output stability with fixed-seed PRNG.
  - **Statistical testing:** Validate uniform distribution of results.
- **Documentation:** Expand project roadmap.

### Changed

- **Internal improvements:** Standardize code style with ESLint and Prettier.

### Fixed

- **Documentation:** Correct random number generation example to ensure uniform distribution for all subnets (including `/0`). Replaced `generateFloat32` with `generateFloat64` from `pure-rand` documentation to avoid precision issues in edge cases.

## [[0.2.1](https://github.com/alexander-krjuchkov/random-ip-in-subnet/compare/v0.2.0...v0.2.1)] - 2025-02-09

### Added

- **Documentation:**
  - Add project roadmap.
  - Expand documentation with usage guides and feature overviews.

## [[0.2.0](https://github.com/alexander-krjuchkov/random-ip-in-subnet/compare/cbdb233...v0.2.0)] - 2025-01-11

### Added

- **Compatibility:** Add CommonJS module support, ensuring compatibility with both CommonJS and ECMAScript modules.

### Changed

- **Internal improvements:** Document the development and build processes.

## [[0.1.5](https://github.com/alexander-krjuchkov/random-ip-in-subnet/compare/d95b6eb...cbdb233)] - 2024-12-03

### Changed

- **Internal improvements:** Automate the build process.

## [[0.1.4](https://github.com/alexander-krjuchkov/random-ip-in-subnet/compare/0f49287...d95b6eb)] - 2024-12-03

### Fixed

- **Internal improvements:** Align version metadata across package configuration files.

## [[0.1.3](https://github.com/alexander-krjuchkov/random-ip-in-subnet/compare/536da93...0f49287)] - 2024-11-23

### Added

- **Internal improvements:** Add repository URL to package metadata.

## [[0.1.2](https://github.com/alexander-krjuchkov/random-ip-in-subnet/commit/536da9355022ea7ab785750a88577898ad5bb004)] - 2024-11-22

### Added

- **Documentation:** Add minimal README with usage example.
- **Internal improvements:** Initialize Git version control.

## [0.1.1] - 2024-11-22

### Changed

- **Internal improvements:** Configure build output to include only production artifacts.

## [0.1.0] - 2024-11-22

### Added

- **Initial release:** First public release of the library.
