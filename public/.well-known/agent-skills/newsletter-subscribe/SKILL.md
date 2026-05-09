# Newsletter Subscribe

Subscribe an email address to the Food·Mood weekly editorial newsletter.

## Tool: subscribe_newsletter

Registers an email for the Food·Mood newsletter — a weekly editorial covering gut-brain science, ferments, longevity, and functional recipes. 17 past editions available in the archive.

## Parameters

| Name   | Type   | Required | Description |
|--------|--------|----------|-------------|
| email  | string | yes      | Valid email address to subscribe |
| source | string | no       | Signup source identifier (defaults to "agent") |

## Endpoint

```
POST https://www.food-mood.app/api/leads
Content-Type: application/json
```

## Request Body

```json
{ "email": "user@example.com", "source": "agent" }
```

## Returns

```json
{ "success": true }
```

## Status Codes

- `200` — Subscribed successfully
- `400` — Invalid email address
- `409` — Email already subscribed
