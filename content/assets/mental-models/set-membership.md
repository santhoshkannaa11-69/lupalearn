# Mental Model: Set as Membership Checklist

A set is fundamentally a **membership test machine**.

```
      ┌─────────────┐
      │   SET       │
      │  {a, b, c}  │
      └──────┬──────┘
             │
      ┌──────▼──────┐
      │ Ask: Is X   │
      │ in the set? │
      └──────┬──────┘
             │
      ┌──────▼──────┐
      │  Yes / No   │
      └─────────────┘
```

## Examples

```
Is 🍎 in {🍎, 🍌, 🍇}? → Yes ✓
Is 🥝 in {🍎, 🍌, 🍇}? → No  ✗
Is 🍌 in {}?            → No  ✗
```

## Why This Mental Model Matters

Everything else about sets (unions, intersections, subsets) builds on this single idea: membership. Once you understand that a set is a yes/no membership checker, all set operations become intuitive.
