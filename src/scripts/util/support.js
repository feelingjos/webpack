
(function(){
    Function.prototype.method = function (name, func) {
        this.prototype[name] = func;
        return this;
    };
    if (!String.prototype.trim) { //判断下浏览器是否自带有trim()方法
        String.method('trim', function () {
            return this.replace(/^\s+|\s+$/g, '');
        });
        String.method('ltrim', function () {
            return this.replace(/^\s+/g, '');
        });
        String.method('rtrim', function () {
            return this.replace(/\s+$/g, '');
        });
    }
    if (!("classList" in document.documentElement)) {
        Object.defineProperty(window.Element.prototype, 'classList', {
            get: function () {
                var self = this

                function update(fn) {
                    return function () {
                        var className = self.className.replace(/^\s+|\s+$/g, ''),
                            valArr = arguments

                        return fn(className, valArr)
                    }
                }

                function add_rmv (className, valArr, tag) {
                    for (var i in valArr) {
                        if(typeof valArr[i] !== 'string' || !!~valArr[i].search(/\s+/g)) throw TypeError('the type of value is error')
                        var temp = valArr[i]
                        var flag = !!~className.search(new RegExp('(\\s+)?'+temp+'(\\s+)?'))
                        if (tag === 1) {
                            !flag ? className += ' ' + temp : ''
                        } else if (tag === 2) {
                            flag ? className = className.replace(new RegExp('(\\s+)?'+temp),'') : ''
                        }
                    }
                    self.className = className
                    return tag
                }

                return {
                    add: update(function (className, valArr) {
                        add_rmv(className, valArr, 1)
                    }),

                    remove: update(function (className, valArr) {
                        add_rmv(className, valArr, 2)
                    }),

                    toggle: function (value) {
                        if(typeof value !== 'string' || arguments.length === 0) throw TypeError("Failed to execute 'toggle' on 'DOMTokenList': 1 argument(string) required, but only 0 present.")
                        if (arguments.length === 1) {
                            this.contains(value) ? this.remove(value) : this.add(value)
                            return
                        }
                        !arguments[1] ? this.remove(value) : this.add(value)
                    },

                    contains: update(function (className, valArr) {
                        if (valArr.length === 0) throw TypeError("Failed to execute 'contains' on 'DOMTokenList': 1 argument required, but only 0 present.")
                        if (typeof valArr[0] !== 'string' || !!~valArr[0].search(/\s+/g)) return false
                        return !!~className.search(new RegExp(valArr[0]))
                    }),

                    item: function (index) {
                        typeof index === 'string' ? index = parseInt(index) : ''
                        if (arguments.length === 0 || typeof index !== 'number') throw TypeError("Failed to execute 'toggle' on 'DOMTokenList': 1 argument required, but only 0 present.")
                        var claArr = self.className.replace(/^\s+|\s+$/, '').split(/\s+/)
                        var len = claArr.length
                        if (index < 0 || index >= len) return null
                        return claArr[index]
                    }
                }
            }
        })
    }

    /*Object.prototype.findKe = function(key){
        console.log(this,key);
    }*/

    Object.defineProperty(Object.prototype, "findKey", {
        value: function(value, compare = (a, b) => a === b) {
            if(value){
                return Object.keys(this).find(k => compare(this[k], value))
            }
            return Object.keys(this)[0]
        },
        writable: true // 是否可以改变
    })

    /*String.prototype.aa = function () {
        const parser = new DOMParser()
        const doc = parser.parseFromString(this.trim(), 'text/xml')
        return doc
    }*/

}())
