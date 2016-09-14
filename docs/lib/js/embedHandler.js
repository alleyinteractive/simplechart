(function(){
  var widgetId = 'examplechart';
  var initData = {};
  var widgetRendered = false;

  function triggerEvent(evtDetail) {
    // create Event
    var widgetUpdate = new CustomEvent('widgetData', {
      detail: evtDetail
    });

    // Trigger event
    document.getElementById(widgetId).dispatchEvent(widgetUpdate);
    if (typeof smoothScroll !== 'undefined') {
      smoothScroll.animateScroll(document.querySelector('#demo-embed'));
    }
  }

  function updateWidget(key, value) {
    // create evtDetail object
    var evtDetail = {};
    evtDetail[key] = value;
    triggerEvent(evtDetail);
  }

  function initWidget(key, value) {
    initData[key] = value;
    // Must have some data and a chart type, at minimum
    if (initData.data.length > 0 && initData.options && initData.options.type) {
      triggerEvent(initData);
      widgetRendered = true;
    }
  }

  function onReceive(evt) {
    // confirm same-origin
    var sameOrigin = evt.origin === window.location.origin || evt.origin === 'http://localhost:8080';
    if (!sameOrigin || !evt.data || !evt.data.messageType || !evt.data.data) {
      return;
    }

    // get messageType -> key
    var key;
    switch (evt.data.messageType) {
      case 'save-chartData':
        key = 'data';
        break;

      case 'save-chartOptions':
        key = 'options';
        break;

      case 'save-chartMetadata':
        key = 'metadata';
        break;

      default:
        return;
    }

    if (widgetRendered) {
      updateWidget(key, evt.data.data);
    } else {
      initWidget(key, evt.data.data);
    }

  }

  window.addEventListener('message', onReceive);
})();