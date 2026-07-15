# Set Operations

## One Sentence
Set operations combine sets to produce new sets — union (∪), intersection (∩), difference (−), and complement (′).

## Why Should Someone Care?
SQL databases run on set operations. Every time you write UNION or JOIN in SQL, you're using set operations. They're also the foundation of Boolean logic and search algorithms.

## Teaching Goals
**Know:** ∪, ∩, −, ′ symbols and their meanings
**Do:** Compute the union, intersection, and difference of two sets
**Stop believing:** That set operations are abstract math with no practical use

## Best Analogy
⭐⭐⭐⭐⭐ **Two Circles (Venn)**
Union = everything in either circle
Intersection = only the overlapping part
Difference = what's in the first but not the second
Complement = everything outside

## Visual Ideas
ASCII Venn diagrams for each operation

## Common Mistakes
- Confusing union (∪) with intersection (∩)
- Thinking A − B = B − A (it's not!)
- Forgetting the universal set exists for complement

## Quiz Ideas
1. If A={1,2,3}, B={3,4,5}, what is A∪B?
2. What is A∩B from the same sets?
3. What is A−B?
4. Is A−B the same as B−A?

## Future Connections
→ Venn diagrams (visualizing operations)
→ SQL JOIN, UNION, INTERSECT, EXCEPT
→ Boolean logic (AND=∩, OR=∪, NOT=′)
→ Probability (union = "or", intersection = "and")
