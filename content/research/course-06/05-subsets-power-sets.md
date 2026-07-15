# Subsets & Power Sets

## One Sentence
A set A is a subset of B if every element of A is also in B; the power set of a set is the set of all possible subsets.

## Why Should Someone Care?
Subsets define hierarchies (every cat is an animal), type systems (every String is an Object), and database relationships. Power sets help understand combinations and are used in algorithms, AI search spaces, and probability.

## Teaching Goals
**Know:** Definition of subset (⊆), proper subset (⊂), power set, cardinality of power set (2^n)
**Do:** Determine if one set is a subset of another, list the power set of small sets
**Stop believing:** That the empty set doesn't count as a subset

## Best Analogy
⭐⭐⭐⭐ **Russian Nesting Dolls**
Each smaller doll fits inside a larger one — that's a subset relationship. The complete collection of all possible nesting combinations is the power set.

## Visual Ideas
```
A = {1, 2}
Subsets of A: {}, {1}, {2}, {1, 2}
```

## Common Mistakes
- Forgetting that ∅ is a subset of every set
- Thinking A ⊆ B means A is smaller (size isn't the only factor)
- Confusing ⊆ (subset) with ∈ (element of)

## Quiz Ideas
1. Is {1, 2} ⊆ {1, 2, 3}?
2. Is ∅ ⊆ {1, 2, 3}?
3. How many subsets does {a, b, c} have?
4. Is {1} ⊆ {1} ? (yes — every set is a subset of itself)

## Challenge Ideas
1. Given a set of 4 elements, list all subsets
2. Write a function to generate the power set
3. Given two sets, determine if one is a subset of the other

## Future Connections
→ Probability (sample spaces)
→ Type theory (subtypes)
→ Algorithms (search spaces)
→ Boolean algebra (subsets = logical implications)
