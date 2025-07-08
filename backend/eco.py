# backend/eco.py

from typing import List

# CO₂ impact in kg per 30 minutes or per action
ECO_ACTIONS = {
    "biking": 2.6,
    "walking": 1.8,        
    "public transport": 1.5,
    "cold laundry": 0.5,
    "line drying": 0.7,
    "short shower": 1.0,
    "skipped shower": 1.4,
    "recycling": 0.3,
    "composting": 0.8,
    "solar": 7.5,
    "led lighting": 0.3,
    "vegetarian meal": 2.0,
    "vegan meal": 2.6,
    "reused item": 0.4,
    "repaired": 0.6,
    "turning off lights": 0.2,
    "unplugged electronics": 0.3,
}

EMISSION_ACTIONS = {
    "driving": -3.6,
    "car ride": -3.6,
    "uber": -3.6,
    "lyft": -3.6,
    "gasoline use": -3.5,
    "flying": -12.0,
    "air travel": -12.0,
    "long shower": -1.2,
    "plastic bag": -0.3,
    "fast fashion": -2.5,
    "meat meal": -3.0,
    "forgot recycling": -0.5,
}

def normalize(text: str) -> str:
    return text.lower().strip()

def estimate_savings(action: str, duration_minutes: int = 30) -> float:
    action = normalize(action)

    for key in ECO_ACTIONS:
        if key in action:
            return round(ECO_ACTIONS[key] * (duration_minutes / 30), 2)

    for key in EMISSION_ACTIONS:
        if key in action:
            return round(EMISSION_ACTIONS[key] * (duration_minutes / 30), 2)

    ambiguous = ["school", "homework", "study", "work", "class", "meeting"]
    if any(word in action for word in ambiguous):
        return 0.0

    # Default fallback
    return round(0.0, 2)

def suggest_new_habit(user_actions: List[str]) -> str:
    lowered = [normalize(a) for a in user_actions]
    suggestions = []

    if not any("bike" in a or "walk" in a for a in lowered):
        suggestions.append("Try biking or walking instead of driving once this week.")

    if not any("vegetarian" in a or "vegan" in a for a in lowered):
        suggestions.append("Swap one meat-based meal for a plant-based alternative.")

    if not any("cold laundry" in a for a in lowered):
        suggestions.append("Wash a load of laundry with cold water.")

    if not any("recycling" in a or "composting" in a for a in lowered):
        suggestions.append("Sort your recycling or start composting food scraps.")

    if not suggestions:
        return "You're doing great! Keep up the sustainable habits. 🌍"

    return suggestions[0]
