# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The format is inspired by, but not limited to, [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [[0.2.2](https://github.com/alexander-krjuchkov/random-ip-in-subnet/compare/v0.2.1...v0.2.2)] - 2025-02-14

### Added

- **Testing:** Add new tests:
  - **Randomized invariant testing:** verifies the basic guarantees of random results.
  - **PRNG backward compatibility tests:** verifies the stability of the outputs when using a PRNG with a fixed seed.
  - **Statistical testing:** analyzes the statistical characteristics of the random results.
- **Documentation:** Expand the project roadmap with library development plans.

### Changed

- **Internal improvements:** Improve code quality using ESLint and Prettier.

## [[0.2.1](https://github.com/alexander-krjuchkov/random-ip-in-subnet/compare/v0.2.0...v0.2.1)] - 2025-02-09

### Added

- **Documentation:** Add the project roadmap.
- **Documentation:** Significantly expand the project documentation to provide a clear and comprehensive overview of the library's functionality, purpose, and key features.

## [[0.2.0](https://github.com/alexander-krjuchkov/random-ip-in-subnet/compare/cbdb233...v0.2.0)] - 2025-01-11

### Added

- **Compatibility:** Add CommonJS support, ensuring compatibility with both CommonJS and ECMAScript modules.

### Changed

- **Internal improvements:** Document development and build processes.

## [[0.1.5](https://github.com/alexander-krjuchkov/random-ip-in-subnet/compare/d95b6eb...cbdb233)] - 2024-12-03

### Changed

- **Internal improvements:** Automate the build process.

## [[0.1.4](https://github.com/alexander-krjuchkov/random-ip-in-subnet/compare/0f49287...d95b6eb)] - 2024-12-03

### Changed

- **Internal improvements:** Ensure version consistency between package.json and package-lock.json.

## [[0.1.3](https://github.com/alexander-krjuchkov/random-ip-in-subnet/compare/536da93...0f49287)] - 2024-11-23

### Changed

- **Internal improvements:** Update package metadata (add repository link to package.json).

## [[0.1.2](https://github.com/alexander-krjuchkov/random-ip-in-subnet/commit/536da9355022ea7ab785750a88577898ad5bb004)] - 2024-11-22

### Added

- **Documentation:** Add a minimal README with a brief overview and usage example.

### Changed

- **Internal improvements:** Initialize version control with Git.

## [0.1.1] - 2024-11-22

### Changed

- **Internal improvements:** Fix build configuration to publish only the dist folder.

## [0.1.0] - 2024-11-22

### Added

- **Initial release:** First public release of the library.
