self.addEventListener('message', function(event) {
  var promise = self.clients.matchAll()
    .then(function() {
      var data = event.data;
      var action = data.action;
      var targ_url = data.url;
      console.log(data)
      if (!action || action !== 'trace' || !targ_url) { return; }

      return fetch(targ_url, {
        body: JSON.stringify(data.params || {}), // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
      }).then((res) => {
        console.log('Just sent log. and res:');
        console.log(res);
        // event.source.postMessage('Hello! Your message was: ' + event.data);
        return
      })
    });
  if (event.waitUntil) {
    event.waitUntil(promise);
  }
});
self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});