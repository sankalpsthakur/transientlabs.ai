# Prompt

## Goal

Provide stable, user-owned public URLs for the three fresh Field Architecture social covers so Buffer can replace legacy slide-card media without relying on expiring or third-party links.

## Deliverables

- Three immutable 1280×720 sRGB PNGs under `public/brand/social/field-architecture/2026/`.
- Hash-derived filenames that will never be overwritten.
- A clean production build and live HTTP `200 image/png` verification before the URLs are used downstream.

## Constraints

- Do not alter any page, route, component, layout, or existing brand asset.
- Keep the files unlinked from the site UI; they are direct media assets only.
- Treat site deployment, Buffer draft mutation, and social publication as separate proof gates.
