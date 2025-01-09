package com.thyonix;

import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

public class BotRunner {
    public static void main(String[] args) throws TelegramApiException {
        // 创建 Telegram Bots API 实例
        TelegramBotsApi botsApi = new TelegramBotsApi(DefaultBotSession.class);
        try {
            // 注册你的机器人
            botsApi.registerBot(new Bot());
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }
}