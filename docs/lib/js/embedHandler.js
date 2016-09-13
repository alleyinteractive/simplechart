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
  }

  function updateWidget(key, value) {
    // create evtDetail object
    var evtDetail = {};
    evtDetail[key] = value;
    triggerEvent(evtDetail);
  }

  function initWidget(key, value) {
    initData[key] = value;
    if (initData.data && initData.options && initData.metadata) {
      triggerEvent(initData);
      widgetRendered = true;
    }
  }

  function onReceive(evt) {
    // confirm same-origin
    if (evt.origin !== window.location.origin || !evt.data || !evt.data.messageType || !evt.data.data) {
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