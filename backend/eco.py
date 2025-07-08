# backend/eco.py

import re
from typing import List

CO2_SAVINGS = {
    "biking": 2.0,
    "walking": 1.2,
    "recycling": 0.4,
    "solar": 6.5,
    "transit": 1.5,
    "composting": 0.7,
    "led lighting": 0.3,
    "vegetarian": 1.8,
    "shower skip": 1.1,
    "cold laundry": 0.6,
    "telecommute": 2.2,
    "carpool": 1.6
}

KEYWORD_MAP = {
    "biking": ["bike", "cycling", "biking", "commute bike"],
    "walking": ["walk", "walking", "hike"],
    "recycling": ["recycle", "recycled"],
    "solar": ["solar"],
    "transit": ["bus", "subway", "train", "public transport"],
    "composting": ["compost"],
    "led lighting": ["led", "light bulb"],
    "vegetarian": ["vegetarian", "vegan", "plant-based"],
    "shower skip": ["skipped shower", "no shower", "short shower"],
    "cold laundry": ["cold wash", "cold laundry"],
    "telecommute": ["remote work", "telecommute", "work from home"],
    "carpool": ["carpool", "shared ride"],
}

def estimate_savings(action: str, duration_minutes: int = 30) -> float:
    normalized_action = action.strip().lower()

    for category, keywords in KEYWORD_MAP.items():
        for keyword in keywords:
            if re.search(rf'\b{keyword}\b', normalized_action):
                savings = CO2_SAVINGS.get(category, 0.1)
                scale_base = 30 if category not in {"recycling", "led lighting", "vegetarian", "shower skip", "solar"} else 1
                return round(savings * (duration_minutes / scale_base), 2)

    # Default fallback
    return round(0.1 * (duration_minutes / 30), 2)

def suggest_new_habit(user_actions: List[str]) -> str:
    actions_joined = " ".join(user_actions).lower()

    if "bike" not in actions_joined:
        return "🚲 Try biking to work or school this week."
    if "vegetarian" not in actions_joined:
        return "🥗 Have a plant-based meal tomorrow!"
    if "recycle" not in actions_joined:
        return "♻️ Try recycling all your plastic waste today."
    if "cold laundry" not in actions_joined:
        return "💧 Do your laundry with cold water next time."
    if "telecommute" not in actions_joined:
        return "🏡 Consider working from home one day this week."

    return "🌱 Keep it up! You're making a great impact already."