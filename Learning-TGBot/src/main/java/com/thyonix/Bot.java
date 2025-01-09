package com.thyonix;

import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.methods.send.SendPhoto;
import org.telegram.telegrambots.meta.api.methods.updates.GetUpdates;
import org.telegram.telegrambots.meta.api.objects.InputFile;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.PhotoSize;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


/**
 * 机器人
 * 必须使用tun网络才能连接到Telegram服务器
 *
 * @author Maktub
 * @version 1.0.0
 * @date 2024/11/06
 */
public class Bot extends TelegramLongPollingBot {

    /**
     * 获取机器人用户名
     *
     * @return {@link String }
     */
    @Override
    public String getBotUsername() {
        return "";
    }

    /**
     * robot token
     * @return
     */
    @Override
    public String getBotToken() {
        return "";
    }

    /**
     * 监听机器人收到的请求:robot发送的消息会在telegram服务器拆分，逐个发送给用户服务器
     *                  机器人无法监听到私有频道内容
     *                  对于频道内容监听有两种方式：1.当前这种轮询方式2.webhook方式，需要能https访问的公网ip
     * @param update
     */
    @Override
    public void onUpdateReceived(Update update) {
        // robot发送了文本
        if (update.hasMessage() && update.getMessage().hasText()) {
            // 获取消息内容和对话Id
            String MessageText = update.getMessage().getText();
            Long ChatId = update.getMessage().getChatId();

            // 处理/list命令
            if (MessageText.equals("/list")) {
                // 获取视频信息并发送回用户
                List<String> videoInfo = getUniqueTagsFromChannelVideos();
                String response = String.join("\n", videoInfo);
                sendMessage(ChatId, response);
            }
        }
        // robot发送了视频
        if (update.hasMessage() && update.getMessage().hasVideo()) {

        }
        // robot上传了图片
        if (update.hasMessage() && update.getMessage().hasPhoto()) {
            Long chatId = update.getMessage().getChatId();
            String description = update.getMessage().getCaption();
            if (description != null && !description.isEmpty()) {
                tagMatcher(description).forEach(System.out::println);
            }
            List<PhotoSize> photos = update.getMessage().getPhoto();
            PhotoSize photoSize = photos
                    .stream()
                    .max(Comparator.comparingInt(PhotoSize::getFileSize))
                    .orElse(new PhotoSize());
            sendPhoto(chatId,photoSize.getFileId(),"file_id: " + photoSize.getFileId() + "\nwidth: " + Integer.toString(photoSize.getWidth()) + "\nheight: " + Integer.toString(photoSize.getHeight()));
        }
    }

    /**
     * 从频道视频中获取唯一标签
     *
     * @return {@code List<String> }
     */
    private List<String> getUniqueTagsFromChannelVideos() {
        List<String> videoInfo = new ArrayList<>();

        // 使用 getUpdates 获取消息
        GetUpdates getUpdates = new GetUpdates();
        try {
            List<Update> updates = execute(getUpdates); // 执行获取更新操作
            for (Update update : updates) {
                Message message = update.getMessage();

                if (message != null && message.getVideo() != null) {
                    // 视频消息，提取视频信息
                    String videoInfoStr = "Video ID: " + message.getVideo().getFileId() +
                            " | Duration: " + message.getVideo().getDuration() + " seconds" +
                            " | File Size: " + message.getVideo().getFileSize() + " bytes";
                    videoInfo.add(videoInfoStr); // 将视频信息添加到列表
                }
            }
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
        return videoInfo;
    }

    /**
     * 发送消息
     *
     * @param chatId 聊天ID
     * @param text   文本
     */
    private void sendMessage(Long chatId, String text) {
        SendMessage message = SendMessage
                .builder()
                .chatId(chatId)
                .text(text)
                .build();
        try {
            execute(message);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }


    /**
     * 发送照片
     *
     * @param chatId  聊天ID
     * @param fileId  文件编号
     * @param caption 标题
     */
    private void sendPhoto(Long chatId, String fileId, String caption) {
        SendPhoto photo = SendPhoto
                .builder()
                .chatId(chatId)
                .photo(new InputFile(fileId))
                .caption(caption)
                .build();
        try {
            execute(photo);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }


    /**
     * 标签匹配器
     *
     * @param caption 标题
     * @return {@code List<String> }
     */
    private List<String> tagMatcher(String caption){
        String regex = "#\\S+";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(caption);
        List<String> matches = new ArrayList<>();
        while (matcher.find()) {
            matches.add(matcher.group().trim());
        }
        return matches;
    }

}
