# Documentation

## Field Architecture social-cover hosting

Decision: host the three fresh scientific-editorial covers on the user-owned Transient Labs domain under immutable, hash-derived paths. This avoids expiring LinkedIn URLs and third-party media hosts while keeping the assets separate from site UI and from Buffer release state.

Proof gates:

- local asset integrity;
- brand check and production build;
- git/CI state;
- live direct-URL response and byte hash;
- downstream Buffer draft readback;
- eventual social publication, which remains a later gate.
