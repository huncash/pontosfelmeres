(function () {
  var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var params = new URLSearchParams(window.location.search);
  keys.forEach(function (key) {
    var value = params.get(key);
    if (value) window.sessionStorage.setItem('pf_' + key, value.slice(0, 160));
  });
  document.querySelectorAll('form[data-lead]').forEach(function (form) {
    var source = form.querySelector('[name="source_url"]');
    var domain = form.querySelector('[name="source_domain"]');
    if (source && !source.value) source.value = window.location.href.slice(0, 1000);
    if (domain && !domain.value) domain.value = window.location.hostname;
    keys.forEach(function (key) {
      var input = form.querySelector('[name="' + key + '"]');
      if (!input || input.value) return;
      input.value = window.sessionStorage.getItem('pf_' + key) || params.get(key) || '';
    });
  });
})();
