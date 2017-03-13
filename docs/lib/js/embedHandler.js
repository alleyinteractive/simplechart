(function(){
  var widgetId = 'examplechart';
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

  function updateWidget(data) {
    triggerEvent(data);
  }

  function initWidget(data) {
    // Must have some data and a chart type, at minimum
    if (data.data.length > 0 && data.options && data.options.type) {
      triggerEvent(data);
      widgetRendered = true;
    }
  }

  function onReceive(evt) {
    // confirm same-origin
    var sameOrigin = evt.origin === window.location.origin || evt.origin === 'http://localhost:8080';
    if (!sameOrigin || !evt.data || !evt.data.messageType || !evt.data.data) {
      return;
    }

    if ('saveChart' !== evt.data.messageType) {
      return;
    }

    var widgetData = {
      data: evt.data.data.chartData,
      options: evt.data.data.chartOptions,
      metadata: evt.data.data.chartOptions
    };

    if (widgetRendered) {
      updateWidget(widgetData);
    } else {
      initWidget(widgetData);
    }

  }

  window.addEventListener('message', onReceive);
})();