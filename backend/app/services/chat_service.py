# import os
# from dotenv import load_dotenv
# import requests
# from app.models.chat import ChatMessages
# from sqlalchemy.orm import Session
# import uuid
# from typing import Optional

# load_dotenv()
# OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


# def generate_response_with_history(
#     prompt: str, user_email: str, db: Session, chat_id: Optional[str] = None
# ) -> uple[str, str]:
#     if not OPENROUTER_API_KEY:
#         return "Ошибка: ключ OpenRouter не найден. Убедитесь, что .env содержит OPENROUTER_API_KEY"

#     if not chat_id or chat_id == "string":
#         chat_id = str(uuid.uuid4())

#     db.add(ChatMessages(user_email=user_email, role="user", content=prompt))
#     db.commit()

#     system_prompt = {
#         "role": "system",
#         "content": (
#             "Ты — профессор математики. "
#             "Отвечай строго, точно, по существу, с примерами и формулами. "
#             "Объясняй понятным языком, но не упрощай слишком сильно."
#             "You're a maths professor. "
#             "Answer strictly, accurately, to the point, with examples and formulae."
#             "Explain in clear language, but don't oversimplify."
#         ),
#     }

#     history = (
#         db.query(ChatMessages)
#         .filter(ChatMessages.user_email == user_email, ChatMessages.chat_id == chat_id)
#         .order_by(ChatMessages.timestamp.desc())
#         .limit(10)
#         .all()
#     )

#     messages = [system_prompt] + [
#         {"role": msg.role, "content": msg.content} for msg in reversed(history)
#     ]

#     headers = {
#         "Authorization": f"Bearer {OPENROUTER_API_KEY}",
#         "HTTP-Referer": "http://localhost",
#         "Content-Type": "application/json",
#     }
#     data = {
#         "model": "openai/gpt-3.5-turbo",
#         # "messages": [{"role": "user", "content": prompt}],
#         "messages": messages,
#         "temperature": 0.4,
#         "max_tokens": 700,
#     }

#     try:
#         response = requests.post(
#             "https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data
#         )
#         response.raise_for_status()
#         reply = response.json()["choices"][0]["message"]["content"].strip()
#     except Exception as e:
#         reply = f"Ошибка при запросе к OpenRouter: {str(e)}"
#     db.add(
#         ChatMessages(
#             user_email=user_email, chat_id=chat_id, role="assistant", content=reply
#         )
#     )
#     db.commit()
#     return reply, chat_id
import os
from dotenv import load_dotenv
import requests
from app.models.chat import ChatMessages
from sqlalchemy.orm import Session
import uuid
from typing import Optional, Tuple

load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

def generate_response_with_history(
    prompt: str, user_email: str, db: Session, chat_id: Optional[str] = None
) -> Tuple[str, str]:
    if not OPENROUTER_API_KEY:
        return "Ошибка: ключ OpenRouter не найден. Убедитесь, что .env содержит OPENROUTER_API_KEY", ""

    # Генерация нового chat_id, если не передан или пришёл как строка "string"
    if not chat_id or chat_id == "string":
        chat_id = str(uuid.uuid4())

    # Сохраняем сообщение пользователя
    db.add(ChatMessages(user_email=user_email, chat_id=chat_id, role="user", content=prompt))
    db.commit()

    # Системный промпт
    system_prompt = {
        "role": "system",
        "content": (
            "Ты — профессор математики. "
            "Отвечай строго, точно, по существу, с примерами и формулами. "
            "Объясняй понятным языком, но не упрощай слишком сильно. "
            "You're a maths professor. "
            "Answer strictly, accurately, to the point, with examples and formulae. "
            "Explain in clear language, but don't oversimplify."
        ),
    }

    # Загружаем историю чата
    history = (
        db.query(ChatMessages)
        .filter(ChatMessages.user_email == user_email, ChatMessages.chat_id == chat_id)
        .order_by(ChatMessages.timestamp.desc())
        .limit(10)
        .all()
    )

    # Формируем сообщения
    messages = [system_prompt] + [
        {"role": msg.role, "content": msg.content}
        for msg in reversed(history)
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
        reply = f"Ошибка при запросе к OpenRouter: {str(e)}"

    # Сохраняем ответ ассистента
    db.add(
        ChatMessages(
            user_email=user_email, chat_id=chat_id, role="assistant", content=reply
        )
    )
    db.commit()

    return reply, chat_id
