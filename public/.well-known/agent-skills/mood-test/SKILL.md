# Mood Test

Navigate the user to the Food·Mood 30-second emotional state quiz.

## Tool: start_mood_test

Sends the user to the Food·Mood emotional quiz — an 8-step test that identifies a dominant emotional state from 6 categories (Activación, Calma, Focus, Social, Reset, Confort) and generates a personalised functional recipe recommendation.

## Parameters

None required.

## Endpoint

```
GET https://www.food-mood.app/test
```

## Returns

Navigation to the quiz page. On completion, returns the user's emotional palette and a tailored recipe recommendation based on gut-brain science.

## Notes

- Quiz takes approximately 30 seconds
- Results include a percentage breakdown of emotional states (e.g. 60% calma, 25% melancolía, 15% curiosidad)
- Free tier: 1 sample recipe. Premium tier: full recipe library of 200+.
