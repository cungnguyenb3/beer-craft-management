package com.formos.craft.dto.request;

import java.util.HashMap;
import java.util.Map;

public class PushNotificationRequest {

    private String title;
    private String message;
    private String topic;
    private String token;
    Map<String, String> data = new HashMap<String, String>();
    Map<String, Object> customerDataPayload = new HashMap<String, Object>();

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Map<String, String> getData() {
        return data;
    }

    public void setData(Map<String, String> data) {
        this.data = data;
    }

    public Map<String, Object> getCustomerDataPayload() {
        return customerDataPayload;
    }

    public void setCustomerDataPayload(Map<String, Object> customerDataPayload) {
        this.customerDataPayload = customerDataPayload;
    }
}
