      function events(selector) {
            return document.querySelectorAll(selector) || [];
        }

        function uniqID(string) {
            string = string || '';
            return string + Math.random().toString(36).substr(2, 10);
        }

        function evalDateset(old, nd) {
            if (old) {
                return old + '|' + nd;
            } else {
                return nd;
            }
        }

        NodeList.prototype.on = function(event,selector,data,fn,useCapture){
            var self = Array.prototype.slice.call(this), eid = uniqID();
          if (typeof selector === "function"){
              fn = selector;
              selector = '';
              window[eid] = fn;
              return self.forEach(function (el) {
                  el.dataset[event] = evalDateset(el.dataset[event], eid);
                  el.addEventListener(event, window[eid]);
              });
          }else if(typeof selector === "string"){
              if(typeof data === "function"){
                  return self.forEach(function (el) {
                      if (selector) {
                          window[eid] = function (e) {
                              var els = events(selector),
                                  len = els.length,
                                  obj = e.target,
                                  match;
                              for (var i = 0; i < len; i++) {
                                  if (obj.matches(selector)) {
                                      data(e);
                                      e.stopPropagation();
                                      break;
                                  } else if (match = obj.closest(selector)) {
                                      for (var i = 0; i < self.length; i++) {
                                          if (self[i].contains(match)) {
                                              data(e);
                                              e.stopPropagation();
                                              break;
                                          }
                                      }
                                  }
                              }
                          }
                      }
                      el.dataset[event] = evalDateset(el.dataset[event], eid);
                      el.addEventListener(event, window[eid]);
                  });
              }else if(typeof data === "object"){

                  return self.forEach(function (el) {
                      if (selector) {
                          window[eid] = function (e) {
                              var els = events(selector),
                                  len = els.length,
                                  obj = e.target,
                                  match;
                              for (var i = 0; i < len; i++) {
                                  if (obj.matches(selector)) {
                                      fn(e);
                                      e.stopPropagation();
                                      break;
                                  } else if (match = obj.closest(selector)) {
                                      for (var i = 0; i < self.length; i++) {
                                          if (self[i].contains(match)) {
                                              fn(e);
                                              e.stopPropagation();
                                              break;
                                          }
                                      }
                                  }
                              }
                          }
                      }
                      function handleFun(e){
                          if(data)e.data=data;
                          window[eid] && window[eid].call(this,e);
                      }
                      el.dataset[event] = evalDateset(el.dataset[event], eid);
                      el.addEventListener(event, handleFun);
                  });
              }
          }else if(typeof selector === "object"){

              fn = data;
              data = selector;
              //window[eid] = fn;

              function handleFun(e){
                  if(data)e.data=data;
                  //window[eid] && window[eid].call(this,e);
                  fn && fn.call(this,e);
              }

              window[eid] = handleFun

              return self.forEach(function (el) {
                  el.dataset[event] = evalDateset(el.dataset[event], eid)
                  el.addEventListener(event,  window[eid])
                  //el.addEventListener(event,  handleFun)
              });

              /*return self.forEach(function (el) {
                  el.dataset[event] = evalDateset(el.dataset[event], eid);
                  el.addEventListener(event, window[eid]);
              });*/

          }

        }

        /*NodeList.prototype.on = function (event, selector, fn) {
            var self = Array.prototype.slice.call(this), eid = uniqID();

            if (typeof(selector) === 'function') {
                fn = selector;
                selector = '';
            }/!*else if(typeof(selector) === 'object'){
                fn = data
                data = selector
            }*!/
            window[eid] = fn;
            if (!selector) {
                return self.forEach(function (el) {
                    el.dataset[event] = evalDateset(el.dataset[event], eid);
                    el.addEventListener(event, window[eid]);
                });
            }
            return self.forEach(function (el) {
                if (selector) {
                    window[eid] = function (e) {
                        var els = $(selector),
                                len = els.length,
                                obj = e.target,
                                match;
                        for (var i = 0; i < len; i++) {
                            if (obj.matches(selector)) {
                                fn(e);
                                e.stopPropagation();
                                break;
                            } else if (match = obj.closest(selector)) {
                                for (var i = 0; i < self.length; i++) {
                                    if (self[i].contains(match)) {
                                        fn(e);
                                        e.stopPropagation();
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                el.dataset[event] = evalDateset(el.dataset[event], eid);
                el.addEventListener(event, window[eid]);
            });
            return this;
        }
*/

        NodeList.prototype.off = function (event, handle) {
            var self = Array.prototype.slice.call(this);
            self.forEach(function (el) {
                if (!event) {
                    for (var k in el.dataset) {
                        handle = el.dataset[k].split('|');
                        for (var i = 0; i < handle.length; i++)
                            el.removeEventListener(k, window[handle[i]]);
                    }
                    el.dataset = {};
                } else {
                    if (handle) {
                        el.removeEventListener(event, handle);
                    } else {
                        handle = el.dataset[event].split('|');
                        for (var i = 0; i < handle.length; i++)
                            el.removeEventListener(event, window[handle[i]]);
                        el.dataset[event] = '';
                    }
                }

            })
        }
        window.events = events;
