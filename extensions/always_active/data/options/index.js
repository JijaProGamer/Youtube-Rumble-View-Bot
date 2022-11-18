const toast = document.getElementById('toast');

chrome.storage.local.get({
  'visibilityState': true,
  'hidden': true,
  'blur': true,
  'focus': true,
  'visibility': true,
  'mouseleave': true,
  'log': false,
  'faqs': true,
  'policies': null
}, prefs => {
  prefs.policies = prefs.policies ?? {};

  document.getElementById('visibilityState').checked = prefs.visibilityState;
  document.getElementById('hidden').checked = prefs.hidden;
  document.getElementById('focus').checked = prefs.focus;
  document.getElementById('visibility').checked = prefs.visibility;
  document.getElementById('blur').checked = prefs.blur;
  document.getElementById('mouseleave').checked = prefs.mouseleave;
  document.getElementById('log').checked = prefs.log;
  document.getElementById('faqs').checked = prefs.faqs;
  document.getElementById('policies').value = JSON.stringify(prefs.policies, null, '  ');
});

document.getElementById('save').addEventListener('click', () => {
  try {
    chrome.storage.local.set({
      'visibilityState': document.getElementById('visibilityState').checked,
      'hidden': document.getElementById('hidden').checked,
      'blur': document.getElementById('blur').checked,
      'mouseleave': document.getElementById('mouseleave').checked,
      'visibility': document.getElementById('visibility').checked,
      'focus': document.getElementById('focus').checked,
      'log': document.getElementById('log').checked,
      'faqs': document.getElementById('faqs').checked,
      'policies': JSON.parse(document.getElementById('policies').value || '{}')
    }, () => {
      toast.textContent = 'Options Saved';
      setTimeout(() => toast.textContent = '', 1000);
    });
  }
  catch (e) {
    toast.textContent = e.message;
    setTimeout(() => toast.textContent = '', 5000);
  }
});
// reset
document.getElementById('reset').addEventListener('click', e => {
  if (e.detail === 1) {
    toast.textContent = 'Double-click to reset!';
    window.setTimeout(() => toast.textContent = '', 750);
  }
  else {
    localStorage.clear();
    chrome.storage.local.clear(() => {
      chrome.runtime.reload();
      window.close();
    });
  }
});
// support
document.getElementById('support').addEventListener('click', () => chrome.tabs.create({
  url: chrome.runtime.getManifest().homepage_url + '?rd=donate'
}));

// report
document.getElementById('report').addEventListener('click', () => chrome.tabs.create({
  url: chrome.runtime.getManifest().homepage_url + '#reviews'
}));

// links
const links = window.links = (d = document) => {
  for (const a of [...d.querySelectorAll('[data-href]')]) {
    if (a.hasAttribute('href') === false) {
      a.href = chrome.runtime.getManifest().homepage_url + '#' + a.dataset.href;
    }
  }
};
document.addEventListener('DOMContentLoaded', () => links());
