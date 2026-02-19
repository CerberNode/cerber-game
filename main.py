import os
import telebot
from telebot import types
from dotenv import load_dotenv

# Загружаем переменные из файла .env
load_dotenv()
TOKEN = os.getenv('TOKEN')

# Проверка, что токен загрузился
if not TOKEN:
    print("ОШИБКА: Токен не найден! Проверь файл .env")
    exit()

bot = telebot.TeleBot(TOKEN)

# Твоя ссылка на игру (GitHub Pages)
GAME_URL = "https://CerberNode.github.io/cerber-game/snake/"

@bot.message_handler(commands=['start'])
def start_command(message):
    """Обработка команды /start"""
    markup = types.InlineKeyboardMarkup()
    
    # Создаем WebAppInfo с твоей ссылкой
    web_app = types.WebAppInfo(url=GAME_URL)
    
    # Кнопка для запуска игры
    btn = types.InlineKeyboardButton(text="🎮 ИГРАТЬ В ЗМЕЙКУ", web_app=web_app)
    markup.add(btn)
    
    # Отправляем сообщение с кнопкой
    bot.send_message(
        message.chat.id, 
        "<b>Cerber Game Engine</b> запущен.\nНажми кнопку ниже, чтобы открыть игру внутри Telegram:", 
        parse_mode="HTML", 
        reply_markup=markup
    )

@bot.message_handler(content_types=['web_app_data'])
def handle_data(message):
    """Функция для получения счета из игры (sendData в JS)"""
    try:
        # Получаем данные, которые игра отправила боту
        score_data = message.web_app_data.data
        print(f"Получены данные от пользователя {message.from_user.username}: {score_data}")
        
        bot.send_message(
            message.chat.id, 
            f"🚀 <b>Результат принят!</b>\nТвой счет: <code>{score_data}</code>",
            parse_mode="HTML"
        )
    except Exception as e:
        print(f"Ошибка при обработке данных из Web App: {e}")

if __name__ == '__main__':
    print("---------------------------------")
    print("Бот Cerber Game запущен успешно!")
    print("Используется Python 3.12")
    print("Напишите /start в Telegram.")
    print("---------------------------------")
    
    try:
        # Запуск бесконечного цикла
        bot.polling(none_stop=True)
    except Exception as e:
        print(f"Ошибка в работе бота: {e}")