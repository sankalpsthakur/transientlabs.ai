# Implement

Follow [Plans.md](Plans.md) for the Field Architecture social-cover hosting milestone.

Copy only the three verified 1280×720 sRGB sources into the hash-addressed public paths described in [Architecture.md](Architecture.md). Run the brand-asset check and production build, inspect the exact staged diff, and push only a fast-forward commit. After deployment, verify status, MIME type, dimensions, and SHA-256 from each public URL before handing the URLs to Buffer.

Do not modify site UI, replace existing brand files, or treat a successful local build as proof of a live deployment.
