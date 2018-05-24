var webPush = require('web-push');

var pushSubscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/fWaO_1vY0X8:APA91bGvBwHdbZ_lodGWknuXeQzHmGiNS0NsxGL1EddU4faaIOAzO1BpdQvQjeiT1IFvcR_2WJ74lYs68tkY3Z4CqfgvHyFdqQ-2qDua23SznrF2LersXEBIo7aYH8yVx2d44fAaxVqg","expirationTime":null,"keys":{"p256dh":"BJkJvBZr29Yt9zsyTEd3REsNJKDHCTkheQp1xgS_PitG4eFBZvf66XK9zAz2UmOUhCeRDxB1gcklnZBMVuRKRUI","auth":"F3GQ_oPkNczRf3wbKgleQw"}}
var vapidPublicKey = 'BO68bl6FisQSpr7Bf01wysC5yeHeCMIZJHUxJUN_bbW3T3-fNpJO8Wtk9JpNRwAOFkPPB5uy-4cn13sbpjDM01M';
var vapidPrivateKey = 'UeWsFBLN4C54dgeZLzR1-2xuwmln-w5cyPo5JNP9F4A';

var payload = 'Here is a payload!';

var options = {
  // gcmAPIKey: 'YOUR_SERVER_KEY',
  TTL: 60,
  vapidDetails: {
    subject: 'https://students.bmstu.ru/schedule/',
    publicKey: vapidPublicKey,
    privateKey: vapidPrivateKey
  }
};

webPush.sendNotification(
  pushSubscription,
  payload,
  options
);
