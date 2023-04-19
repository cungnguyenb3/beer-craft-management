package com.formos.craft.web.rest;

import com.formos.craft.dto.request.PushNotificationRequest;
import com.formos.craft.dto.response.PushNotificationResponse;
import com.formos.craft.notification.FCMService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/firebase")
public class PushNotificationResource {

    private final FCMService pushNotiService;

    public PushNotificationResource(FCMService pushNotiService) {
        this.pushNotiService = pushNotiService;
    }

    @RequestMapping(value = "/push-noti", method = RequestMethod.POST)
    public ResponseEntity<?> fakePushNoti(@RequestBody PushNotificationRequest request) {
        pushNotiService.sendMessage(request);
        return new ResponseEntity<>(new PushNotificationResponse(HttpStatus.OK.value(), "Notification has been sent."), HttpStatus.OK);
    }

    @RequestMapping(value = "/push-noti-with-data", method = RequestMethod.POST)
    public ResponseEntity<?> fakePushNotiWithData(@RequestBody PushNotificationRequest request) {
        pushNotiService.sendMessage(request);
        return new ResponseEntity<>(new PushNotificationResponse(HttpStatus.OK.value(), "Notification has been sent."), HttpStatus.OK);
    }
}
