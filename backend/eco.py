# backend/eco.py

action_map = {
    "bike commute": 2.0,
    "vegetarian meal": 1.5,
    "recycled": 0.5,
    "cold laundry": 0.6,
    "skipped shower": 1.2,
    "used public transport": 1.8
}

def estimate_savings(description: str) -> float:
    for key, value in action_map.items():
        if key in description.lower():
            return value
    return 0.5  # default estimate

def suggest_new_habit(user_actions: list[str]) -> str:
    if "bike commute" not in user_actions:
        return "Try biking to work once this week!"
    elif "vegetarian meal" not in user_actions:
        return "Have one plant-based meal tomorrow!"
    else:
        return "Keep going! You're making a real impact."