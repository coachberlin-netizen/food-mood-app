# Recipe Search

Search Food·Mood functional recipes by emotional state or ingredient keyword.

## Tool: search_recipes

Queries the Food·Mood recipe database for functional recipes grounded in gut-brain science. Each recipe targets a specific emotional state through documented biochemical mechanisms (serotonin precursors, GABA support, dopamine regulation, etc.).

## Parameters

| Name  | Type   | Required | Description |
|-------|--------|----------|-------------|
| mood  | string | no       | Emotional state: ansiedad, calma, energía, foco, sueño, confort, activación, reset |
| q     | string | no       | Free-text ingredient or keyword search |

## Endpoint

```
GET https://www.food-mood.app/api/recetas
```

Query parameters: `mood`, `q`, `premium_level` (0 = free tier)

## Returns

Array of recipe objects. Each entry includes name, description, mood tags, biochemical rationale, and ingredient list.

## Example

```
GET /api/recetas?mood=ansiedad
```

Returns anti-anxiety recipes featuring tryptophan-rich ingredients, curcumin, GABA precursors, and fermented foods that support the gut-brain axis.
