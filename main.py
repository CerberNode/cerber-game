import os
import telebot
from telebot import types
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv('TOKEN')
bot = telebot.TeleBot(TOKEN)

# ВАЖНО: Это должно быть выше обработчиков!
GAMES = {
    "snake": "https://CerberNode.github.io/cerber-game/snake/"
}

@bot.message_handler(commands=['start'])
def start_command(message):
    welcome_text = (
        "<b>Cerber Game Engine</b> запущен. 🛡️\n\n"
        "Доступные команды:\n"
        "📂 /games — список всех игр\n"
        "❓ /help — справка\n\n"
        "Чтобы играть, введи /название_игры."
    )
    bot.send_message(message.chat.id, welcome_text, parse_mode="HTML")

@bot.message_handler(commands=['help'])
def help_command(message):
    bot.send_message(message.chat.id, "Инструкция: введи /games и выбери игру.")

@bot.message_handler(commands=['games'])
def list_games(message):
    games_list = "📂 <b>Доступные игры:</b>\n\n"
    for game_name in GAMES.keys():
        games_list += f"• /{game_name}\n"
    bot.send_message(message.chat.id, games_list, parse_mode="HTML")

# Усовершенствованный универсальный обработчик
@bot.message_handler(func=lambda m: m.text is not None and m.text.startswith('/'))
def dynamic_game_launcher(message):
    # Отрезаем '/' и переводим в нижний регистр для надежности
    command = message.text[1:].lower().split('@')[0] # split на случай если бот в группе
    
    if command in GAMES:
        url = GAMES[command]
        markup = types.InlineKeyboardMarkup()
        web_app = types.WebAppInfo(url=url)
        btn = types.InlineKeyboardButton(text=f"🎮 ИГРАТЬ В {command.upper()}", web_app=web_app)
        markup.add(btn)
        
        bot.send_message(
            message.chat.id, 
            f"Запуск протокола <b>{command.capitalize()}</b>...", 
            parse_mode="HTML", 
            reply_markup=markup
        )
    elif command not in ['start', 'help', 'games']:
        # Если это не игра и не стандартная команда — игнорируем или пишем ошибку
        bot.send_message(message.chat.id, "❌ Неизвестная игра. Введи /games для списка.")

if __name__ == '__main__':
    print("Бот запущен...")
    bot.infinity_polling() # Более стабильный метод вместо polling