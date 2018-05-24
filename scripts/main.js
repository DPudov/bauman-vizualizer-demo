'use strict';

const applicationServerPublicKey = 'BO68bl6FisQSpr7Bf01wysC5yeHeCMIZJHUxJUN_bbW3T3-fNpJO8Wtk9JpNRwAOFkPPB5uy-4cn13sbpjDM01M';

// Все кнопки тут
const pushButton = document.querySelector('.js-push-btn');
const testNotificationButton = document.querySelector('.demo-push');
const studyStatusNotificationButton = document.querySelector('.study-status-push');
const militaryNotificationButton = document.querySelector('.military-push');
const grantNotificationButton = document.querySelector('.grant-push');
const studyFormNotificationButton = document.querySelector('.study-form-push');
const studyTypeNotificationButton = document.querySelector('.study-type-push');
const multipleNotificationButton = document.querySelector('.multiple-push');
const sessionNotificationButton = document.querySelector('.session-push');
const pointNotificationButton = document.querySelector('.point-push');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function sendSubscriptionToBackEnd(subscription) {
  return fetch('/api/save-subscription/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscription)
  })
  .then(function(response) {
    if (!response.ok) {
      throw new Error('Bad status code from server.');
    }

    return response.json();
  })
  .then(function(responseData) {
    if (!(responseData.data && responseData.data.success)) {
      throw new Error('Bad response from server.');
    }
  });
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('Успешная подписка.');

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn();
  })
  .catch(function(err) {
    console.log('Ошибка при подписке пользователя: ', err);
    updateBtn();
  });
}

function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription) {
      return subscription.unsubscribe();
    }
  })
  .catch(function(error) {
    console.log('Ошибка при отписке', error);
  })
  .then(function() {
    updateSubscriptionOnServer(null);

    console.log('Пользователь отписался.');
    isSubscribed = false;

    updateBtn();
  });
}


function updateSubscriptionOnServer(subscription) {
  //sendSubscriptionToBackEnd(subscription);

  // const subscriptionJson = document.querySelector('.js-subscription-json');
  // const subscriptionDetails =
  //   document.querySelector('.js-subscription-details');
  //
  // if (subscription) {
  //   subscriptionJson.textContent = JSON.stringify(subscription);
  //   subscriptionDetails.classList.remove('is-invisible');
  // } else {
  //   subscriptionDetails.classList.add('is-invisible');
  // }
}

function initializeUI() {
  testNotificationButton.disabled = true;
	pushButton.addEventListener('click', function() {
    pushButton.disabled = true;

    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  });
  // Set the initial subscription value
	swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    if (isSubscribed) {
      console.log('Успешная подписка');
    } else {
      console.log('Подписка не выполнена');
    }

    updateBtn();
  });

}

