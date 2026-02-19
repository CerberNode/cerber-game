import telebot
from telebot import types


TOKEN = '7791718592:AAG8id29vH0YGzbK9mJEAYHFB_VSVBuCsz8'
bot = telebot.TeleBot(TOKEN)

# 2. Твоя проверенная ссылка на игру
GAME_URL = "https://CerberNode.github.io/cerber-game/snake/"

@bot.message_handler(commands=['start'])
@bot.message_handler(commands=['start'])
def start_command(message):
    # Создаем Inline-клавиатуру (кнопка под сообщением)
    markup = types.InlineKeyboardMarkup()
    
    # Ссылка на твой Web App
    web_app = types.WebAppInfo(url=GAME_URL)
    
    # Создаем кнопку
    btn = types.InlineKeyboardButton(text="🎮 ИГРАТЬ В ЗМЕЙКУ", web_app=web_app)
    
    markup.add(btn)
    
    bot.send_message(
        message.chat.id, 
        "<b>Cerber Game Engine</b> запущен.\nНажми кнопку для входа в игру:", 
        parse_mode="HTML", 
        reply_markup=markup
    )

@bot.message_handler(content_types=['web_app_data'])
def handle_data(message):
    """Функция для получения данных из игры (если будешь их отправлять)"""
    print(f"Получены данные: {message.web_app_data.data}")
    bot.send_message(message.chat.id, f"🎮 Твой результат сохранен: {message.web_app_data.data}")

if __name__ == '__main__':
    print("---------------------------------")
    print("Бот Cerber Game запущен успешно!")
    print("Напишите /start в Telegram.")
    print("---------------------------------")
    
    # Бесконечный цикл работы бота
    try:
        bot.polling(none_stop=True)
    except Exception as e:
        print(f"Ошибка в работе бота: {e}")