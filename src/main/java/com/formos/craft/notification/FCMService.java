package com.formos.craft.notification;

import com.formos.craft.dto.request.PushNotificationRequest;
import com.google.firebase.messaging.AndroidConfig;
import com.google.firebase.messaging.AndroidNotification;
import com.google.firebase.messaging.ApnsConfig;
import com.google.firebase.messaging.Aps;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

@Service
public class FCMService {

    private static final Logger logger = LogManager.getLogger(FCMService.class);

    public void sendMessage(PushNotificationRequest request) {
        try {
            Message message = getPreconfiguredMessageWithData(request);
            String response = sendAndGetResponse(message);
            logger.info("sendMessage response: " + response);
        } catch (Exception e) {
            logger.error("sendMessage " + e.getMessage());
        }
    }

    public void sendMessage(PushNotificationRequest request, boolean silentMode) {
        try {
            Message message = getPreconfiguredMessageWithData(request, silentMode);
            String response = sendAndGetResponse(message);
            logger.info("sendMessage silentMode response: " + response);
        } catch (Exception e) {
            logger.error("sendMessage " + e.getMessage());
        }
    }

    public void sendMessage(Map<String, String> data, PushNotificationRequest request) {
        try {
            Message message = getPreconfiguredMessageWithData(data, request);
            String response = sendAndGetResponse(message);
            logger.info("sendMessage map response: " + response);
        } catch (Exception e) {
            logger.error("sendMessage " + e.getMessage());
        }
    }

    public void sendMessageWithoutData(PushNotificationRequest request) {
        try {
            Message message = getPreconfiguredMessageWithoutData(request);
            String response = sendAndGetResponse(message);
            logger.info("Sent message without data. Topic: " + request.getTopic() + ", " + response);
        } catch (Exception e) {
            logger.error("sendMessageWithoutData " + e.getMessage());
        }
    }

    public void sendMessageToToken(PushNotificationRequest request) throws InterruptedException, ExecutionException {
        try {
            Message message = getPreconfiguredMessageToToken(request);
            String response = sendAndGetResponse(message);
            logger.info("Sent message to token. Device token: " + request.getToken() + ", " + response);
        } catch (Exception e) {
            logger.error("sendMessageToToken " + e.getMessage());
        }
    }

    private String sendAndGetResponse(Message message) throws InterruptedException, ExecutionException {
        return FirebaseMessaging.getInstance().sendAsync(message).get();
    }

    private AndroidConfig getAndroidConfig(String topic) {
        return AndroidConfig
            .builder()
            .setTtl(Duration.ofMinutes(2).toMillis())
            .setCollapseKey(topic)
            .setPriority(AndroidConfig.Priority.HIGH)
            .setNotification(
                AndroidNotification
                    .builder()
                    .setSound(NotificationParameter.SOUND.getValue())
                    .setColor(NotificationParameter.COLOR.getValue())
                    .setTag(topic)
                    .build()
            )
            .build();
    }

    private AndroidConfig getAndroidConfig(String topic, boolean silentMode) {
        return AndroidConfig
            .builder()
            .setTtl(Duration.ofMinutes(2).toMillis())
            .setCollapseKey(topic)
            .setPriority(AndroidConfig.Priority.HIGH)
            .build();
    }

    private ApnsConfig getApnsConfig(PushNotificationRequest request) {
        return ApnsConfig
            .builder()
            .setAps(
                Aps
                    .builder()
                    .setCategory(request.getTopic())
                    .setThreadId(request.getTitle())
                    .putAllCustomData(request.getCustomerDataPayload())
                    .build()
            )
            .build();
    }

    private ApnsConfig getApnsConfig(PushNotificationRequest request, boolean silentMode) {
        return ApnsConfig
            .builder()
            .setAps(
                Aps
                    .builder()
                    .setContentAvailable(silentMode)
                    .setCategory(request.getTopic())
                    .setThreadId(request.getTitle())
                    .putAllCustomData(request.getCustomerDataPayload())
                    .build()
            )
            .build();
    }

    private Message getPreconfiguredMessageToToken(PushNotificationRequest request) {
        return getPreconfiguredMessageBuilder(request).setToken(request.getToken()).build();
    }

    private Message getPreconfiguredMessageWithoutData(PushNotificationRequest request) {
        return getPreconfiguredMessageBuilder(request).setTopic(request.getTopic()).build();
    }

    private Message getPreconfiguredMessageWithData(Map<String, String> data, PushNotificationRequest request) {
        return getPreconfiguredMessageBuilder(request).putAllData(data).setToken(request.getToken()).build();
    }

    private Message getPreconfiguredMessageWithData(PushNotificationRequest request) {
        return getPreconfiguredMessageBuilder(request).putAllData(request.getData()).setToken(request.getToken()).build();
    }

    private Message getPreconfiguredMessageWithData(PushNotificationRequest request, boolean silentMode) {
        return getPreconfiguredMessageBuilder(request, silentMode).putAllData(request.getData()).setToken(request.getToken()).build();
    }

    private Message.Builder getPreconfiguredMessageBuilder(PushNotificationRequest request, boolean silentMode) {
        AndroidConfig androidConfig = getAndroidConfig(request.getTopic(), silentMode);
        ApnsConfig apnsConfig = getApnsConfig(request, silentMode);
        return Message.builder().setApnsConfig(apnsConfig).setAndroidConfig(androidConfig);
    }

    private Message.Builder getPreconfiguredMessageBuilder(PushNotificationRequest request) {
        AndroidConfig androidConfig = getAndroidConfig(request.getTopic());
        ApnsConfig apnsConfig = getApnsConfig(request);
        return Message
            .builder()
            .setApnsConfig(apnsConfig)
            .setAndroidConfig(androidConfig)
            .setNotification(new Notification(request.getTitle(), request.getMessage()));
    }
}
