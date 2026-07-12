# Physical Stack — module experiences

Each agent owns **exactly one** directory. Do not edit sibling modules or shared shell files.

| Dir | Module | Accent |
|-----|--------|--------|
| `satellites/` | LEO Constellations | `#7EA2FF` |
| `data-centers/` | Hyperscale Data Centers | `#E8A87C` |
| `nuclear/` | Nuclear / SMR | `#5CE1A8` |
| `batteries/` | Battery Gigafactories | `#F0C75E` |
| `autonomous-vehicles/` | Autonomous Vehicles | `#C4A1FF` |

## Required export

Each folder must export from `index.tsx`:

```tsx
export function ModuleExperience(props: ModuleExperienceProps): JSX.Element
```

Props: `{ progress: MotionValue<number>, accent?: string, reduced?: boolean, className?: string }`

Use shared helpers from `@/components/stack/webgl`.
