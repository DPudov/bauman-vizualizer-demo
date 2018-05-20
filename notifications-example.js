(function() {
  const NOTIFICATION_DELAY = 2500;

  const promiseTimeout = function(cb, timeout) {
    return new Promise((resolve) => {
      setTimeout(() => {
        cb();
        resolve();
      }, timeout);
    });
  };

  function registerServiceWorker() {
    return navigator.serviceWorker.register('sw.js')
    .then(function(registration) {
      console.log('Service worker successfully registered.');
      return registration;
    })
    .catch(function(err) {
      console.error('Unable to register service worker.', err);
    });
  }

  const allOptionsNotification = function(registration) {
    const title = 'Bauman Vizualizer Demo';
    const options = {
      body: 'Это тестовое уведомление.\n' +
        'And it is legen... wait for it... dary!',
      icon: '/styles/icon.png',
      tag: 'example-notification',
    };
    registration.showNotification(title, options);
  };

  const setUpSWMessageListener = function() {
    /**** START swMessageListener ****/
    navigator.serviceWorker.addEventListener('message', function(event) {
      console.log('Received a message from service worker: ', event.data);
    });
    /**** END swMessageListener ****/
  };

  const setUpNotificationButtons = function() {
    setUpSWMessageListener();

    const configs = [
      {
        className: 'js-notification-overview',
        cb: allOptionsNotification,
        enabled: () => {
          return true;
        },
      }
    ];

    return registerServiceWorker()
    .then(function(registration) {
      configs.forEach(function(config) {
        const button = document.querySelector(`.${config.className}`);
        if (!button) {
          console.error('No button found with classname: ', config.className);
          return;
        }
        button.addEventListener('click', function() {
          const promiseResult = config.cb(registration);
          if (promiseResult) {
            button.disabled = true;
            promiseResult.then(() => {
              button.disabled = false;
            })
          }
        });
        button.disabled = !config.enabled();
      });
    });
  };

  window.addEventListener('load', function() {
    if (!('serviceWorker' in navigator)) {
      // Service Worker isn't supported on this browser, disable or hide UI.
      return;
    }

    if (!('PushManager' in window)) {
      // Push isn't supported on this browser, disable or hide UI.
      return;
    }

    let promiseChain = new Promise((resolve, reject) => {
      const permissionPromise = Notification.requestPermission((result) => {
        resolve(result);
      });
      if (permissionPromise) {
        permissionPromise.then(resolve);
      }
    })
    .then((result) => {
      if (result === 'granted') {
        setUpNotificationButtons();
      } else {
        displayNoPermissionError();
      }
    });
  });
})();
