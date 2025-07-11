# backend/eco.py

from difflib import get_close_matches
import re

# Core action map (normalized behavior → kg CO₂ saved/emitted per 30 mins or per action)
action_map = {
    "bike commute": 2.0,
    "biking": 2.0,
    "walking": 1.2,
    "recycling": 0.4,
    "recycled": 0.4,
    "cold laundry": 0.6,
    "used public transport": 1.8,
    "transit": 1.5,
    "composting": 0.7,
    "led lighting": 0.3,
    "vegetarian": 1.8,
    "vegetarian meal": 1.5,
    "shower skip": 1.1,
    "skipped shower": 1.2,
    "solar": 6.5,
    "reused bag": 0.2,
    "manual lawn care": 1.0,
    "telework": 2.5
}

# Negative behaviors override
critical_negatives = {
    "drive": -2.2,
    "driving": -2.2,
    "car": -2.2,
    "gasoline": -2.5,
    "fly": -90.0,
    "flight": -90.0,
    "air travel": -90.0,
    "long shower": -1.4,
    "meat": -2.0,
    "beef": -3.0,
    "plastic": -1.0,
    "fast food": -1.5,
    "uber": -2.0,
    "rideshare": -2.0
}

def normalize(text: str) -> str:
    return text.strip().lower()

def estimate_savings(action: str, duration_minutes: int = 30) -> float:
    normalized = normalize(action)
    words = re.findall(r'\w+', normalized)  # tokenized words

    # Step 1: Check for any critical negative keyword
    for key in critical_negatives:
        if key in normalized or key in words:
            return round(critical_negatives[key] * (duration_minutes / 30), 2)

    # Step 2: Exact match
    if normalized in action_map:
        return round(action_map[normalized] * (duration_minutes / 30), 2)

    # Step 3: Substring match
    for key in action_map:
        if key in normalized:
            return round(action_map[key] * (duration_minutes / 30), 2)

    # Step 4: Fuzzy match
    close = get_close_matches(normalized, action_map.keys(), n=1, cutoff=0.7)
    if close:
        return round(action_map[close[0]] * (duration_minutes / 30), 2)

    # Step 5: Default fallback
    return round(0.1 * (duration_minutes / 30), 2)

def equivalent_impact(kg_co2: float):
    phone_charges = int(abs(kg_co2) / 0.005)
    miles_not_driven = round(abs(kg_co2) / 0.251, 1)
    return phone_charges, miles_not_driven

def suggest_new_habit(user_actions: list[str]) -> str:
    lower_actions = [a.activity.lower() for a in user_actions]

    if not any("bike" in a or "biking" in a for a in lower_actions):
        return "Try biking instead of driving on a trip this week!"
    elif not any("vegetarian" in a or "plant-based" in a for a in lower_actions):
        return "Replace one meat-based meal with a vegetarian option!"
    elif not any("transit" in a or "bus" in a or "train" in a for a in lower_actions):
        return "Try to take public transit for your next commute!"
    elif not any("cold laundry" in a or "cold wash" in a for a in lower_actions):
        return "Try to use cold water for your next laundry load!"
    else:
        return "Keep going! Every action makes a difference 🌍"