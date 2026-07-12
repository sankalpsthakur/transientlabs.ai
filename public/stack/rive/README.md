# Rive assets (icon-scale)

Drop `.riv` files here for lightweight diagrams that should not open a WebGL context.

Suggested:

| File | Use |
|------|-----|
| `orbit-icon.riv` | Module nav / hero chip |
| `rack-icon.riv` | Data center chip |
| `atom-icon.riv` | Nuclear chip |
| `cell-icon.riv` | Batteries chip |
| `car-icon.riv` | Autonomy chip |

Wire via:

```tsx
<StackRiveIcon src="/stack/rive/orbit-icon.riv" label="Orbit" fallback="◎" />
```

Until files exist, `StackRiveIcon` renders a CSS fallback automatically.
