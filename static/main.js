(function () {
  var AUTH_HOST = 'http://auth.local.com',

      token = '';

  function sendCORSRequest(params, successHandler) {
    var invocation = new XMLHttpRequest();
    (function send() {
      invocation.open(params.method, params.url, true);
      invocation.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      invocation.onreadystatechange = function () {
        if (invocation.readyState == 4) {
          if ([200, 201].indexOf(invocation.status) >= 0) {
            hideCORSError();
            successHandler(JSON.parse(invocation.responseText));
          } else {
            showCORSError(invocation.status)
          }
        }
      };
      invocation.send(params.data);
    })();
  }

  function showCORSError(status) {
    $('#serverNotAvailable').removeClass('hidden');
    $('#serverNotAvailable').find('.alert span').text('status');
  }
  function hideCORSError() {
    $('#serverNotAvailable').addClass('hidden');
  }

  function singUpOrUpSuccess(response) {
    console.log(response);
    token = response.token;
    $('#signUp').addClass('hidden');
    $('#signIn').addClass('hidden');
    $('#logout').removeClass('hidden');
    $('#info').removeClass('hidden');
    $('#latency').removeClass('hidden');
  }

  function logOutSuccess(response) {
    token = '';
    $('#logout .alert-danger').addClass('hidden').text('');
    $('#info .alert-info').text('').addClass('hidden');
    $('#info .alert-danger').text('').addClass('hidden');
    $('#info').addClass('hidden');
    $('#latency .alert-info').text('').addClass('hidden');
    $('#latency .alert-danger').text('').addClass('hidden');
    $('#latency').addClass('hidden');
    $('#signUp').removeClass('hidden');
    $('#signIn').removeClass('hidden');
    $('#logout').addClass('hidden');
    $('#info').addClass('hidden');
    $('#latency').addClass('hidden');
  }

  function getInfoSuccess(response) {
    $('#info').removeClass('hidden');
    $('#info .alert-danger').text('').addClass('hidden');
    $('#info .alert-info').removeClass('hidden').text(['User ID', response.id, 'Type', response.type].join(' '));
  }

  function getLatencySuccess(response) {
    $('#latency').removeClass('hidden');
    $('#latency .alert-danger').text('').addClass('hidden');
    $('#latency .alert-info').removeClass('hidden').text(['Latency : ', response.pingTime, 'ms'].join(' '));
  }

  function signUp(e) {
    e.preventDefault();
    sendCORSRequest({
      url: [AUTH_HOST, 'signup'].join('/'),
      method: 'post',
      data: $(this).serialize()
    }, singUpOrUpSuccess)
  }

  function signIn(e) {
    e.preventDefault();
    sendCORSRequest({
      url: [AUTH_HOST, 'signin'].join('/'),
      method: 'post',
      data: $(this).serialize()
    }, singUpOrUpSuccess)
  }

  function logOut(e) {
    var all = $(this).closest('div').find('input').prop("checked");
    sendCORSRequest({
      url: [AUTH_HOST, 'logout', '?token=' + token + '&all=' + all].join('/'),
      method: 'get'
    }, logOutSuccess)
  }

  function getInfo() {
    sendCORSRequest({
      url: [AUTH_HOST, 'info', '?token=' + token].join('/'),
      method: 'get'
    }, getInfoSuccess)
  }

  function getLatency() {
    sendCORSRequest({
      url: [AUTH_HOST, 'latency', '?token=' + token].join('/'),
      method: 'get'
    }, getLatencySuccess)
  }

  $('#signUp form').on('submit', signUp);

  $('#signIn form').on('submit', signIn);

  $('#logout button').on('click', logOut);

  $('#info a').on('click', getInfo);

  $('#latency a').on('click', getLatency);
})();