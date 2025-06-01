import os
from dotenv import load_dotenv
import requests
from app.models.chat import ChatMessages
from sqlalchemy.orm import Session
import uuid
from typing import Optional, Tuple

load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
print("API KEY:", OPENROUTER_API_KEY)


def generate_response_with_history(
    prompt: str,
    user_email: str,
    db: Session,
    chat_id: Optional[str] = None,
    topic: Optional[str] = "Mathematics",
    # language: Optional[str] = "en",
) -> Tuple[str, str]:

    if not OPENROUTER_API_KEY:
        return (
            "Error: OpenRouter API key not found. Make sure OPENROUTER_API_KEY is in your .env file.",
            "",
        )

    if not chat_id or chat_id == "string":
        chat_id = str(uuid.uuid4())

    db.add(
        ChatMessages(
            user_email=user_email, chat_id=chat_id, role="user", content=prompt
        )
    )
    db.commit()

    system_prompts = {
        "Mathematics": {
            "role": "system",
            "content": (
                "You are a mathematics professor. Answer strictly, accurately, and to the point. "
                "Use mathematical notation and formulas when appropriate. "
                "Give clear examples, but avoid over-simplifying the concepts."
            ),
        },
        "History": {
            "role": "system",
            "content": (
                "You are a professor of history. Provide accurate, chronological responses. "
                "Explain historical causes and consequences clearly. "
                "Include important dates, figures, and relevant events."
            ),
        },
        "Programming": {
            "role": "system",
            "content": (
                "You are a software engineer. Answer questions clearly and practically, using real examples in Python. "
                "Avoid unnecessary theory, and focus on applied code and problem-solving."
            ),
        },
        "Economic": {
            "role": "system",
            "content": (
                "You are an economist. Explain economic concepts clearly using real-world examples. "
                "Include relevant theories, models, and when appropriate, use data or case studies."
            ),
        },
    }

    system_prompt = system_prompts.get(topic or "Mathematics")

    # if language == "ru":
    #     system_prompt["content"] = {
    #         "Mathematics": "Ты — профессор математики. Отвечай строго, с примерами и формулами. только на русском",
    #         "History": "Ты — профессор истории. Объясняй хронологически и фактами.только на русском",
    #         "Programming": "Ты — эксперт по программированию. Объясняй с примерами на Python.только на русском",
    #         "Economic": "Ты — экономист. Объясняй термины и кейсы из реальной экономики.только на русском",
    #     }.get(topic, system_prompt["content"])
    history = (
        db.query(ChatMessages)
        .filter(ChatMessages.user_email == user_email, ChatMessages.chat_id == chat_id)
        .order_by(ChatMessages.timestamp.desc())
        .limit(10)
        .all()
    )

    messages = [system_prompt] + [
        {"role": msg.role, "content": msg.content} for msg in reversed(history)
    ]

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "http://localhost",
        "Content-Type": "application/json",
    }

    data = {
        "model": "openai/gpt-3.5-turbo",
        "messages": messages,
        "temperature": 0.4,
        "max_tokens": 700,
    }

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data
        )
        response.raise_for_status()
        reply = response.json()["choices"][0]["message"]["content"].strip()
    except Exception as e:
        reply = f"Error requesting OpenRouter: {str(e)}"

    db.add(
        ChatMessages(
            user_email=user_email, chat_id=chat_id, role="assistant", content=reply
        )
    )
    db.commit()

    return reply, chat_id
