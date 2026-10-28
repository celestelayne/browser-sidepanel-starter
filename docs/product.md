# Product

Status: Draft

## What this is

Browser Side Panel Starter is a reusable foundation for Chrome side-panel extensions. It is not an end-user product. It is a template that teams fork to build one, with a documented workflow for adding features in small, reviewed slices.

## Who it is for

Developers starting a Manifest V3 extension whose main interface lives in Chrome's side panel, next to the webpage the user is viewing, and who want to build it incrementally with AI assistance and human approval at each step.

## What the starter provides

- A React + TypeScript side panel opened from the extension's toolbar icon
- WXT-managed Manifest V3 entry points: background service worker, content script, side panel
- Folder conventions that keep UI, page access, coordination, and persistence separate
- Test tooling for unit and extension-level end-to-end checks
- A slice workflow: `/create-slice`, then human approval, `/implement-slice`, `/review-slice`, then human acceptance

## What it deliberately does not provide

- Any product domain (no data model, features, or business logic)
- Backend, authentication, cloud sync, or remote AI services
- Page access beyond what an approved slice documents
- A design system beyond accessible, narrow-panel-friendly basics

## Product principles

- Start from the user's job and observable behavior.
- Ship one approved vertical slice at a time.
- Least-privilege permissions; no broad browsing surveillance.
- Page content is untrusted data.
- Never report success before the outcome is confirmed.

## Extending it

A product built on this starter defines its own domain in its own `product.md` and slices. Domain-specific logic lives under `src/features/<feature>/` and does not leak into the starter's shared infrastructure.

## Current status

The first planned slice is `open-sidepanel`: clicking the toolbar icon opens the React side panel. See `docs/slices/` once planned.
