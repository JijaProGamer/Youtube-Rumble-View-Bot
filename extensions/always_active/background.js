'use strict';

const log = (...args) => localStorage.getItem('log') === 'true' && console.log(args);

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.method === 'check') {
    log('check event from', sender.tab);
  }
  else if (request.method === 'change') {
    log('page visibility state is changed', sender.tab);
  }
});
