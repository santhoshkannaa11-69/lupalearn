# ADR-001: Knowledge Graph Over Curriculum Tree

## Status

Accepted

## Context

The initial design organized content in a strict tree: Volume → Category → Module → Lesson. This made it difficult to represent concepts that appear across multiple contexts (e.g., "Functions" appears in Python, Java, JavaScript, and many algorithms).

## Decision

Replace the strict tree with a generic Node + Edge graph model. Everything is a node. Relationships are edges.

## Consequences

- Concepts can exist in multiple contexts without duplication
- Graph traversal enables recommendation and path generation
- A simple schema (Node, Edge) is easier to extend than many specialized tables
- Graph queries require recursive traversal or materialized paths