function updateBtn() {
	if (Notification.permission === 'denied') {
		pushButton.textContent = 'Пуш-уведомления запрещены в вашем браузере. Измените настройки.';
		pushButton.disabled = true;
    testNotificationButton.disabled = true;
    studyStatusNotificationButton.disabled = true;
    militaryNotificationButton.disabled = true;
    grantNotificationButton.disabled = true;
    studyFormNotificationButton.disabled = true;
    studyTypeNotificationButton.disabled = true;
    multipleNotificationButton.disabled = true;
    sessionNotificationButton.disabled = true;
    pointNotificationButton.disabled = true;
		updateSubscriptionOnServer(null);
		return;
	}
	if (isSubscribed) {
    testNotificationButton.disabled = false;
    studyStatusNotificationButton.disabled = false;
    militaryNotificationButton.disabled = false;
    grantNotificationButton.disabled = false;
    studyFormNotificationButton.disabled = false;
    studyTypeNotificationButton.disabled = false;
    multipleNotificationButton.disabled = false;
    sessionNotificationButton.disabled = false;
    pointNotificationButton.disabled = false;
		pushButton.textContent = 'Выключить пуш-уведомления';
    testNotificationButton.textContent = 'Отправить пуш-уведомление';
	} else {
    testNotificationButton.disabled = true;
    studyStatusNotificationButton.disabled = true;
    militaryNotificationButton.disabled = true;
    grantNotificationButton.disabled = true;
    studyFormNotificationButton.disabled = true;
    studyTypeNotificationButton.disabled = true;
    multipleNotificationButton.disabled = true;
    sessionNotificationButton.disabled = true;
    pointNotificationButton.disabled = true;
    testNotificationButton.textContent = 'Сначала включите пуш-уведомления';
    pushButton.textContent = 'Включить пуш-уведомления';
  }

  pushButton.disabled = false;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Сервис воркер и пуши поддерживаются.');

  navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Успешная регистрация сервис воркера', swReg);

  //   const allOptionsNotification = function(registration) {
  //   const title = 'Bauman Vizualizer Demo';
  //   const options = {
  //     body: 'Это тестовое уведомление.\n' +
  //       'And it is legen... wait for it... dary!',
  //     icon: 'images/icon.png',
  //     tag: 'example-notification',
  //   };
  //   registration.showNotification(title, options);
  // };

  // const config = {
  //   cb: allOptionsNotification,
  // };
  const demoPush = function(registration) {
    const title = 'Bauman Vizualizer Demo';
    const options = {
        body: 'Это тестовое уведомление.\n' +
          'And it is legen... wait for it... dary!',
        icon: 'images/icon.png',
        badge: 'images/badge.png',
        tag: 'example-notification',
      };
    registration.showNotification(title, options);
  };

  const studyStatusPush = function(registration) {
    const title = 'ЛК МГТУ. Статус обучения';
    const options = {
        body: 'Изменён статус обучения на %name%',
        icon: 'images/icon.png',
        badge: 'images/badge.png',
        tag: 'example-notification',
      };
    registration.showNotification(title, options);
  };

  const militaryPush = function(registration) {
    const title = 'ЛК МГТУ. Военное обучение';
    const options = {
        body: 'Изменён статус военного обучения на %name%',
        icon: 'images/icon.png',
        badge: 'images/badge.png',
        tag: 'example-notification',
      };
    registration.showNotification(title, options);
  };

  const grantPush = function(registration) {
    const title = 'ЛК МГТУ. Стипендия';
    const options = {
        body: 'Изменён тип стипендии на %name%',
        icon: 'images/icon.png',
        badge: 'images/badge.png',
        tag: 'example-notification',
      };
    registration.showNotification(title, options);
  };

  const studyFormPush = function(registration) {
    const title = 'ЛК МГТУ. Форма обучения';
    const options = {
        body: 'Изменена форма обучения на %name%',
        icon: 'images/icon.png',
        badge: 'images/badge.png',
        tag: 'example-notification',
      };
    registration.showNotification(title, options);
  };

  const studyTypePush = function(registration) {
    const title = 'ЛК МГТУ. Основа обучения';
    const options = {
        body: 'Изменена основа обучения на %name%',
        icon: 'images/icon.png',
        badge: 'images/badge.png',
        tag: 'example-notification',
      };
    registration.showNotification(title, options);
  };

  const multiplePush = function(registration) {
    const title = 'ЛК МГТУ';
    const options = {
        body: 'Произошло %n% изменений в ЛК.',
        icon: 'images/icon.png',
        badge: 'images/badge.png',
        tag: 'example-notification',
      };
    registration.showNotification(title, options);
  };

  const sessionPush = function(registration) {
    const title = 'ЛК МГТУ. Сессия';
    const options = {
        body: 'Оценка по предмету "Учебно-вычислительный практикум" изменена на 5',
        icon: 'images/icon.png',
        badge: 'images/badge.png',
        tag: 'example-notification',
      };
    registration.showNotification(title, options);
  };

  const pointPush = function(registration) {
    const title = 'ЛК МГТУ. Новая оценка';
    const options = {
        body: 'Оценка по предмету "Программирование" поставлена оценка 5',
        icon: 'images/icon.png',
        badge: 'images/badge.png',
        tag: 'example-notification',
      };
    registration.showNotification(title, options);
  };

  const configs = [
      {
        className: 'demo-push',
        cb: demoPush,
        enabled: () => {
          return ('title' in Notification.prototype) &&
            ('body' in Notification.prototype);
        }
      },
      {
        className: 'study-status-push',
        cb: studyStatusPush,
        enabled: () => {
          return ('title' in Notification.prototype) &&
            ('body' in Notification.prototype);
        }
      },
      {
        className: 'military-push',
        cb: militaryPush,
        enabled: () => {
          return ('title' in Notification.prototype) &&
            ('body' in Notification.prototype);
        }
      },
      {
        className: 'grant-push',
        cb: grantPush,
        enabled: () => {
          return ('title' in Notification.prototype) &&
            ('body' in Notification.prototype);
        }
      },
      {
        className: 'study-form-push',
        cb: studyFormPush,
        enabled: () => {
          return ('title' in Notification.prototype) &&
            ('body' in Notification.prototype);
        }
      },
      {
        className: 'study-type-push',
        cb: studyTypePush,
        enabled: () => {
          return ('title' in Notification.prototype) &&
            ('body' in Notification.prototype);
        }
      },
      {
        className: 'multiple-push',
        cb: multiplePush,
        enabled: () => {
          return ('title' in Notification.prototype) &&
            ('body' in Notification.prototype);
        }
      },
      {
        className: 'session-push',
        cb: sessionPush,
        enabled: () => {
          return ('title' in Notification.prototype) &&
            ('body' in Notification.prototype);
        }
      },
      {
        className: 'point-push',
        cb: pointPush,
        enabled: () => {
          return ('title' in Notification.prototype) &&
            ('body' in Notification.prototype);
        }
      },
    ];
  configs.forEach(function(config) {
        const button = document.querySelector(`.${config.className}`);
        if (!button) {
          console.error('No button found with classname: ', config.className);
          return;
        }
        button.addEventListener('click', function() {
          const promiseResult = config.cb(swReg);
          if (promiseResult) {
            button.disabled = true;
            promiseResult.then(() => {
              button.disabled = false;
            })
          }
        });
        button.disabled = !config.enabled();
      });

    // testNotificationButton.addEventListener('click', function(){
    //   const promiseResult = config.cb(swReg);
    //       if (promiseResult && !isSubscribed) {
    //         testNotificationButton.disabled = true;
    //         promiseResult.then(() => {
    //           if (isSubscribed){
    //               testNotificationButton.disabled = true;
    //           }else{
    //               testNotificationButton.disabled = false;
    //           }
    //
    //         })
    //       }
    // });
    // studyStatusNotificationButton.addEventListener('click', function(){
    //   const promiseResult = config.cb(swReg);
    //       if (promiseResult && !isSubscribed) {
    //         studyStatusNotificationButton.disabled = true;
    //         promiseResult.then(() => {
    //           if (isSubscribed){
    //               studyStatusNotificationButton.disabled = true;
    //           }else{
    //               studyStatusNotificationButton.disabled = false;
    //           }
    //
    //         })
    //       }
    // });
    // militaryNotificationButton.addEventListener('click', function(){
    //   const promiseResult = config.cb(swReg);
    //       if (promiseResult && !isSubscribed) {
    //         militaryNotificationButton.disabled = true;
    //         promiseResult.then(() => {
    //           if (isSubscribed){
    //               militaryNotificationButton.disabled = true;
    //           }else{
    //               militaryNotificationButton.disabled = false;
    //           }
    //
    //         })
    //       }
    // });
    // grantNotificationButton.addEventListener('click', function(){
    //   const promiseResult = config.cb(swReg);
    //       if (promiseResult && !isSubscribed) {
    //         grantNotificationButton.disabled = true;
    //         promiseResult.then(() => {
    //           if (isSubscribed){
    //               grantNotificationButton.disabled = true;
    //           }else{
    //               grantNotificationButton.disabled = false;
    //           }
    //
    //         })
    //       }
    // });
    // studyFormNotificationButton.addEventListener('click', function(){
    //   const promiseResult = config.cb(swReg);
    //       if (promiseResult && !isSubscribed) {
    //         studyFormNotificationButton.disabled = true;
    //         promiseResult.then(() => {
    //           if (isSubscribed){
    //               studyFormNotificationButton.disabled = true;
    //           }else{
    //               studyFormNotificationButton.disabled = false;
    //           }
    //
    //         })
    //       }
    // });
    // studyTypeNotificationButton.addEventListener('click', function(){
    //   const promiseResult = config.cb(swReg);
    //       if (promiseResult && !isSubscribed) {
    //         studyTypeNotificationButton.disabled = true;
    //         promiseResult.then(() => {
    //           if (isSubscribed){
    //               studyTypeNotificationButton.disabled = true;
    //           }else{
    //               studyTypeNotificationButton.disabled = false;
    //           }
    //
    //         })
    //       }
    // });
    // multipleNotificationButton.addEventListener('click', function(){
    //   const promiseResult = config.cb(swReg);
    //       if (promiseResult && !isSubscribed) {
    //         multipleNotificationButton.disabled = true;
    //         promiseResult.then(() => {
    //           if (isSubscribed){
    //               multipleNotificationButton.disabled = true;
    //           }else{
    //               multipleNotificationButton.disabled = false;
    //           }
    //
    //         })
    //       }
    // });
    // pointNotificationButton.addEventListener('click', function(){
    //   const promiseResult = config.cb(swReg);
    //       if (promiseResult && !isSubscribed) {
    //         pointNotificationButton.disabled = true;
    //         promiseResult.then(() => {
    //           if (isSubscribed){
    //               pointNotificationButton.disabled = true;
    //           }else{
    //               pointNotificationButton.disabled = false;
    //           }
    //
    //         })
    //       }
    // });
    swRegistration = swReg;
	initializeUI();
  })
  .catch(function(error) {
    console.error('Ошибка сервис воркера', error);
  });
} else {
  console.warn('Пуши не поддерживаются');
  pushButton.textContent = 'У вас не поддерживаются пуши';
}
