# Architecture

## Public social-media assets

Static social-media files live below `public/brand/social/` and are served directly from the site root. Campaign-specific assets use a topic/year hierarchy and hash-derived filenames:

`public/brand/social/<series>/<year>/<semantic-name>-<hash-prefix>.png`

This provides stable HTTPS URLs that media consumers can fetch without authentication. The hash suffix makes every path immutable by convention: updates must create a new filename, never replace an existing file.

The Field Architecture covers are media-only resources. They do not enter the application component tree, metadata defaults, page layout, or navigation.
