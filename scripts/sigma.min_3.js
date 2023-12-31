/* sigma.js - A JavaScript library dedicated to graph drawing. - Version: 1.0.1 - Author: Alexis Jacomy, Sciences-Po MÃŠdialab - License: MIT */
(function() {
    "use strict";
    var a = {}
      , b = function(c) {
        var d, e, f, g, h;
        b.classes.dispatcher.extend(this);
        var i = this
          , j = c || {};
        if ("string" == typeof j || j instanceof HTMLElement ? j = {
            renderers: [j]
        } : "[object Array]" === Object.prototype.toString.call(j) && (j = {
            renderers: j
        }),
        g = j.renderers || j.renderer || j.container,
        j.renderers && 0 !== j.renderers.length || ("string" == typeof g || g instanceof HTMLElement || "object" == typeof g && "container"in g) && (j.renderers = [g]),
        j.id) {
            if (a[j.id])
                throw 'sigma: Instance "' + j.id + '" already exists.';
            Object.defineProperty(this, "id", {
                value: j.id
            })
        } else {
            for (h = 0; a[h]; )
                h++;
            Object.defineProperty(this, "id", {
                value: "" + h
            })
        }
        for (a[this.id] = this,
        this.settings = new b.classes.configurable(b.settings,j.settings || {}),
        Object.defineProperty(this, "graph", {
            value: new b.classes.graph(this.settings),
            configurable: !0
        }),
        Object.defineProperty(this, "middlewares", {
            value: [],
            configurable: !0
        }),
        Object.defineProperty(this, "cameras", {
            value: {},
            configurable: !0
        }),
        Object.defineProperty(this, "renderers", {
            value: {},
            configurable: !0
        }),
        Object.defineProperty(this, "renderersPerCamera", {
            value: {},
            configurable: !0
        }),
        Object.defineProperty(this, "cameraFrames", {
            value: {},
            configurable: !0
        }),
        this._handler = function(a) {
            var b, c = {};
            for (b in a.data)
                c[b] = a.data[b];
            c.renderer = a.target,
            this.dispatchEvent(a.type, c)
        }
        .bind(this),
        f = j.renderers || [],
        d = 0,
        e = f.length; e > d; d++)
            this.addRenderer(f[d]);
        for (f = j.middlewares || [],
        d = 0,
        e = f.length; e > d; d++)
            this.middlewares.push("string" == typeof f[d] ? b.middlewares[f[d]] : f[d]);
        "object" == typeof j.graph && j.graph && (this.graph.read(j.graph),
        this.refresh()),
        window.addEventListener("resize", function() {
            i.settings && i.refresh()
        })
    };
    if (b.prototype.addCamera = function(a) {
        var c, d = this;
        if (!arguments.length) {
            for (a = 0; this.cameras["" + a]; )
                a++;
            a = "" + a
        }
        if (this.cameras[a])
            throw 'sigma.addCamera: The camera "' + a + '" already exists.';
        return c = new b.classes.camera(a,this.graph,this.settings),
        this.cameras[a] = c,
        c.quadtree = new b.classes.quad,
        c.bind("coordinatesUpdated", function() {
            d.renderCamera(c, c.isAnimated)
        }),
        this.renderersPerCamera[a] = [],
        c
    }
    ,
    b.prototype.killCamera = function(a) {
        if (a = "string" == typeof a ? this.cameras[a] : a,
        !a)
            throw "sigma.killCamera: The camera is undefined.";
        var b, c, d = this.renderersPerCamera[a.id];
        for (c = d.length,
        b = c - 1; b >= 0; b--)
            this.killRenderer(d[b]);
        return delete this.renderersPerCamera[a.id],
        delete this.cameraFrames[a.id],
        delete this.cameras[a.id],
        a.kill && a.kill(),
        this
    }
    ,
    b.prototype.addRenderer = function(a) {
        var c, d, e, f, g = a || {};
        if ("string" == typeof g ? g = {
            container: document.getElementById(g)
        } : g instanceof HTMLElement && (g = {
            container: g
        }),
        "id"in g)
            c = g.id;
        else {
            for (c = 0; this.renderers["" + c]; )
                c++;
            c = "" + c
        }
        if (this.renderers[c])
            throw 'sigma.addRenderer: The renderer "' + c + '" already exists.';
        if (d = "function" == typeof g.type ? g.type : b.renderers[g.type],
        d = d || b.renderers.def,
        e = "camera"in g ? g.camera instanceof b.classes.camera ? g.camera : this.cameras[g.camera] || this.addCamera(g.camera) : this.addCamera(),
        this.cameras[e.id] !== e)
            throw "sigma.addRenderer: The camera is not properly referenced.";
        return f = new d(this.graph,e,this.settings,g),
        this.renderers[c] = f,
        Object.defineProperty(f, "id", {
            value: c
        }),
        f.bind && f.bind(["click", "clickStage", "doubleClickStage", "clickNode", "clickNodes", "doubleClickNode", "doubleClickNodes", "overNode", "overNodes", "outNode", "outNodes", "downNode", "downNodes", "upNode", "upNodes"], this._handler),
        this.renderersPerCamera[e.id].push(f),
        f
    }
    ,
    b.prototype.killRenderer = function(a) {
        if (a = "string" == typeof a ? this.renderers[a] : a,
        !a)
            throw "sigma.killRenderer: The renderer is undefined.";
        var b = this.renderersPerCamera[a.camera.id]
          , c = b.indexOf(a);
        return c >= 0 && b.splice(c, 1),
        a.kill && a.kill(),
        delete this.renderers[a.id],
        this
    }
    ,
    b.prototype.refresh = function() {
        var a, c, d, e, f, g, h = 0;
        for (e = this.middlewares || [],
        a = 0,
        c = e.length; c > a; a++)
            e[a].call(this, 0 === a ? "" : "tmp" + h + ":", a === c - 1 ? "ready:" : "tmp" + ++h + ":");
        for (d in this.cameras)
            f = this.cameras[d],
            f.settings("autoRescale") && this.renderersPerCamera[f.id] && this.renderersPerCamera[f.id].length ? b.middlewares.rescale.call(this, e.length ? "ready:" : "", f.readPrefix, {
                width: this.renderersPerCamera[f.id][0].width,
                height: this.renderersPerCamera[f.id][0].height
            }) : b.middlewares.copy.call(this, e.length ? "ready:" : "", f.readPrefix),
            g = b.utils.getBoundaries(this.graph, f.readPrefix),
            f.quadtree.index(this.graph.nodes(), {
                prefix: f.readPrefix,
                bounds: {
                    x: g.minX,
                    y: g.minY,
                    width: g.maxX - g.minX,
                    height: g.maxY - g.minY
                }
            });
        for (e = Object.keys(this.renderers),
        a = 0,
        c = e.length; c > a; a++)
            if (this.renderers[e[a]].process)
                if (this.settings("skipErrors"))
                    try {
                        this.renderers[e[a]].process()
                    } catch (i) {
                        console.log('Warning: The renderer "' + e[a] + '" crashed on ".process()"')
                    }
                else
                    this.renderers[e[a]].process();
        return this.render(),
        this
    }
    ,
    b.prototype.render = function() {
        var a, b, c;
        for (c = Object.keys(this.renderers),
        a = 0,
        b = c.length; b > a; a++)
            if (this.settings("skipErrors"))
                try {
                    this.renderers[c[a]].render()
                } catch (d) {
                    this.settings("verbose") && console.log('Warning: The renderer "' + c[a] + '" crashed on ".render()"')
                }
            else
                this.renderers[c[a]].render();
        return this
    }
    ,
    b.prototype.renderCamera = function(a, b) {
        var c, d, e, f = this;
        if (b)
            for (e = this.renderersPerCamera[a.id],
            c = 0,
            d = e.length; d > c; c++)
                if (this.settings("skipErrors"))
                    try {
                        e[c].render()
                    } catch (g) {
                        this.settings("verbose") && console.log('Warning: The renderer "' + e[c].id + '" crashed on ".render()"')
                    }
                else
                    e[c].render();
        else if (!this.cameraFrames[a.id]) {
            for (e = this.renderersPerCamera[a.id],
            c = 0,
            d = e.length; d > c; c++)
                if (this.settings("skipErrors"))
                    try {
                        e[c].render()
                    } catch (g) {
                        this.settings("verbose") && console.log('Warning: The renderer "' + e[c].id + '" crashed on ".render()"')
                    }
                else
                    e[c].render();
            this.cameraFrames[a.id] = requestAnimationFrame(function() {
                delete f.cameraFrames[a.id]
            })
        }
        return this
    }
    ,
    b.prototype.kill = function() {
        var b;
        this.graph.kill(),
        delete this.middlewares;
        for (b in this.renderers)
            this.killRenderer(this.renderers[b]);
        for (b in this.cameras)
            this.killCamera(this.cameras[b]);
        delete this.renderers,
        delete this.cameras;
        for (b in this)
            this.hasOwnProperty(b) && delete this[b];
        delete a[this.id]
    }
    ,
    b.instances = function(c) {
        return arguments.length ? a[c] : b.utils.extend({}, a)
    }
    ,
    "undefined" != typeof this.sigma)
        throw "An object called sigma is already in the global scope.";
    "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = b),
    exports.sigma = b) : this.sigma = b
}
).call(this),
function(a) {
    "use strict";
    function b(a, c) {
        var d, e, f, g;
        if (arguments.length)
            if (1 === arguments.length && Object(arguments[0]) === arguments[0])
                for (a in arguments[0])
                    b(a, arguments[0][a]);
            else if (arguments.length > 1)
                for (g = Array.isArray(a) ? a : a.split(/ /),
                d = 0,
                e = g.length; d !== e; d += 1)
                    f = g[d],
                    C[f] || (C[f] = []),
                    C[f].push({
                        handler: c
                    })
    }
    function c(a, b) {
        var c, d, e, f, g, h, i = Array.isArray(a) ? a : a.split(/ /);
        if (arguments.length)
            if (b)
                for (c = 0,
                d = i.length; c !== d; c += 1) {
                    if (h = i[c],
                    C[h]) {
                        for (g = [],
                        e = 0,
                        f = C[h].length; e !== f; e += 1)
                            C[h][e].handler !== b && g.push(C[h][e]);
                        C[h] = g
                    }
                    C[h] && 0 === C[h].length && delete C[h]
                }
            else
                for (c = 0,
                d = i.length; c !== d; c += 1)
                    delete C[i[c]];
        else
            C = Object.create(null)
    }
    function d(a, b) {
        var c, d, e, f, g, h, i = Array.isArray(a) ? a : a.split(/ /);
        for (b = void 0 === b ? {} : b,
        c = 0,
        e = i.length; c !== e; c += 1)
            if (h = i[c],
            C[h])
                for (g = {
                    type: h,
                    data: b || {}
                },
                d = 0,
                f = C[h].length; d !== f; d += 1)
                    try {
                        C[h][d].handler(g)
                    } catch (j) {}
    }
    function e() {
        var a, b, c, d, e = !1, f = s(), g = x.shift();
        if (c = g.job(),
        f = s() - f,
        g.done++,
        g.time += f,
        g.currentTime += f,
        g.weightTime = g.currentTime / (g.weight || 1),
        g.averageTime = g.time / g.done,
        d = g.count ? g.count <= g.done : !c,
        !d) {
            for (a = 0,
            b = x.length; b > a; a++)
                if (x[a].weightTime > g.weightTime) {
                    x.splice(a, 0, g),
                    e = !0;
                    break
                }
            e || x.push(g)
        }
        return d ? g : null
    }
    function f(a) {
        var b = x.length;
        w[a.id] = a,
        a.status = "running",
        b && (a.weightTime = x[b - 1].weightTime,
        a.currentTime = a.weightTime * (a.weight || 1)),
        a.startTime = s(),
        d("jobStarted", q(a)),
        x.push(a)
    }
    function g() {
        var a, b, c;
        for (a in v)
            b = v[a],
            b.after ? y[a] = b : f(b),
            delete v[a];
        for (u = !!x.length; x.length && s() - t < B.frameDuration; )
            if (c = e()) {
                i(c.id);
                for (a in y)
                    y[a].after === c.id && (f(y[a]),
                    delete y[a])
            }
        u ? (t = s(),
        d("enterFrame"),
        setTimeout(g, 0)) : d("stop")
    }
    function h(a, b) {
        var c, e, f;
        if (Array.isArray(a)) {
            for (A = !0,
            c = 0,
            e = a.length; e > c; c++)
                h(a[c].id, p(a[c], b));
            A = !1,
            u || (t = s(),
            d("start"),
            g())
        } else if ("object" == typeof a)
            if ("string" == typeof a.id)
                h(a.id, a);
            else {
                A = !0;
                for (c in a)
                    "function" == typeof a[c] ? h(c, p({
                        job: a[c]
                    }, b)) : h(c, p(a[c], b));
                A = !1,
                u || (t = s(),
                d("start"),
                g())
            }
        else {
            if ("string" != typeof a)
                throw new Error("[conrad.addJob] Wrong arguments.");
            if (k(a))
                throw new Error('[conrad.addJob] Job with id "' + a + '" already exists.');
            if ("function" == typeof b)
                f = {
                    id: a,
                    done: 0,
                    time: 0,
                    status: "waiting",
                    currentTime: 0,
                    averageTime: 0,
                    weightTime: 0,
                    job: b
                };
            else {
                if ("object" != typeof b)
                    throw new Error("[conrad.addJob] Wrong arguments.");
                f = p({
                    id: a,
                    done: 0,
                    time: 0,
                    status: "waiting",
                    currentTime: 0,
                    averageTime: 0,
                    weightTime: 0
                }, b)
            }
            v[a] = f,
            d("jobAdded", q(f)),
            u || A || (t = s(),
            d("start"),
            g())
        }
        return this
    }
    function i(a) {
        var b, c, e, f, g = !1;
        if (Array.isArray(a))
            for (b = 0,
            c = a.length; c > b; b++)
                i(a[b]);
        else {
            if ("string" != typeof a)
                throw new Error("[conrad.killJob] Wrong arguments.");
            for (e = [w, y, v],
            b = 0,
            c = e.length; c > b; b++)
                a in e[b] && (f = e[b][a],
                B.history && (f.status = "done",
                z.push(f)),
                d("jobEnded", q(f)),
                delete e[b][a],
                "function" == typeof f.end && f.end(),
                g = !0);
            for (e = x,
            b = 0,
            c = e.length; c > b; b++)
                if (e[b].id === a) {
                    e.splice(b, 1);
                    break
                }
            if (!g)
                throw new Error('[conrad.killJob] Job "' + a + '" not found.')
        }
        return this
    }
    function j() {
        var a, b = p(v, w, y);
        if (B.history)
            for (a in b)
                b[a].status = "done",
                z.push(b[a]),
                "function" == typeof b[a].end && b[a].end();
        return v = {},
        y = {},
        w = {},
        x = [],
        u = !1,
        this
    }
    function k(a) {
        var b = v[a] || w[a] || y[a];
        return b ? p(b) : null
    }
    function l() {
        var a;
        if ("string" == typeof a1 && 1 === arguments.length)
            return B[a1];
        a = "object" == typeof a1 && 1 === arguments.length ? a1 || {} : {},
        "string" == typeof a1 && (a[a1] = a2);
        for (var b in a)
            void 0 !== a[b] ? B[b] = a[b] : delete B[b];
        return this
    }
    function m() {
        return u
    }
    function n() {
        return z = [],
        this
    }
    function o(a, b) {
        var c, d, e, f, g, h, i;
        if (!arguments.length) {
            g = [];
            for (d in v)
                g.push(v[d]);
            for (d in y)
                g.push(y[d]);
            for (d in w)
                g.push(w[d]);
            g = g.concat(z)
        }
        if ("string" == typeof a)
            switch (a) {
            case "waiting":
                g = r(y);
                break;
            case "running":
                g = r(w);
                break;
            case "done":
                g = z;
                break;
            default:
                h = a
            }
        if (a instanceof RegExp && (h = a),
        !h && ("string" == typeof b || b instanceof RegExp) && (h = b),
        h) {
            if (i = "string" == typeof h,
            g instanceof Array)
                c = g;
            else if ("object" == typeof g) {
                c = [];
                for (d in g)
                    c = c.concat(g[d])
            } else {
                c = [];
                for (d in v)
                    c.push(v[d]);
                for (d in y)
                    c.push(y[d]);
                for (d in w)
                    c.push(w[d]);
                c = c.concat(z)
            }
            for (g = [],
            e = 0,
            f = c.length; f > e; e++)
                (i ? c[e].id === h : c[e].id.match(h)) && g.push(c[e])
        }
        return q(g)
    }
    function p() {
        var a, b, c = {}, d = arguments.length;
        for (a = d - 1; a >= 0; a--)
            for (b in arguments[a])
                c[b] = arguments[a][b];
        return c
    }
    function q(a) {
        var b, c, d;
        if (!a)
            return a;
        if (Array.isArray(a))
            for (b = [],
            c = 0,
            d = a.length; d > c; c++)
                b.push(q(a[c]));
        else if ("object" == typeof a) {
            b = {};
            for (c in a)
                b[c] = q(a[c])
        } else
            b = a;
        return b
    }
    function r(a) {
        var b, c = [];
        for (b in a)
            c.push(a[b]);
        return c
    }
    function s() {
        return Date.now ? Date.now() : (new Date).getTime()
    }
    if (a.conrad)
        throw new Error("conrad already exists");
    var t, u = !1, v = {}, w = {}, x = [], y = {}, z = [], A = !1, B = {
        frameDuration: 20,
        history: !0
    }, C = Object.create(null);
    Array.isArray || (Array.isArray = function(a) {
        return "[object Array]" === Object.prototype.toString.call(a)
    }
    );
    var D = {
        hasJob: k,
        addJob: h,
        killJob: i,
        killAll: j,
        settings: l,
        getStats: o,
        isRunning: m,
        clearHistory: n,
        bind: b,
        unbind: c,
        version: "0.1.0"
    };
    "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = D),
    exports.conrad = D) : a.conrad = D
}(this),
function(a) {
    "use strict";
    if ("undefined" == typeof sigma)
        throw "sigma is not declared";
    var b = this;
    sigma.utils = sigma.utils || {},
    sigma.utils.extend = function() {
        var a, b, c = {}, d = arguments.length;
        for (a = d - 1; a >= 0; a--)
            for (b in arguments[a])
                c[b] = arguments[a][b];
        return c
    }
    ,
    sigma.utils.dateNow = function() {
        return Date.now ? Date.now() : (new Date).getTime()
    }
    ,
    sigma.utils.pkg = function(a) {
        return (a || "").split(".").reduce(function(a, b) {
            return b in a ? a[b] : a[b] = {}
        }, b)
    }
    ,
    sigma.utils.id = function() {
        var a = 0;
        return function() {
            return ++a
        }
    }(),
    sigma.utils.floatColor = function(a) {
        var b = [0, 0, 0];
        return a.match(/^#/) ? (a = (a || "").replace(/^#/, ""),
        b = 3 === a.length ? [parseInt(a.charAt(0) + a.charAt(0), 16), parseInt(a.charAt(1) + a.charAt(1), 16), parseInt(a.charAt(2) + a.charAt(2), 16)] : [parseInt(a.charAt(0) + a.charAt(1), 16), parseInt(a.charAt(2) + a.charAt(3), 16), parseInt(a.charAt(4) + a.charAt(5), 16)]) : a.match(/^ *rgba? *\(/) && (a = a.match(/^ *rgba? *\( *([0-9]*) *, *([0-9]*) *, *([0-9]*) *(,.*)?\) *$/),
        b = [+a[1], +a[2], +a[3]]),
        256 * b[0] * 256 + 256 * b[1] + b[2]
    }
    ,
    sigma.utils.getX = function(b) {
        return b.offsetX !== a && b.offsetX || b.layerX !== a && b.layerX || b.clientX !== a && b.clientX
    }
    ,
    sigma.utils.getY = function(b) {
        return b.offsetY !== a && b.offsetY || b.layerY !== a && b.layerY || b.clientY !== a && b.clientY
    }
    ,
    sigma.utils.getDelta = function(b) {
        return b.wheelDelta !== a && b.wheelDelta || b.detail !== a && -b.detail
    }
    ,
    sigma.utils.getOffset = function(a) {
        for (var b = 0, c = 0; a; )
            c += parseInt(a.offsetTop),
            b += parseInt(a.offsetLeft),
            a = a.offsetParent;
        return {
            top: c,
            left: b
        }
    }
    ,
    sigma.utils.doubleClick = function(a, b, c) {
        var d = 0;
        a.addEventListener(b, function(a) {
            return d++,
            2 === d ? (d = 0,
            c(a)) : void (1 === d && setTimeout(function() {
                d = 0
            }, sigma.settings.doubleClickTimeout))
        }, !1)
    }
    ,
    sigma.utils.easings = sigma.utils.easings || {},
    sigma.utils.easings.linearNone = function(a) {
        return a
    }
    ,
    sigma.utils.easings.quadraticIn = function(a) {
        return a * a
    }
    ,
    sigma.utils.easings.quadraticOut = function(a) {
        return a * (2 - a)
    }
    ,
    sigma.utils.easings.quadraticInOut = function(a) {
        return (a *= 2) < 1 ? .5 * a * a : -.5 * (--a * (a - 2) - 1)
    }
    ,
    sigma.utils.easings.cubicIn = function(a) {
        return a * a * a
    }
    ,
    sigma.utils.easings.cubicOut = function(a) {
        return --a * a * a + 1
    }
    ,
    sigma.utils.easings.cubicInOut = function(a) {
        return (a *= 2) < 1 ? .5 * a * a * a : .5 * ((a -= 2) * a * a + 2)
    }
    ,
    sigma.utils.loadShader = function(a, b, c, d) {
        var e, f = a.createShader(c);
        return a.shaderSource(f, b),
        a.compileShader(f),
        e = a.getShaderParameter(f, a.COMPILE_STATUS),
        e ? f : (d && d('Error compiling shader "' + f + '":' + a.getShaderInfoLog(f)),
        a.deleteShader(f),
        null)
    }
    ,
    sigma.utils.loadProgram = function(a, b, c, d, e) {
        var f, g, h = a.createProgram();
        for (f = 0; f < b.length; ++f)
            a.attachShader(h, b[f]);
        if (c)
            for (f = 0; f < c.length; ++f)
                a.bindAttribLocation(h, locations ? locations[f] : f, opt_attribs[f]);
        return a.linkProgram(h),
        g = a.getProgramParameter(h, a.LINK_STATUS),
        g ? h : (e && e("Error in program linking: " + a.getProgramInfoLog(h)),
        a.deleteProgram(h),
        null)
    }
    ,
    sigma.utils.pkg("sigma.utils.matrices"),
    sigma.utils.matrices.translation = function(a, b) {
        return [1, 0, 0, 0, 1, 0, a, b, 1]
    }
    ,
    sigma.utils.matrices.rotation = function(a, b) {
        var c = Math.cos(a)
          , d = Math.sin(a);
        return b ? [c, -d, d, c] : [c, -d, 0, d, c, 0, 0, 0, 1]
    }
    ,
    sigma.utils.matrices.scale = function(a, b) {
        return b ? [a, 0, 0, a] : [a, 0, 0, 0, a, 0, 0, 0, 1]
    }
    ,
    sigma.utils.matrices.multiply = function(a, b, c) {
        var d = c ? 2 : 3
          , e = a[0 * d + 0]
          , f = a[0 * d + 1]
          , g = a[0 * d + 2]
          , h = a[1 * d + 0]
          , i = a[1 * d + 1]
          , j = a[1 * d + 2]
          , k = a[2 * d + 0]
          , l = a[2 * d + 1]
          , m = a[2 * d + 2]
          , n = b[0 * d + 0]
          , o = b[0 * d + 1]
          , p = b[0 * d + 2]
          , q = b[1 * d + 0]
          , r = b[1 * d + 1]
          , s = b[1 * d + 2]
          , t = b[2 * d + 0]
          , u = b[2 * d + 1]
          , v = b[2 * d + 2];
        return c ? [e * n + f * q, e * o + f * r, h * n + i * q, h * o + i * r] : [e * n + f * q + g * t, e * o + f * r + g * u, e * p + f * s + g * v, h * n + i * q + j * t, h * o + i * r + j * u, h * p + i * s + j * v, k * n + l * q + m * t, k * o + l * r + m * u, k * p + l * s + m * v]
    }
}
.call(this),
function() {
    "use strict";
    var a, b = 0, c = ["ms", "moz", "webkit", "o"];
    for (a = 0; a < c.length && !window.requestAnimationFrame; a++)
        window.requestAnimationFrame = window[c[a] + "RequestAnimationFrame"],
        window.cancelAnimationFrame = window[c[a] + "CancelAnimationFrame"] || window[c[a] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function(a) {
        var c = (new Date).getTime()
          , d = Math.max(0, 16 - (c - b))
          , e = window.setTimeout(function() {
            a(c + d)
        }, d);
        return b = c + d,
        e
    }
    ),
    window.cancelAnimationFrame || (window.cancelAnimationFrame = function(a) {
        clearTimeout(a)
    }
    ),
    Function.prototype.bind || (Function.prototype.bind = function(a) {
        if ("function" != typeof this)
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        var b, c, d = Array.prototype.slice.call(arguments, 1), e = this;
        return b = function() {}
        ,
        c = function() {
            return e.apply(this instanceof b && a ? this : a, d.concat(Array.prototype.slice.call(arguments)))
        }
        ,
        b.prototype = this.prototype,
        c.prototype = new b,
        c
    }
    )
}
.call(this),
function() {
    "use strict";
    if ("undefined" == typeof sigma)
        throw "sigma is not declared";
    sigma.utils.pkg("sigma.settings");
    var a = {
        clone: !0,
        immutable: !0,
        verbose: !1,
        defaultLabelColor: "#000", //cor padrão do label do nome
        defaultEdgeColor: "#000",
        defaultNodeColor: "#000",
        defaultLabelSize: 16, //tamanho da fonte
        edgeColor: "source", //cor das linhas
        font: "Helvética", //fonte
        fontStyle: "", //italica, negrito
        labelColor: "default",
        labelSize: "fixed",
        labelSizeRatio: 1,
        labelThreshold: 8,
        webglOversamplingRatio: 1,
        borderSize: 1, //tamanho da borda
        defaultNodeBorderColor: "#000", //cor da borda
        hoverFont: "", // fonte hover
        hoverFontStyle: "bold", // estilo fonte hover
        labelHoverShadow: "default",
        labelHoverShadowColor: "#000",
        nodeHoverColor: "node",
        defaultNodeHoverColor: "#000",
        labelHoverBGColor: "default",
        defaultHoverLabelBGColor: "#fff", //cor do fundo da label no hover
        labelHoverColor: "default",
        defaultLabelHoverColor: "#000", //cor da letra no label hover
        drawLabels: !0,
        drawEdges: !0,
        drawNodes: !0,
        batchEdgesDrawing: !1,
        hideEdgesOnMove: !1,
        canvasEdgesBatchSize: 500,
        webglEdgesBatchSize: 1e3,
        scalingMode: "inside",
        sideMargin: 10,
        minEdgeSize: .5,
        maxEdgeSize: 1,
        minNodeSize: 1,
        maxNodeSize: 8,
        touchEnabled: !0,
        mouseEnabled: !0,
        doubleClickEnabled: !0,
        eventsEnabled: !0,
        zoomingRatio: 5,
        doubleClickZoomingRatio: 3,
        zoomMin: .0625,
        zoomMax: 6,
        mouseZoomDuration: 200,
        doubleClickZoomDuration: 100,
        mouseInertiaDuration: 600,
        mouseInertiaRatio: 5,
        touchInertiaDuration: 200,
        touchInertiaRatio: 3,
        doubleClickTimeout: 300,
        doubleTapTimeout: 300,
        dragTimeout: 200,
        autoResize: !0,
        autoRescale: !0,
        enableCamera: !0,
        enableHovering: !0,
        rescaleIgnoreSize: !1,
        skipErrors: !0,
        nodesPowRatio: .5,
        edgesPowRatio: .5,
        animationsTime: 200
    };
    sigma.settings = sigma.utils.extend(sigma.settings || {}, a)
}
.call(this),
function() {
    "use strict";
    var a = function() {
        Object.defineProperty(this, "_handlers", {
            value: {}
        })
    };
    a.prototype.bind = function(a, b) {
        var c, d, e, f;
        if (1 === arguments.length && "object" == typeof arguments[0])
            for (a in arguments[0])
                this.bind(a, arguments[0][a]);
        else {
            if (2 !== arguments.length || "function" != typeof arguments[1])
                throw "bind: Wrong arguments.";
            for (f = "string" == typeof a ? a.split(" ") : a,
            c = 0,
            d = f.length; c !== d; c += 1)
                e = f[c],
                e && (this._handlers[e] || (this._handlers[e] = []),
                this._handlers[e].push({
                    handler: b
                }))
        }
        return this
    }
    ,
    a.prototype.unbind = function(a, b) {
        var c, d, e, f, g, h, i, j = "string" == typeof a ? a.split(" ") : a;
        if (!arguments.length) {
            for (g in this._handlers)
                delete this._handlers[g];
            return this
        }
        if (b)
            for (c = 0,
            d = j.length; c !== d; c += 1) {
                if (i = j[c],
                this._handlers[i]) {
                    for (h = [],
                    e = 0,
                    f = this._handlers[i].length; e !== f; e += 1)
                        this._handlers[i][e].handler !== b && h.push(this._handlers[i][e]);
                    this._handlers[i] = h
                }
                this._handlers[i] && 0 === this._handlers[i].length && delete this._handlers[i]
            }
        else
            for (c = 0,
            d = j.length; c !== d; c += 1)
                delete this._handlers[j[c]];
        return this
    }
    ,
    a.prototype.dispatchEvent = function(a, b) {
        var c, d, e, f, g, h, i, j = this, k = "string" == typeof a ? a.split(" ") : a;
        for (b = void 0 === b ? {} : b,
        c = 0,
        d = k.length; c !== d; c += 1)
            if (i = k[c],
            this._handlers[i]) {
                for (h = j.getEvent(i, b),
                g = [],
                e = 0,
                f = this._handlers[i].length; e !== f; e += 1)
                    this._handlers[i][e].handler(h),
                    this._handlers[i][e].one || g.push(this._handlers[i][e]);
                this._handlers[i] = g
            }
        return this
    }
    ,
    a.prototype.getEvent = function(a, b) {
        return {
            type: a,
            data: b || {},
            target: this
        }
    }
    ,
    a.extend = function(b, c) {
        var d;
        for (d in a.prototype)
            a.prototype.hasOwnProperty(d) && (b[d] = a.prototype[d]);
        a.apply(b, c)
    }
    ,
    "undefined" != typeof this.sigma ? (this.sigma.classes = this.sigma.classes || {},
    this.sigma.classes.dispatcher = a) : "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = a),
    exports.dispatcher = a) : this.dispatcher = a
}
.call(this),
function() {
    "use strict";
    var a = function() {
        var b, c, d = {}, e = Array.prototype.slice.call(arguments, 0), f = function(a, g) {
            var h, i;
            if (1 === arguments.length && "string" == typeof a) {
                if (a in d && void 0 !== d[a])
                    return d[a];
                for (b = 0,
                c = e.length; c > b; b++)
                    if (a in e[b] && void 0 !== e[b][a])
                        return e[b][a];
                return void 0
            }
            if ("object" == typeof a && "string" == typeof g)
                return g in (a || {}) ? a[g] : f(g);
            h = "object" == typeof a && void 0 === g ? a : {},
            "string" == typeof a && (h[a] = g);
            for (i in h)
                d[i] = h[i];
            return this
        };
        for (f.embedObjects = function() {
            var b = e.concat(d).concat(Array.prototype.splice.call(arguments, 0));
            return a.apply({}, b)
        }
        ,
        b = 0,
        c = arguments.length; c > b; b++)
            f(arguments[b]);
        return f
    };
    "undefined" != typeof this.sigma ? (this.sigma.classes = this.sigma.classes || {},
    this.sigma.classes.configurable = a) : "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = a),
    exports.configurable = a) : this.configurable = a
}
.call(this),
function() {
    "use strict";
    function a(a, b, c) {
        var d = function() {
            var d, e;
            e = c.apply(b, arguments);
            for (d in f[a])
                f[a][d].apply(b, arguments);
            return e
        };
        return d
    }
    function b(a) {
        var b;
        for (b in a)
            "hasOwnProperty"in a && !a.hasOwnProperty(b) || delete a[b];
        return a
    }
    var c = Object.create(null)
      , d = Object.create(null)
      , e = Object.create(null)
      , f = Object.create(null)
      , g = {
        immutable: !0,
        clone: !0
    }
      , h = function(a) {
        return g[a]
    }
      , i = function(b) {
        var d, f, g;
        g = {
            settings: b || h,
            nodesArray: [],
            edgesArray: [],
            nodesIndex: Object.create(null),
            edgesIndex: Object.create(null),
            inNeighborsIndex: Object.create(null),
            outNeighborsIndex: Object.create(null),
            allNeighborsIndex: Object.create(null),
            inNeighborsCount: Object.create(null),
            outNeighborsCount: Object.create(null),
            allNeighborsCount: Object.create(null)
        };
        for (d in e)
            e[d].call(g);
        for (d in c)
            f = a(d, g, c[d]),
            this[d] = f,
            g[d] = f
    };
    i.addMethod = function(a, b) {
        if ("string" != typeof a || "function" != typeof b || 2 !== arguments.length)
            throw "addMethod: Wrong arguments.";
        if (c[a])
            throw 'The method "' + a + '" already exists.';
        return c[a] = b,
        f[a] = Object.create(null),
        this
    }
    ,
    i.attach = function(a, b, c) {
        if ("string" != typeof a || "string" != typeof b || "function" != typeof c || 3 !== arguments.length)
            throw "attach: Wrong arguments.";
        var d;
        if ("constructor" === a)
            d = e;
        else {
            if (!f[a])
                throw 'The method "' + a + '" does not exist.';
            d = f[a]
        }
        if (d[b])
            throw 'A function "' + b + '" is already attached to the method "' + a + '".';
        return d[b] = c,
        this
    }
    ,
    i.addIndex = function(a, b) {
        if ("string" != typeof a || Object(b) !== b || 2 !== arguments.length)
            throw "addIndex: Wrong arguments.";
        if (d[a])
            throw 'The index "' + a + '" already exists.';
        var c;
        d[a] = b;
        for (c in b) {
            if ("function" != typeof b[c])
                throw "The bindings must be functions.";
            i.attach(c, a, b[c])
        }
        return this
    }
    ,
    i.addMethod("addNode", function(a) {
        if (Object(a) !== a || 1 !== arguments.length)
            throw "addNode: Wrong arguments.";
        if ("string" != typeof a.id)
            throw "The node must have a string id.";
        if (this.nodesIndex[a.id])
            throw 'The node "' + a.id + '" already exists.';
        var b, c = a.id, d = Object.create(null);
        if (this.settings("clone"))
            for (b in a)
                "id" !== b && (d[b] = a[b]);
        else
            d = a;
        return this.settings("immutable") ? Object.defineProperty(d, "id", {
            value: c,
            enumerable: !0
        }) : d.id = c,
        this.inNeighborsIndex[c] = Object.create(null),
        this.outNeighborsIndex[c] = Object.create(null),
        this.allNeighborsIndex[c] = Object.create(null),
        this.inNeighborsCount[c] = 0,
        this.outNeighborsCount[c] = 0,
        this.allNeighborsCount[c] = 0,
        this.nodesArray.push(d),
        this.nodesIndex[d.id] = d,
        this
    }),
    i.addMethod("addEdge", function(a) {
        if (Object(a) !== a || 1 !== arguments.length)
            throw "addEdge: Argumentos errados.";
        if ("string" != typeof a.id)
            throw "A borda deve ter um ID de string.";
        if ("string" != typeof a.source || !this.nodesIndex[a.source])
            throw "A origem da borda deve ter um ID de nó existente.";
        if ("string" != typeof a.target || !this.nodesIndex[a.target])
            throw "O destino de borda deve ter um ID de nó existente.";
        if (this.edgesIndex[a.id])
            throw 'A borda"' + a.id + '" já existe.';
        var b, c = Object.create(null);
        if (this.settings("clone"))
            for (b in a)
                "id" !== b && "source" !== b && "target" !== b && (c[b] = a[b]);
        else
            c = a;
        return this.settings("immutable") ? (Object.defineProperty(c, "id", {
            value: a.id,
            enumerable: !0
        }),
        Object.defineProperty(c, "source", {
            value: a.source,
            enumerable: !0
        }),
        Object.defineProperty(c, "target", {
            value: a.target,
            enumerable: !0
        })) : (c.id = a.id,
        c.source = a.source,
        c.target = a.target),
        this.edgesArray.push(c),
        this.edgesIndex[c.id] = c,
        this.inNeighborsIndex[a.target][a.source] || (this.inNeighborsIndex[a.target][a.source] = Object.create(null)),
        this.inNeighborsIndex[a.target][a.source][a.id] = a,
        this.outNeighborsIndex[a.source][a.target] || (this.outNeighborsIndex[a.source][a.target] = Object.create(null)),
        this.outNeighborsIndex[a.source][a.target][a.id] = a,
        this.allNeighborsIndex[a.source][a.target] || (this.allNeighborsIndex[a.source][a.target] = Object.create(null)),
        this.allNeighborsIndex[a.source][a.target][a.id] = a,
        this.allNeighborsIndex[a.target][a.source] || (this.allNeighborsIndex[a.target][a.source] = Object.create(null)),
        this.allNeighborsIndex[a.target][a.source][a.id] = a,
        this.inNeighborsCount[a.target]++,
        this.outNeighborsCount[a.source]++,
        this.allNeighborsCount[a.target]++,
        this.allNeighborsCount[a.source]++,
        this
    }),
    //talvez seja importante
    i.addMethod("dropNode", function(a) {
        if ("string" != typeof a || 1 !== arguments.length)
            throw "dropNode: Wrong arguments.";
        if (!this.nodesIndex[a])
            throw 'The node "' + a + '" does not exist.';
        var b, c, d;
        for (delete this.nodesIndex[a],
        b = 0,
        d = this.nodesArray.length; d > b; b++)
            if (this.nodesArray[b].id === a) {
                this.nodesArray.splice(b, 1);
                break
            }
        for (b = this.edgesArray.length - 1; b >= 0; b--)
            (this.edgesArray[b].source === a || this.edgesArray[b].target === a) && this.dropEdge(this.edgesArray[b].id);
        delete this.inNeighborsIndex[a],
        delete this.outNeighborsIndex[a],
        delete this.allNeighborsIndex[a],
        delete this.inNeighborsCount[a],
        delete this.outNeighborsCount[a],
        delete this.allNeighborsCount[a];
        for (c in this.nodesIndex)
            delete this.inNeighborsIndex[c][a],
            delete this.outNeighborsIndex[c][a],
            delete this.allNeighborsIndex[c][a];
        return this
    }),
    i.addMethod("dropEdge", function(a) {
        if ("string" != typeof a || 1 !== arguments.length)
            throw "dropEdge: Wrong arguments.";
        if (!this.edgesIndex[a])
            throw 'The edge "' + a + '" does not exist.';
        var b, c, d;
        for (d = this.edgesIndex[a],
        delete this.edgesIndex[a],
        b = 0,
        c = this.edgesArray.length; c > b; b++)
            if (this.edgesArray[b].id === a) {
                this.edgesArray.splice(b, 1);
                break
            }
        return delete this.inNeighborsIndex[d.target][d.source][d.id],
        Object.keys(this.inNeighborsIndex[d.target][d.source]).length || delete this.inNeighborsIndex[d.target][d.source],
        delete this.outNeighborsIndex[d.source][d.target][d.id],
        Object.keys(this.outNeighborsIndex[d.source][d.target]).length || delete this.outNeighborsIndex[d.source][d.target],
        delete this.allNeighborsIndex[d.source][d.target][d.id],
        Object.keys(this.allNeighborsIndex[d.source][d.target]).length || delete this.allNeighborsIndex[d.source][d.target],
        delete this.allNeighborsIndex[d.target][d.source][d.id],
        Object.keys(this.allNeighborsIndex[d.target][d.source]).length || delete this.allNeighborsIndex[d.target][d.source],
        this.inNeighborsCount[d.target]--,
        this.outNeighborsCount[d.source]--,
        this.allNeighborsCount[d.source]--,
        this.allNeighborsCount[d.target]--,
        this
    }),
    i.addMethod("kill", function() {
        this.nodesArray.length = 0,
        this.edgesArray.length = 0,
        delete this.nodesArray,
        delete this.edgesArray,
        delete this.nodesIndex,
        delete this.edgesIndex,
        delete this.inNeighborsIndex,
        delete this.outNeighborsIndex,
        delete this.allNeighborsIndex,
        delete this.inNeighborsCount,
        delete this.outNeighborsCount,
        delete this.allNeighborsCount
    }),
    i.addMethod("clear", function() {
        return this.nodesArray.length = 0,
        this.edgesArray.length = 0,
        b(this.nodesIndex),
        b(this.edgesIndex),
        b(this.nodesIndex),
        b(this.inNeighborsIndex),
        b(this.outNeighborsIndex),
        b(this.allNeighborsIndex),
        b(this.inNeighborsCount),
        b(this.outNeighborsCount),
        b(this.allNeighborsCount),
        this
    }),
    i.addMethod("read", function(a) {
        var b, c, d;
        for (c = a.nodes || [],
        b = 0,
        d = c.length; d > b; b++)
            this.addNode(c[b]);
        for (c = a.edges || [],
        b = 0,
        d = c.length; d > b; b++)
            this.addEdge(c[b]);
        return this
    }),
    i.addMethod("nodes", function(a) {
        if (!arguments.length)
            return this.nodesArray.slice(0);
        if (1 === arguments.length && "string" == typeof a)
            return this.nodesIndex[a];
        if (1 === arguments.length && "[object Array]" === Object.prototype.toString.call(a)) {
            var b, c, d = [];
            for (b = 0,
            c = a.length; c > b; b++) {
                if ("string" != typeof a[b])
                    throw "nodes: Wrong arguments.";
                d.push(this.nodesIndex[a[b]])
            }
            return d
        }
        throw "nodes: Wrong arguments."
    }),
    i.addMethod("degree", function(a, b) {
        if (b = {
            "in": this.inNeighborsCount,
            out: this.outNeighborsCount
        }[b || ""] || this.allNeighborsCount,
        "string" == typeof a)
            return b[a];
        if ("[object Array]" === Object.prototype.toString.call(a)) {
            var c, d, e = [];
            for (c = 0,
            d = a.length; d > c; c++) {
                if ("string" != typeof a[c])
                    throw "degree: Wrong arguments.";
                e.push(b[a[c]])
            }
            return e
        }
        throw "degree: Wrong arguments."
    }),
    i.addMethod("edges", function(a) {
        if (!arguments.length)
            return this.edgesArray.slice(0);
        if (1 === arguments.length && "string" == typeof a)
            return this.edgesIndex[a];
        if (1 === arguments.length && "[object Array]" === Object.prototype.toString.call(a)) {
            var b, c, d = [];
            for (b = 0,
            c = a.length; c > b; b++) {
                if ("string" != typeof a[b])
                    throw "edges: Wrong arguments.";
                d.push(this.edgesIndex[a[b]])
            }
            return d
        }
        throw "edges: Wrong arguments."
    }),
    "undefined" != typeof sigma ? (sigma.classes = sigma.classes || Object.create(null),
    sigma.classes.graph = i) : "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = i),
    exports.graph = i) : this.graph = i
}
.call(this),
function(a) {
    "use strict";
    if ("undefined" == typeof sigma)
        throw "sigma is not declared";
    sigma.utils.pkg("sigma.classes"),
    sigma.classes.camera = function(a, b, c, d) {
        sigma.classes.dispatcher.extend(this),
        Object.defineProperty(this, "graph", {
            value: b
        }),
        Object.defineProperty(this, "id", {
            value: a
        }),
        Object.defineProperty(this, "readPrefix", {
            value: "read_cam" + a + ":"
        }),
        Object.defineProperty(this, "prefix", {
            value: "cam" + a + ":"
        }),
        this.x = 0,
        this.y = 0,
        this.ratio = 1,
        this.angle = 0,
        this.isAnimated = !1,
        this.settings = "object" == typeof d && d ? c.embedObject(d) : c
    }
    ,
    sigma.classes.camera.prototype.goTo = function(b) {
        if (!this.settings("enableCamera"))
            return this;
        var c, d, e = b || {}, f = ["x", "y", "ratio", "angle"];
        for (c = 0,
        d = f.length; d > c; c++)
            if (e[f[c]] !== a) {
                if ("number" != typeof e[f[c]] || isNaN(e[f[c]]))
                    throw 'Value for "' + f[c] + '" is not a number.';
                this[f[c]] = e[f[c]]
            }
        return this.dispatchEvent("coordinatesUpdated"),
        this
    }
    ,
    sigma.classes.camera.prototype.applyView = function(b, c, d) {
        d = d || {},
        c = c !== a ? c : this.prefix,
        b = b !== a ? b : this.readPrefix;
        var e, f, g, h = d.nodes || this.graph.nodes(), i = d.edges || this.graph.edges(), j = Math.cos(this.angle), k = Math.sin(this.angle);
        for (e = 0,
        f = h.length; f > e; e++)
            g = h[e],
            g[c + "x"] = (((g[b + "x"] || 0) - this.x) * j + ((g[b + "y"] || 0) - this.y) * k) / this.ratio + (d.width || 0) / 2,
            g[c + "y"] = (((g[b + "y"] || 0) - this.y) * j - ((g[b + "x"] || 0) - this.x) * k) / this.ratio + (d.height || 0) / 2,
            g[c + "size"] = (g[b + "size"] || 0) / Math.pow(this.ratio, this.settings("nodesPowRatio"));
        for (e = 0,
        f = i.length; f > e; e++)
            i[e][c + "size"] = (i[e][b + "size"] || 0) / Math.pow(this.ratio, this.settings("edgesPowRatio"));
        return this
    }
    ,
    sigma.classes.camera.prototype.graphPosition = function(a, b, c) {
        var d = 0
          , e = 0
          , f = Math.cos(this.angle)
          , g = Math.sin(this.angle);
        return c || (d = -(this.x * f + this.y * g) / this.ratio,
        e = -(this.y * f - this.x * g) / this.ratio),
        {
            x: (a * f + b * g) / this.ratio + d,
            y: (b * f - a * g) / this.ratio + e
        }
    }
    ,
    sigma.classes.camera.prototype.cameraPosition = function(a, b, c) {
        var d = 0
          , e = 0
          , f = Math.cos(this.angle)
          , g = Math.sin(this.angle);
        return c || (d = -(this.x * f + this.y * g) / this.ratio,
        e = -(this.y * f - this.x * g) / this.ratio),
        {
            x: ((a - d) * f - (b - e) * g) * this.ratio,
            y: ((b - e) * f + (a - d) * g) * this.ratio
        }
    }
    ,
    sigma.classes.camera.prototype.getMatrix = function() {
        var a = sigma.utils.matrices.scale(1 / this.ratio)
          , b = sigma.utils.matrices.rotation(this.angle)
          , c = sigma.utils.matrices.translation(-this.x, -this.y)
          , d = sigma.utils.matrices.multiply(c, sigma.utils.matrices.multiply(b, a));
        return d
    }
    ,
    sigma.classes.camera.prototype.getRectangle = function(a, b) {
        var c = this.cameraPosition(a, 0, !0)
          , d = this.cameraPosition(0, b, !0)
          , e = this.cameraPosition(a / 2, b / 2, !0)
          , f = this.cameraPosition(a / 4, 0, !0).x
          , g = this.cameraPosition(0, b / 4, !0).y;
        return {
            x1: this.x - e.x - f,
            y1: this.y - e.y - g,
            x2: this.x - e.x + f + c.x,
            y2: this.y - e.y - g + c.y,
            height: Math.sqrt(Math.pow(d.x, 2) + Math.pow(d.y + 2 * g, 2))
        }
    }
}
.call(this),
function(a) {
    "use strict";
    function b(a, b) {
        var c = b.x + b.width / 2
          , d = b.y + b.height / 2
          , e = a.y < d
          , f = a.x < c;
        return e ? f ? 0 : 1 : f ? 2 : 3
    }
    function c(a, b) {
        for (var c = [], d = 0; 4 > d; d++)
            a.x2 >= b[d][0].x && a.x1 <= b[d][1].x && a.y1 + a.height >= b[d][0].y && a.y1 <= b[d][2].y && c.push(d);
        return c
    }
    function d(a, b) {
        for (var c = [], d = 0; 4 > d; d++)
            j.collision(a, b[d]) && c.push(d);
        return c
    }
    function e(a, b) {
        var c, d, e = b.level + 1, f = Math.round(b.bounds.width / 2), g = Math.round(b.bounds.height / 2), h = Math.round(b.bounds.x), j = Math.round(b.bounds.y);
        switch (a) {
        case 0:
            c = h,
            d = j;
            break;
        case 1:
            c = h + f,
            d = j;
            break;
        case 2:
            c = h,
            d = j + g;
            break;
        case 3:
            c = h + f,
            d = j + g
        }
        return i({
            x: c,
            y: d,
            width: f,
            height: g
        }, e, b.maxElements, b.maxLevel)
    }
    function f(b, d, g) {
        if (g.level < g.maxLevel)
            for (var h = c(d, g.corners), i = 0, j = h.length; j > i; i++)
                g.nodes[h[i]] === a && (g.nodes[h[i]] = e(h[i], g)),
                f(b, d, g.nodes[h[i]]);
        else
            g.elements.push(b)
    }
    function g(c, d) {
        if (d.level < d.maxLevel) {
            var e = b(c, d.bounds);
            return d.nodes[e] !== a ? g(c, d.nodes[e]) : []
        }
        return d.elements
    }
    function h(b, c, d, e) {
        if (e = e || {},
        c.level < c.maxLevel)
            for (var f = d(b, c.corners), g = 0, i = f.length; i > g; g++)
                c.nodes[f[g]] !== a && h(b, c.nodes[f[g]], d, e);
        else
            for (var j = 0, k = c.elements.length; k > j; j++)
                e[c.elements[j].id] === a && (e[c.elements[j].id] = c.elements[j]);
        return e
    }
    function i(a, b, c, d) {
        return {
            level: b || 0,
            bounds: a,
            corners: j.splitSquare(a),
            maxElements: c || 20,
            maxLevel: d || 4,
            elements: [],
            nodes: []
        }
    }
    var j = {
        pointToSquare: function(a) {
            return {
                x1: a.x - a.size,
                y1: a.y - a.size,
                x2: a.x + a.size,
                y2: a.y - a.size,
                height: 2 * a.size
            }
        },
        isAxisAligned: function(a) {
            return a.x1 === a.x2 || a.y1 === a.y2
        },
        axisAlignedTopPoints: function(a) {
            return a.y1 === a.y2 && a.x1 < a.x2 ? a : a.x1 === a.x2 && a.y2 > a.y1 ? {
                x1: a.x1 - a.height,
                y1: a.y1,
                x2: a.x1,
                y2: a.y1,
                height: a.height
            } : a.x1 === a.x2 && a.y2 < a.y1 ? {
                x1: a.x1,
                y1: a.y2,
                x2: a.x2 + a.height,
                y2: a.y2,
                height: a.height
            } : {
                x1: a.x2,
                y1: a.y1 - a.height,
                x2: a.x1,
                y2: a.y1 - a.height,
                height: a.height
            }
        },
        lowerLeftCoor: function(a) {
            var b = Math.sqrt(Math.pow(a.x2 - a.x1, 2) + Math.pow(a.y2 - a.y1, 2));
            return {
                x: a.x1 - (a.y2 - a.y1) * a.height / b,
                y: a.y1 + (a.x2 - a.x1) * a.height / b
            }
        },
        lowerRightCoor: function(a, b) {
            return {
                x: b.x - a.x1 + a.x2,
                y: b.y - a.y1 + a.y2
            }
        },
        rectangleCorners: function(a) {
            var b = this.lowerLeftCoor(a)
              , c = this.lowerRightCoor(a, b);
            return [{
                x: a.x1,
                y: a.y1
            }, {
                x: a.x2,
                y: a.y2
            }, {
                x: b.x,
                y: b.y
            }, {
                x: c.x,
                y: c.y
            }]
        },
        splitSquare: function(a) {
            return [[{
                x: a.x,
                y: a.y
            }, {
                x: a.x + a.width / 2,
                y: a.y
            }, {
                x: a.x,
                y: a.y + a.height / 2
            }, {
                x: a.x + a.width / 2,
                y: a.y + a.height / 2
            }], [{
                x: a.x + a.width / 2,
                y: a.y
            }, {
                x: a.x + a.width,
                y: a.y
            }, {
                x: a.x + a.width / 2,
                y: a.y + a.height / 2
            }, {
                x: a.x + a.width,
                y: a.y + a.height / 2
            }], [{
                x: a.x,
                y: a.y + a.height / 2
            }, {
                x: a.x + a.width / 2,
                y: a.y + a.height / 2
            }, {
                x: a.x,
                y: a.y + a.height
            }, {
                x: a.x + a.width / 2,
                y: a.y + a.height
            }], [{
                x: a.x + a.width / 2,
                y: a.y + a.height / 2
            }, {
                x: a.x + a.width,
                y: a.y + a.height / 2
            }, {
                x: a.x + a.width / 2,
                y: a.y + a.height
            }, {
                x: a.x + a.width,
                y: a.y + a.height
            }]]
        },
        axis: function(a, b) {
            return [{
                x: a[1].x - a[0].x,
                y: a[1].y - a[0].y
            }, {
                x: a[1].x - a[3].x,
                y: a[1].y - a[3].y
            }, {
                x: b[0].x - b[2].x,
                y: b[0].y - b[2].y
            }, {
                x: b[0].x - b[1].x,
                y: b[0].y - b[1].y
            }]
        },
        projection: function(a, b) {
            var c = (a.x * b.x + a.y * b.y) / (Math.pow(b.x, 2) + Math.pow(b.y, 2));
            return {
                x: c * b.x,
                y: c * b.y
            }
        },
        axisCollision: function(a, b, c) {
            for (var d = [], e = [], f = 0; 4 > f; f++) {
                var g = this.projection(b[f], a)
                  , h = this.projection(c[f], a);
                d.push(g.x * a.x + g.y * a.y),
                e.push(h.x * a.x + h.y * a.y)
            }
            var i = Math.max.apply(Math, d)
              , j = Math.max.apply(Math, e)
              , k = Math.min.apply(Math, d)
              , l = Math.min.apply(Math, e);
            return i >= l && j >= k
        },
        collision: function(a, b) {
            for (var c = this.axis(a, b), d = !0, e = 0; 4 > e; e++)
                d *= this.axisCollision(c[e], a, b);
            return !!d
        }
    }
      , k = function() {
        this._geom = j,
        this._tree = null,
        this._cache = {
            query: !1,
            result: !1
        }
    };
    k.prototype.index = function(a, b) {
        if (!b.bounds)
            throw "sigma.classes.quad.index: bounds information not given.";
        var c = b.prefix || "";
        this._tree = i(b.bounds, 0, b.maxElements, b.maxLevel);
        for (var d = 0, e = a.length; e > d; d++)
            f(a[d], j.pointToSquare({
                x: a[d][c + "x"],
                y: a[d][c + "y"],
                size: a[d][c + "size"]
            }), this._tree);
        return this._cache = {
            query: !1,
            result: !1
        },
        this._tree
    }
    ,
    k.prototype.point = function(a, b) {
        return this._tree ? g({
            x: a,
            y: b
        }, this._tree) || [] : []
    }
    ,
    k.prototype.area = function(a) {
        var b, e, f = JSON.stringify(a);
        if (this._cache.query === f)
            return this._cache.result;
        j.isAxisAligned(a) ? (b = c,
        e = j.axisAlignedTopPoints(a)) : (b = d,
        e = j.rectangleCorners(a));
        var g = this._tree ? h(e, this._tree, b) : []
          , i = [];
        for (var k in g)
            i.push(g[k]);
        return this._cache.query = f,
        this._cache.result = i,
        i
    }
    ,
    "undefined" != typeof this.sigma ? (this.sigma.classes = this.sigma.classes || {},
    this.sigma.classes.quad = k) : "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = k),
    exports.quad = k) : this.quad = k
}
.call(this),
function() {
    "use strict";
    if ("undefined" == typeof sigma)
        throw "sigma is not declared";
    sigma.utils.pkg("sigma.captors"),
    sigma.captors.mouse = function(a, b, c) {
        function d(a) {
            var b, c, d;
            return w("mouseEnabled") && t.dispatchEvent("mousemove", {
                x: sigma.utils.getX(a) - a.target.width / 2,
                y: sigma.utils.getY(a) - a.target.height / 2
            }),
            w("mouseEnabled") && q ? (r = !0,
            s && clearTimeout(s),
            s = setTimeout(function() {
                r = !1
            }, w("dragTimeout")),
            sigma.misc.animation.killAll(v),
            v.isMoving = !0,
            d = v.cameraPosition(sigma.utils.getX(a) - o, sigma.utils.getY(a) - p, !0),
            b = k - d.x,
            c = l - d.y,
            (b !== v.x || c !== v.y) && (m = v.x,
            n = v.y,
            v.goTo({
                x: b,
                y: c
            })),
            a.preventDefault ? a.preventDefault() : a.returnValue = !1,
            a.stopPropagation(),
            !1) : void 0
        }
        function e(a) {
            if (w("mouseEnabled") && q) {
                q = !1,
                s && clearTimeout(s),
                v.isMoving = !1;
                var b = sigma.utils.getX(a)
                  , c = sigma.utils.getY(a);
                r ? (sigma.misc.animation.killAll(v),
                sigma.misc.animation.camera(v, {
                    x: v.x + w("mouseInertiaRatio") * (v.x - m),
                    y: v.y + w("mouseInertiaRatio") * (v.y - n)
                }, {
                    easing: "quadraticOut",
                    duration: w("mouseInertiaDuration")
                })) : (o !== b || p !== c) && v.goTo({
                    x: v.x,
                    y: v.y
                }),
                t.dispatchEvent("mouseup", {
                    x: b - a.target.width / 2,
                    y: c - a.target.height / 2
                }),
                r = !1
            }
        }
        function f(a) {
            w("mouseEnabled") && (q = !0,
            k = v.x,
            l = v.y,
            m = v.x,
            n = v.y,
            o = sigma.utils.getX(a),
            p = sigma.utils.getY(a),
            t.dispatchEvent("mouseup", {
                x: o - a.target.width / 2,
                y: p - a.target.height / 2
            }))
        }
        function g() {
            w("mouseEnabled") && t.dispatchEvent("mouseout")
        }
        function h(a) {
            return w("mouseEnabled") && t.dispatchEvent("click", {
                x: sigma.utils.getX(a) - a.target.width / 2,
                y: sigma.utils.getY(a) - a.target.height / 2
            }),
            a.preventDefault ? a.preventDefault() : a.returnValue = !1,
            a.stopPropagation(),
            !1
        }
        function i(a) {
            var b, c, d, e;
            return w("mouseEnabled") ? (d = 1 / w("doubleClickZoomingRatio"),
            e = Math.max(w("zoomMin"), Math.min(w("zoomMax"), v.ratio * d)),
            d = e / v.ratio,
            t.dispatchEvent("doubleclick", {
                x: o - a.target.width / 2,
                y: p - a.target.height / 2
            }),
            w("doubleClickEnabled") && e !== v.ratio && (c = sigma.misc.animation.killAll(v),
            b = v.cameraPosition(sigma.utils.getX(a) - a.target.width / 2, sigma.utils.getY(a) - a.target.height / 2, !0),
            sigma.misc.animation.camera(v, {
                x: b.x * (1 - d) + v.x,
                y: b.y * (1 - d) + v.y,
                ratio: e
            }, {
                easing: c ? "quadraticOut" : "quadraticInOut",
                duration: w("doubleClickZoomDuration")
            })),
            a.preventDefault ? a.preventDefault() : a.returnValue = !1,
            a.stopPropagation(),
            !1) : void 0
        }
        function j(a) {
            var b, c, d, e;
            return w("mouseEnabled") ? (d = sigma.utils.getDelta(a) > 0 ? 1 / w("zoomingRatio") : w("zoomingRatio"),
            e = Math.max(w("zoomMin"), Math.min(w("zoomMax"), v.ratio * d)),
            d = e / v.ratio,
            e !== v.ratio && (c = sigma.misc.animation.killAll(v),
            b = v.cameraPosition(sigma.utils.getX(a) - a.target.width / 2, sigma.utils.getY(a) - a.target.height / 2, !0),
            sigma.misc.animation.camera(v, {
                x: b.x * (1 - d) + v.x,
                y: b.y * (1 - d) + v.y,
                ratio: e
            }, {
                easing: c ? "quadraticOut" : "quadraticInOut",
                duration: w("mouseZoomDuration")
            })),
            a.preventDefault ? a.preventDefault() : a.returnValue = !1,
            a.stopPropagation(),
            !1) : void 0
        }
        //MOUSE EVENTS
        var k, l, m, n, o, p, q, r, s, t = this, u = a, v = b, w = c;
        sigma.classes.dispatcher.extend(this),
        sigma.utils.doubleClick(u, "click", i),
        u.addEventListener("DOMMouseScroll", j, !1),
        u.addEventListener("mousewheel", j, !1),
        u.addEventListener("mousemove", d, !1),
        u.addEventListener("mousedown", f, !1),
        u.addEventListener("click", h, !1),
        u.addEventListener("mouseout", g, !1),
        document.addEventListener("mouseup", e, !1)
    }
}
.call(this),
function() {
    "use strict";
    if ("undefined" == typeof sigma)
        throw "sigma is not declared";
    sigma.utils.pkg("sigma.captors"),
    sigma.captors.touch = function(a, b, c) {
        function d(a) {
            var b = sigma.utils.getOffset(B);
            return {
                x: a.pageX - b.left,
                y: a.pageY - b.top
            }
        }
        function e(a) {
            if (D("touchEnabled")) {
                var b, c, e, f, g, h;
                switch (E = a.touches,
                E.length) {
                case 1:
                    C.isMoving = !0,
                    w = 1,
                    i = C.x,
                    j = C.y,
                    m = C.x,
                    n = C.y,
                    g = d(E[0]),
                    q = g.x,
                    r = g.y;
                    break;
                case 2:
                    return C.isMoving = !0,
                    w = 2,
                    g = d(E[0]),
                    h = d(E[1]),
                    b = g.x,
                    e = g.y,
                    c = h.x,
                    f = h.y,
                    m = C.x,
                    n = C.y,
                    k = C.angle,
                    l = C.ratio,
                    i = C.x,
                    j = C.y,
                    q = b,
                    r = e,
                    s = c,
                    t = f,
                    u = Math.atan2(t - r, s - q),
                    v = Math.sqrt(Math.pow(t - r, 2) + Math.pow(s - q, 2)),
                    a.preventDefault(),
                    !1
                }
            }
        }
        function f(a) {
            if (D("touchEnabled")) {
                E = a.touches;
                var b = D("touchInertiaRatio");
                switch (z && (x = !1,
                clearTimeout(z)),
                w) {
                case 2:
                    if (1 === a.touches.length) {
                        e(a),
                        a.preventDefault();
                        break
                    }
                case 1:
                    C.isMoving = !1,
                    A.dispatchEvent("stopDrag"),
                    x && (y = !1,
                    sigma.misc.animation.camera(C, {
                        x: C.x + b * (C.x - m),
                        y: C.y + b * (C.y - n)
                    }, {
                        easing: "quadraticOut",
                        duration: D("touchInertiaDuration")
                    })),
                    x = !1,
                    w = 0
                }
            }
        }
        function g(a) {
            if (!y && D("touchEnabled")) {
                var b, c, e, f, g, h, B, F, G, H, I, J, K, L, M, N, O;
                switch (E = a.touches,
                x = !0,
                z && clearTimeout(z),
                z = setTimeout(function() {
                    x = !1
                }, D("dragTimeout")),
                w) {
                case 1:
                    F = d(E[0]),
                    b = F.x,
                    e = F.y,
                    H = C.cameraPosition(b - q, e - r, !0),
                    L = i - H.x,
                    M = j - H.y,
                    (L !== C.x || M !== C.y) && (m = C.x,
                    n = C.y,
                    C.goTo({
                        x: L,
                        y: M
                    }),
                    A.dispatchEvent("mousemove", {
                        x: F.x - a.target.width / 2,
                        y: F.y - a.target.height / 2
                    }),
                    A.dispatchEvent("drag"));
                    break;
                case 2:
                    F = d(E[0]),
                    G = d(E[1]),
                    b = F.x,
                    e = F.y,
                    c = G.x,
                    f = G.y,
                    I = C.cameraPosition((q + s) / 2 - a.target.width / 2, (r + t) / 2 - a.target.height / 2, !0),
                    B = C.cameraPosition((b + c) / 2 - a.target.width / 2, (e + f) / 2 - a.target.height / 2, !0),
                    J = Math.atan2(f - e, c - b) - u,
                    K = Math.sqrt(Math.pow(f - e, 2) + Math.pow(c - b, 2)) / v,
                    b = I.x,
                    e = I.y,
                    N = l / K,
                    b *= K,
                    e *= K,
                    O = k - J,
                    g = Math.cos(-J),
                    h = Math.sin(-J),
                    c = b * g + e * h,
                    f = e * g - b * h,
                    b = c,
                    e = f,
                    L = b - B.x + i,
                    M = e - B.y + j,
                    (N !== C.ratio || O !== C.angle || L !== C.x || M !== C.y) && (m = C.x,
                    n = C.y,
                    o = C.angle,
                    p = C.ratio,
                    C.goTo({
                        x: L,
                        y: M,
                        angle: O,
                        ratio: N
                    }),
                    A.dispatchEvent("drag"))
                }
                return a.preventDefault(),
                !1
            }
        }
        function h(a) {
            var b, c, e, f;
            return a.touches && 1 === a.touches.length && D("touchEnabled") ? (y = !0,
            e = 1 / D("doubleClickZoomingRatio"),
            f = Math.max(D("zoomMin"), Math.min(D("zoomMax"), C.ratio * e)),
            e = f / C.ratio,
            b = d(a.touches[0]),
            A.dispatchEvent("doubleclick", {
                x: b.x - a.target.width / 2,
                y: b.y - a.target.height / 2
            }),
            D("doubleClickEnabled") && f !== C.ratio && (c = sigma.misc.animation.killAll(C),
            b = C.cameraPosition(b.x - a.target.width / 2, b.y - a.target.height / 2, !0),
            sigma.misc.animation.camera(C, {
                x: b.x * (1 - e) + C.x,
                y: b.y * (1 - e) + C.y,
                ratio: f
            }, {
                easing: c ? "quadraticOut" : "quadraticInOut",
                duration: D("doubleClickZoomDuration"),
                onComplete: function() {
                    y = !1
                }
            })),
            a.preventDefault ? a.preventDefault() : a.returnValue = !1,
            a.stopPropagation(),
            !1) : void 0
        }
        var i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A = this, B = a, C = b, D = c, E = [];
        sigma.classes.dispatcher.extend(this),
        sigma.utils.doubleClick(B, "touchstart", h),
        B.addEventListener("touchstart", e),
        B.addEventListener("touchend", f),
        B.addEventListener("touchcancel", f),
        B.addEventListener("touchleave", f),
        B.addEventListener("touchmove", g)
    }
}
.call(this),
function(a) {
    "use strict";
    if ("undefined" == typeof sigma)
        throw "sigma is not declared";
    if ("undefined" == typeof conrad)
        throw "conrad is not declared";
    sigma.utils.pkg("sigma.renderers"),
    sigma.renderers.canvas = function(a, b, c, d) {
        if ("object" != typeof d)
            throw "sigma.renderers.canvas: Wrong arguments.";
        if (!(d.container instanceof HTMLElement))
            throw "Container not found.";
        var e, f, g, h, i = this;
        for (sigma.classes.dispatcher.extend(this),
        Object.defineProperty(this, "conradId", {
            value: sigma.utils.id()
        }),
        this.graph = a,
        this.camera = b,
        this.contexts = {},
        this.domElements = {},
        this.options = d,
        this.container = this.options.container,
        this.settings = "object" == typeof d.settings && d.settings ? c.embedObjects(d.settings) : c,
        this.nodesOnScreen = [],
        this.edgesOnScreen = [],
        this.jobs = {},
        this.options.prefix = "renderer" + this.conradId + ":",
        this.settings("batchEdgesDrawing") ? (this.initDOM("canvas", "edges"),
        this.initDOM("canvas", "scene"),
        this.contexts.nodes = this.contexts.scene,
        this.contexts.labels = this.contexts.scene) : (this.initDOM("canvas", "scene"),
        this.contexts.edges = this.contexts.scene,
        this.contexts.nodes = this.contexts.scene,
        this.contexts.labels = this.contexts.scene),
        this.initDOM("canvas", "mouse"),
        this.contexts.hover = this.contexts.mouse,
        this.captors = [],
        g = this.options.captors || [sigma.captors.mouse, sigma.captors.touch],
        e = 0,
        f = g.length; f > e; e++)
            h = "function" == typeof g[e] ? g[e] : sigma.captors[g[e]],
            this.captors.push(new h(this.domElements.mouse,this.camera,this.settings));
        window.addEventListener("resize", function() {
            i.resize()
        }),
        sigma.misc.bindEvents.call(this, this.options.prefix),
        sigma.misc.drawHovers.call(this, this.options.prefix),
        this.resize(!1)
    }
    ,
    sigma.renderers.canvas.prototype.render = function(b) {
        b = b || {};
        var c, d, e, f, g, h, i, j, k, l, m, n, o = {}, p = this.graph, q = this.graph.nodes, r = (this.options.prefix || "",
        this.settings(b, "drawEdges")), s = this.settings(b, "drawNodes"), t = this.settings(b, "drawLabels"), u = this.settings.embedObjects(b, {
            prefix: this.options.prefix
        });
        this.settings(b, "hideEdgesOnMove") && (this.camera.isAnimated || this.camera.isMoving) && (r = !1),
        this.camera.applyView(a, this.options.prefix, {
            width: this.width,
            height: this.height
        }),
        this.clear();
        for (e in this.jobs)
            conrad.hasJob(e) && conrad.killJob(e);
        for (this.edgesOnScreen = [],
        this.nodesOnScreen = this.camera.quadtree.area(this.camera.getRectangle(this.width, this.height)),
        c = this.nodesOnScreen,
        d = 0,
        f = c.length; f > d; d++)
            o[c[d].id] = c[d];
        if (r) {
            for (c = p.edges(),
            d = 0,
            f = c.length; f > d; d++)
                g = c[d],
                !o[g.source] && !o[g.target] || g.hidden || q(g.source).hidden || q(g.target).hidden || this.edgesOnScreen.push(g);
            if (this.settings(b, "batchEdgesDrawing"))
                h = "edges_" + this.conradId,
                n = u("canvasEdgesBatchSize"),
                l = this.edgesOnScreen,
                f = l.length,
                k = 0,
                i = Math.min(l.length, k + n),
                j = function() {
                    for (m = sigma.canvas.edges,
                    d = k; i > d; d++)
                        g = l[d],
                        (m[g.type] || m.def)(g, p.nodes(g.source), p.nodes(g.target), this.contexts.edges, u);
                    return i === l.length ? (delete this.jobs[h],
                    !1) : (k = i + 1,
                    i = Math.min(l.length, k + n),
                    !0)
                }
                ,
                this.jobs[h] = j,
                conrad.addJob(h, j.bind(this));
            else
                for (m = sigma.canvas.edges,
                c = this.edgesOnScreen,
                d = 0,
                f = c.length; f > d; d++)
                    g = c[d],
                    (m[g.type] || m.def)(g, p.nodes(g.source), p.nodes(g.target), this.contexts.edges, u)
        }
        if (s)
            for (m = sigma.canvas.nodes,
            c = this.nodesOnScreen,
            d = 0,
            f = c.length; f > d; d++)
                c[d].hidden || (m[c[d].type] || m.def)(c[d], this.contexts.nodes, u);
        if (t)
            for (m = sigma.canvas.labels,
            c = this.nodesOnScreen,
            d = 0,
            f = c.length; f > d; d++)
                c[d].hidden || (m[c[d].type] || m.def)(c[d], this.contexts.labels, u);
        return this.dispatchEvent("render"),
        this
    }
    ,
    sigma.renderers.canvas.prototype.initDOM = function(a, b) {
        var c = document.createElement(a);
        c.style.position = "absolute",
        c.setAttribute("class", "sigma-" + b),
        this.domElements[b] = c,
        this.container.appendChild(c),
        "canvas" === a.toLowerCase() && (this.contexts[b] = c.getContext("2d"))
    }
    ,
    sigma.renderers.canvas.prototype.resize = function(b, c) {
        var d, e = this.width, f = this.height, g = 1;
        if (b !== a && c !== a ? (this.width = b,
        this.height = c) : (this.width = this.container.offsetWidth,
        this.height = this.container.offsetHeight,
        b = this.width,
        c = this.height),
        e !== this.width || f !== this.height)
            for (d in this.domElements)
                this.domElements[d].style.width = b + "px",
                this.domElements[d].style.height = c + "px",
                "canvas" === this.domElements[d].tagName.toLowerCase() && (this.domElements[d].setAttribute("width", b * g + "px"),
                this.domElements[d].setAttribute("height", c * g + "px"),
                1 !== g && this.contexts[d].scale(g, g));
        return this
    }
    ,
    sigma.renderers.canvas.prototype.clear = function() {
        var a;
        for (a in this.domElements)
            "CANVAS" === this.domElements[a].tagName && (this.domElements[a].width = this.domElements[a].width);
        return this
    }
    ,
    sigma.utils.pkg("sigma.canvas.nodes"),
    sigma.utils.pkg("sigma.canvas.edges"),
    sigma.utils.pkg("sigma.canvas.labels")
}
.call(this),
function(a) {
    "use strict";
    if ("undefined" == typeof sigma)
        throw "sigma is not declared";
    sigma.utils.pkg("sigma.renderers"),
    sigma.renderers.webgl = function(a, b, c, d) {
        if ("object" != typeof d)
            throw "sigma.renderers.webgl: Wrong arguments.";
        if (!(d.container instanceof HTMLElement))
            throw "Container not found.";
        var e, f, g, h, i = this;
        for (sigma.classes.dispatcher.extend(this),
        this.jobs = {},
        Object.defineProperty(this, "conradId", {
            value: sigma.utils.id()
        }),
        this.graph = a,
        this.camera = b,
        this.contexts = {},
        this.domElements = {},
        this.options = d,
        this.container = this.options.container,
        this.settings = "object" == typeof d.settings && d.settings ? c.embedObjects(d.settings) : c,
        this.options.prefix = this.camera.readPrefix,
        Object.defineProperty(this, "nodePrograms", {
            value: {}
        }),
        Object.defineProperty(this, "edgePrograms", {
            value: {}
        }),
        Object.defineProperty(this, "nodeFloatArrays", {
            value: {}
        }),
        Object.defineProperty(this, "edgeFloatArrays", {
            value: {}
        }),
        this.initDOM("canvas", "scene", !0),
        this.initDOM("canvas", "labels"),
        this.initDOM("canvas", "mouse"),
        this.contexts.hover = this.contexts.mouse,
        this.contexts.nodes = this.contexts.scene,
        this.contexts.edges = this.contexts.scene,
        this.captors = [],
        g = this.options.captors || [sigma.captors.mouse, sigma.captors.touch],
        e = 0,
        f = g.length; f > e; e++)
            h = "function" == typeof g[e] ? g[e] : sigma.captors[g[e]],
            this.captors.push(new h(this.domElements.mouse,this.camera,this.settings));
        window.addEventListener("resize", function() {
            i.resize()
        }),
        sigma.misc.bindEvents.call(this, this.camera.prefix),
        sigma.misc.drawHovers.call(this, this.camera.prefix),
        this.resize()
    }
    ,
    sigma.renderers.webgl.prototype.process = function() {
        var a, b, c, d, e, f = this.graph, g = sigma.utils.extend(g, this.options);
        for (d in this.nodeFloatArrays)
            delete this.nodeFloatArrays[d];
        for (d in this.edgeFloatArrays)
            delete this.edgeFloatArrays[d];
        for (a = f.edges(),
        b = 0,
        c = a.length; c > b; b++)
            d = a[b].type && sigma.webgl.edges[a[b].type] ? a[b].type : "def",
            this.edgeFloatArrays[d] || (this.edgeFloatArrays[d] = {
                edges: []
            }),
            this.edgeFloatArrays[d].edges.push(a[b]);
        for (a = f.nodes(),
        b = 0,
        c = a.length; c > b; b++)
            d = a[b].type && sigma.webgl.nodes[a[b].type] ? d : "def",
            this.nodeFloatArrays[d] || (this.nodeFloatArrays[d] = {
                nodes: []
            }),
            this.nodeFloatArrays[d].nodes.push(a[b]);
        for (d in this.edgeFloatArrays)
            for (e = sigma.webgl.edges[d],
            a = this.edgeFloatArrays[d].edges,
            b = 0,
            c = a.length; c > b; b++)
                this.edgeFloatArrays[d].array || (this.edgeFloatArrays[d].array = new Float32Array(a.length * e.POINTS * e.ATTRIBUTES)),
                a[b].hidden || f.nodes(a[b].source).hidden || f.nodes(a[b].target).hidden || e.addEdge(a[b], f.nodes(a[b].source), f.nodes(a[b].target), this.edgeFloatArrays[d].array, b * e.POINTS * e.ATTRIBUTES, g.prefix, this.settings);
        for (d in this.nodeFloatArrays)
            for (e = sigma.webgl.nodes[d],
            a = this.nodeFloatArrays[d].nodes,
            b = 0,
            c = a.length; c > b; b++)
                this.nodeFloatArrays[d].array || (this.nodeFloatArrays[d].array = new Float32Array(a.length * e.POINTS * e.ATTRIBUTES)),
                a[b].hidden || e.addNode(a[b], this.nodeFloatArrays[d].array, b * e.POINTS * e.ATTRIBUTES, g.prefix, this.settings);
        return this
    }
    ,
    sigma.renderers.webgl.prototype.render = function(b) {
        var c, d, e, f, g, h, i = this, j = (this.graph,
        this.contexts.nodes), k = this.contexts.edges, l = this.camera.getMatrix(), m = sigma.utils.extend(b, this.options), n = this.settings(m, "drawLabels"), o = this.settings(m, "drawEdges"), p = this.settings(m, "drawNodes");
        this.settings(m, "hideEdgesOnMove") && (this.camera.isAnimated || this.camera.isMoving) && (o = !1),
        this.clear(),
        l = sigma.utils.matrices.multiply(l, sigma.utils.matrices.translation(this.width / 2, this.height / 2));
        for (f in this.jobs)
            conrad.hasJob(f) && conrad.killJob(f);
        if (o)
            if (this.settings(m, "batchEdgesDrawing"))
                (function() {
                    var a, b, c, d, e, f, g, h, i;
                    c = "edges_" + this.conradId,
                    i = this.settings(m, "webglEdgesBatchSize"),
                    a = Object.keys(this.edgeFloatArrays),
                    a.length && (b = 0,
                    h = sigma.webgl.edges[a[b]],
                    e = this.edgeFloatArrays[a[b]].array,
                    g = 0,
                    f = Math.min(g + i * h.POINTS, e.length / h.ATTRIBUTES),
                    d = function() {
                        return this.edgePrograms[a[b]] || (this.edgePrograms[a[b]] = h.initProgram(k)),
                        f > g && (k.useProgram(this.edgePrograms[a[b]]),
                        h.render(k, this.edgePrograms[a[b]], e, {
                            settings: this.settings,
                            matrix: l,
                            width: this.width,
                            height: this.height,
                            ratio: this.camera.ratio,
                            scalingRatio: this.settings("webglOversamplingRatio"),
                            start: g,
                            count: f - g
                        })),
                        f >= e.length / h.ATTRIBUTES && b === a.length - 1 ? (delete this.jobs[c],
                        !1) : (f >= e.length / h.ATTRIBUTES ? (b++,
                        e = this.edgeFloatArrays[a[b]].array,
                        h = sigma.webgl.edges[a[b]],
                        g = 0,
                        f = Math.min(g + i * h.POINTS, e.length / h.ATTRIBUTES)) : (g = f,
                        f = Math.min(g + i * h.POINTS, e.length / h.ATTRIBUTES)),
                        !0)
                    }
                    ,
                    this.jobs[c] = d,
                    conrad.addJob(c, d.bind(this)))
                }
                ).call(this);
            else
                for (f in this.edgeFloatArrays)
                    h = sigma.webgl.edges[f],
                    this.edgePrograms[f] || (this.edgePrograms[f] = h.initProgram(k)),
                    this.edgeFloatArrays[f] && (k.useProgram(this.edgePrograms[f]),
                    h.render(k, this.edgePrograms[f], this.edgeFloatArrays[f].array, {
                        settings: this.settings,
                        matrix: l,
                        width: this.width,
                        height: this.height,
                        ratio: this.camera.ratio,
                        scalingRatio: this.settings("webglOversamplingRatio")
                    }));
        if (p) {
            j.blendFunc(j.SRC_ALPHA, j.ONE_MINUS_SRC_ALPHA),
            j.enable(j.BLEND);
            for (f in this.nodeFloatArrays)
                h = sigma.webgl.nodes[f],
                this.nodePrograms[f] || (this.nodePrograms[f] = h.initProgram(j)),
                this.nodeFloatArrays[f] && (j.useProgram(this.nodePrograms[f]),
                h.render(j, this.nodePrograms[f], this.nodeFloatArrays[f].array, {
                    settings: this.settings,
                    matrix: l,
                    width: this.width,
                    height: this.height,
                    ratio: this.camera.ratio,
                    scalingRatio: this.settings("webglOversamplingRatio")
                }))
        }
        if (n)
            for (c = this.camera.quadtree.area(this.camera.getRectangle(this.width, this.height)),
            this.camera.applyView(a, a, {
                nodes: c,
                edges: [],
                width: this.width,
                height: this.height
            }),
            g = function(a) {
                return i.settings({
                    prefix: i.camera.prefix
                }, a)
            }
            ,
            d = 0,
            e = c.length; e > d; d++)
                c[d].hidden || (sigma.canvas.labels[c[d].type] || sigma.canvas.labels.def)(c[d], this.contexts.labels, g);
        return this.dispatchEvent("render"),
        this
    }
    ,
    sigma.renderers.webgl.prototype.initDOM = function(a, b, c) {
        var d = document.createElement(a);
        d.style.position = "absolute",
        d.setAttribute("class", "sigma-" + b),
        this.domElements[b] = d,
        this.container.appendChild(d),
        "canvas" === a.toLowerCase() && (this.contexts[b] = d.getContext(c ? "experimental-webgl" : "2d", {
            preserveDrawingBuffer: !0
        }))
    }
    ,
    sigma.renderers.webgl.prototype.resize = function(b, c) {
        var d, e = this.width, f = this.height;
        if (b !== a && c !== a ? (this.width = b,
        this.height = c) : (this.width = this.container.offsetWidth,
        this.height = this.container.offsetHeight,
        b = this.width,
        c = this.height),
        e !== this.width || f !== this.height)
            for (d in this.domElements)
                this.domElements[d].style.width = b + "px",
                this.domElements[d].style.height = c + "px",
                "canvas" === this.domElements[d].tagName.toLowerCase() && (this.contexts[d] && this.contexts[d].scale ? (this.domElements[d].setAttribute("width", b + "px"),
                this.domElements[d].setAttribute("height", c + "px")) : (this.domElements[d].setAttribute("width", b * this.settings("webglOversamplingRatio") + "px"),
                this.domElements[d].setAttribute("height", c * this.settings("webglOversamplingRatio") + "px")));
        for (d in this.contexts)
            this.contexts[d] && this.contexts[d].viewport && this.contexts[d].viewport(0, 0, this.width * this.settings("webglOversamplingRatio"), this.height * this.settings("webglOversamplingRatio"));
        return this
    }
    ,
    sigma.renderers.webgl.prototype.clear = function() {
        var a;
        for (a in this.domElements)
            "CANVAS" === this.domElements[a].tagName && (this.domElements[a].width = this.domElements[a].width);
        return this.contexts.nodes.clear(this.contexts.nodes.COLOR_BUFFER_BIT),
        this.contexts.edges.clear(this.contexts.edges.COLOR_BUFFER_BIT),
        this
    }
    ,
    sigma.utils.pkg("sigma.webgl.nodes"),
    sigma.utils.pkg("sigma.webgl.edges"),
    sigma.utils.pkg("sigma.canvas.labels")
}
.call(this),
function() {
    "use strict";
    if ("undefined" == typeof sigma)
        throw "sigma is not declared";
    sigma.utils.pkg("sigma.renderers");
    var a, b = !!window.WebGLRenderingContext;
    b && (a = document.createElement("canvas"),
    b = !(!a.getContext("webgl") && !a.getContext("experimental-webgl"))),
    sigma.renderers.def = b ? sigma.renderers.webgl : sigma.renderers.canvas
}
.call(this),
function() {
    "use strict";
    sigma.utils.pkg("sigma.webgl.nodes"),
    sigma.webgl.nodes.def = {
        POINTS: 3,
        ATTRIBUTES: 5,
        addNode: function(a, b, c, d, e) {
            var f = sigma.utils.floatColor(a.color || e("defaultNodeColor"));
            b[c++] = a[d + "x"],
            b[c++] = a[d + "y"],
            b[c++] = a[d + "size"],
            b[c++] = f,
            b[c++] = 0,
            b[c++] = a[d + "x"],
            b[c++] = a[d + "y"],
            b[c++] = a[d + "size"],
            b[c++] = f,
            b[c++] = 2 * Math.PI / 3,
            b[c++] = a[d + "x"],
            b[c++] = a[d + "y"],
            b[c++] = a[d + "size"],
            b[c++] = f,
            b[c++] = 4 * Math.PI / 3
        },
        render: function(a, b, c, d) {
            var e, f = a.getAttribLocation(b, "a_position"), g = a.getAttribLocation(b, "a_size"), h = a.getAttribLocation(b, "a_color"), i = a.getAttribLocation(b, "a_angle"), j = a.getUniformLocation(b, "u_resolution"), k = a.getUniformLocation(b, "u_matrix"), l = a.getUniformLocation(b, "u_ratio"), m = a.getUniformLocation(b, "u_scale");
            e = a.createBuffer(),
            a.bindBuffer(a.ARRAY_BUFFER, e),
            a.bufferData(a.ARRAY_BUFFER, c, a.DYNAMIC_DRAW),
            a.uniform2f(j, d.width, d.height),
            a.uniform1f(l, 1 / Math.pow(d.ratio, d.settings("nodesPowRatio"))),
            a.uniform1f(m, d.scalingRatio),
            a.uniformMatrix3fv(k, !1, d.matrix),
            a.enableVertexAttribArray(f),
            a.enableVertexAttribArray(g),
            a.enableVertexAttribArray(h),
            a.enableVertexAttribArray(i),
            a.vertexAttribPointer(f, 2, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0),
            a.vertexAttribPointer(g, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8),
            a.vertexAttribPointer(h, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 12),
            a.vertexAttribPointer(i, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16),
            a.drawArrays(a.TRIANGLES, d.start || 0, d.count || c.length / this.ATTRIBUTES)
        },
        initProgram: function(a) {
            var b, c, d;
            return b = sigma.utils.loadShader(a, ["attribute vec2 a_position;", "attribute float a_size;", "attribute float a_color;", "attribute float a_angle;", "uniform vec2 u_resolution;", "uniform float u_ratio;", "uniform float u_scale;", "uniform mat3 u_matrix;", "varying vec4 color;", "varying vec2 center;", "varying float radius;", "void main() {", "radius = a_size * u_ratio;", "vec2 position = (u_matrix * vec3(a_position, 1)).xy;", "center = position * u_scale;", "center = vec2(center.x, u_scale * u_resolution.y - center.y);", "position = position +", "2.0 * radius * vec2(cos(a_angle), sin(a_angle));", "position = (position / u_resolution * 2.0 - 1.0) * vec2(1, -1);", "radius = radius * u_scale;", "gl_Position = vec4(position, 0, 1);", "float c = a_color;", "color.b = mod(c, 256.0); c = floor(c / 256.0);", "color.g = mod(c, 256.0); c = floor(c / 256.0);", "color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;", "color.a = 1.0;", "}"].join("\n"), a.VERTEX_SHADER),
            c = sigma.utils.loadShader(a, ["precision mediump float;", "varying vec4 color;", "varying vec2 center;", "varying float radius;", "void main(void) {", "vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);", "vec2 m = gl_FragCoord.xy - center;", "float diff = radius - sqrt(m.x * m.x + m.y * m.y);", "if (diff > 0.0)", "gl_FragColor = color;", "else", "gl_FragColor = color0;", "}"].join("\n"), a.FRAGMENT_SHADER),
            d = sigma.utils.loadProgram(a, [b, c])
        }
    }
}(),
function() {
    "use strict";
    sigma.utils.pkg("sigma.webgl.nodes"),
    sigma.webgl.nodes.fast = {
        POINTS: 1,
        ATTRIBUTES: 4,
        addNode: function(a, b, c, d, e) {
            b[c++] = a[d + "x"],
            b[c++] = a[d + "y"],
            b[c++] = a[d + "size"],
            b[c++] = sigma.utils.floatColor(a.color || e("defaultNodeColor"))
        },
        render: function(a, b, c, d) {
            var e, f = a.getAttribLocation(b, "a_position"), g = a.getAttribLocation(b, "a_size"), h = a.getAttribLocation(b, "a_color"), i = a.getUniformLocation(b, "u_resolution"), j = a.getUniformLocation(b, "u_matrix"), k = a.getUniformLocation(b, "u_ratio"), l = a.getUniformLocation(b, "u_scale");
            e = a.createBuffer(),
            a.bindBuffer(a.ARRAY_BUFFER, e),
            a.bufferData(a.ARRAY_BUFFER, c, a.DYNAMIC_DRAW),
            a.uniform2f(i, d.width, d.height),
            a.uniform1f(k, 1 / Math.pow(d.ratio, d.settings("nodesPowRatio"))),
            a.uniform1f(l, d.scalingRatio),
            a.uniformMatrix3fv(j, !1, d.matrix),
            a.enableVertexAttribArray(f),
            a.enableVertexAttribArray(g),
            a.enableVertexAttribArray(h),
            a.vertexAttribPointer(f, 2, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0),
            a.vertexAttribPointer(g, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8),
            a.vertexAttribPointer(h, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 12),
            a.drawArrays(a.POINTS, d.start || 0, d.count || c.length / this.ATTRIBUTES)
        },
        initProgram: function(a) {
            var b, c, d;
            return b = sigma.utils.loadShader(a, ["attribute vec2 a_position;", "attribute float a_size;", "attribute float a_color;", "uniform vec2 u_resolution;", "uniform float u_ratio;", "uniform float u_scale;", "uniform mat3 u_matrix;", "varying vec4 color;", "void main() {", "gl_Position = vec4(", "((u_matrix * vec3(a_position, 1)).xy /", "u_resolution * 2.0 - 1.0) * vec2(1, -1),", "0,", "1", ");", "gl_PointSize = a_size * u_ratio * u_scale * 2.0;", "float c = a_color;", "color.b = mod(c, 256.0); c = floor(c / 256.0);", "color.g = mod(c, 256.0); c = floor(c / 256.0);", "color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;", "color.a = 1.0;", "}"].join("\n"), a.VERTEX_SHADER),
            c = sigma.utils.loadShader(a, ["precision mediump float;", "varying vec4 color;", "void main(void) {", "gl_FragColor = color;", "}"].join("\n"), a.FRAGMENT_SHADER),
            d = sigma.utils.loadProgram(a, [b, c])
        }
    }
}(),
function() {
    "use strict";
    sigma.utils.pkg("sigma.webgl.edges"),
    sigma.webgl.edges.def = {
        POINTS: 6,
        ATTRIBUTES: 7,
        addEdge: function(a, b, c, d, e, f, g) {
            var h = (a[f + "size"] || 1) / 2
              , i = b[f + "x"]
              , j = b[f + "y"]
              , k = c[f + "x"]
              , l = c[f + "y"]
              , m = a.color;
            if (!m)
                switch (g("edgeColor")) {
                case "source":
                    m = b.color || g("defaultNodeColor");
                    break;
                case "target":
                    m = c.color || g("defaultNodeColor");
                    break;
                default:
                    m = g("defaultEdgeColor")
                }
            m = sigma.utils.floatColor(m),
            d[e++] = i,
            d[e++] = j,
            d[e++] = k,
            d[e++] = l,
            d[e++] = h,
            d[e++] = 0,
            d[e++] = m,
            d[e++] = k,
            d[e++] = l,
            d[e++] = i,
            d[e++] = j,
            d[e++] = h,
            d[e++] = 1,
            d[e++] = m,
            d[e++] = k,
            d[e++] = l,
            d[e++] = i,
            d[e++] = j,
            d[e++] = h,
            d[e++] = 0,
            d[e++] = m,
            d[e++] = k,
            d[e++] = l,
            d[e++] = i,
            d[e++] = j,
            d[e++] = h,
            d[e++] = 0,
            d[e++] = m,
            d[e++] = i,
            d[e++] = j,
            d[e++] = k,
            d[e++] = l,
            d[e++] = h,
            d[e++] = 1,
            d[e++] = m,
            d[e++] = i,
            d[e++] = j,
            d[e++] = k,
            d[e++] = l,
            d[e++] = h,
            d[e++] = 0,
            d[e++] = m
        },
        render: function(a, b, c, d) {
            var e, f = a.getAttribLocation(b, "a_color"), g = a.getAttribLocation(b, "a_position1"), h = a.getAttribLocation(b, "a_position2"), i = a.getAttribLocation(b, "a_thickness"), j = a.getAttribLocation(b, "a_minus"), k = a.getUniformLocation(b, "u_resolution"), l = a.getUniformLocation(b, "u_matrix"), m = a.getUniformLocation(b, "u_matrixHalfPi"), n = a.getUniformLocation(b, "u_matrixHalfPiMinus"), o = a.getUniformLocation(b, "u_ratio"), p = a.getUniformLocation(b, "u_scale");
            e = a.createBuffer(),
            a.bindBuffer(a.ARRAY_BUFFER, e),
            a.bufferData(a.ARRAY_BUFFER, c, a.STATIC_DRAW),
            a.uniform2f(k, d.width, d.height),
            a.uniform1f(o, d.ratio / Math.pow(d.ratio, d.settings("edgesPowRatio"))),
            a.uniform1f(p, d.scalingRatio),
            a.uniformMatrix3fv(l, !1, d.matrix),
            a.uniformMatrix2fv(m, !1, sigma.utils.matrices.rotation(Math.PI / 2, !0)),
            a.uniformMatrix2fv(n, !1, sigma.utils.matrices.rotation(-Math.PI / 2, !0)),
            a.enableVertexAttribArray(f),
            a.enableVertexAttribArray(g),
            a.enableVertexAttribArray(h),
            a.enableVertexAttribArray(i),
            a.enableVertexAttribArray(j),
            a.vertexAttribPointer(g, 2, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0),
            a.vertexAttribPointer(h, 2, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8),
            a.vertexAttribPointer(i, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16),
            a.vertexAttribPointer(j, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 20),
            a.vertexAttribPointer(f, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 24),
            a.drawArrays(a.TRIANGLES, d.start || 0, d.count || c.length / this.ATTRIBUTES)
        },
        initProgram: function(a) {
            var b, c, d;
            return b = sigma.utils.loadShader(a, ["attribute vec2 a_position1;", "attribute vec2 a_position2;", "attribute float a_thickness;", "attribute float a_minus;", "attribute float a_color;", "uniform vec2 u_resolution;", "uniform float u_ratio;", "uniform float u_scale;", "uniform mat3 u_matrix;", "uniform mat2 u_matrixHalfPi;", "uniform mat2 u_matrixHalfPiMinus;", "varying vec4 color;", "void main() {", "vec2 position = a_thickness * u_ratio *", "normalize(a_position2 - a_position1);", "mat2 matrix = a_minus * u_matrixHalfPiMinus +", "(1.0 - a_minus) * u_matrixHalfPi;", "position = matrix * position + a_position1;", "gl_Position = vec4(", "((u_matrix * vec3(position, 1)).xy /", "u_resolution * 2.0 - 1.0) * vec2(1, -1),", "0,", "1", ");", "float c = a_color;", "color.b = mod(c, 256.0); c = floor(c / 256.0);", "color.g = mod(c, 256.0); c = floor(c / 256.0);", "color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;", "color.a = 1.0;", "}"].join("\n"), a.VERTEX_SHADER),
            c = sigma.utils.loadShader(a, ["precision mediump float;", "varying vec4 color;", "void main(void) {", "gl_FragColor = color;", "}"].join("\n"), a.FRAGMENT_SHADER),
            d = sigma.utils.loadProgram(a, [b, c])
        }
    }
}(),
function() {
    "use strict";
    sigma.utils.pkg("sigma.webgl.edges"),
    sigma.webgl.edges.fast = {
        POINTS: 2,
        ATTRIBUTES: 3,
        addEdge: function(a, b, c, d, e, f, g) {
            var h = ((a[f + "size"] || 1) / 2,
            b[f + "x"])
              , i = b[f + "y"]
              , j = c[f + "x"]
              , k = c[f + "y"]
              , l = a.color;
            if (!l)
                switch (g("edgeColor")) {
                case "source":
                    l = b.color || g("defaultNodeColor");
                    break;
                case "target":
                    l = c.color || g("defaultNodeColor");
                    break;
                default:
                    l = g("defaultEdgeColor")
                }
            l = sigma.utils.floatColor(l),
            d[e++] = h,
            d[e++] = i,
            d[e++] = l,
            d[e++] = j,
            d[e++] = k,
            d[e++] = l
        },
        render: function(a, b, c, d) {
            var e, f = a.getAttribLocation(b, "a_color"), g = a.getAttribLocation(b, "a_position"), h = a.getUniformLocation(b, "u_resolution"), i = a.getUniformLocation(b, "u_matrix");
            e = a.createBuffer(),
            a.bindBuffer(a.ARRAY_BUFFER, e),
            a.bufferData(a.ARRAY_BUFFER, c, a.DYNAMIC_DRAW),
            a.uniform2f(h, d.width, d.height),
            a.uniformMatrix3fv(i, !1, d.matrix),
            a.enableVertexAttribArray(g),
            a.enableVertexAttribArray(f),
            a.vertexAttribPointer(g, 2, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0),
            a.vertexAttribPointer(f, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8),
            a.lineWidth(3),
            a.drawArrays(a.LINES, d.start || 0, d.count || c.length / this.ATTRIBUTES)
        },
        initProgram: function(a) {
            var b, c, d;
            return b = sigma.utils.loadShader(a, ["attribute vec2 a_position;", "attribute float a_color;", "uniform vec2 u_resolution;", "uniform mat3 u_matrix;", "varying vec4 color;", "void main() {", "gl_Position = vec4(", "((u_matrix * vec3(a_position, 1)).xy /", "u_resolution * 2.0 - 1.0) * vec2(1, -1),", "0,", "1", ");", "float c = a_color;", "color.b = mod(c, 256.0); c = floor(c / 256.0);", "color.g = mod(c, 256.0); c = floor(c / 256.0);", "color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;", "color.a = 1.0;", "}"].join("\n"), a.VERTEX_SHADER),
            c = sigma.utils.loadShader(a, ["precision mediump float;", "varying vec4 color;", "void main(void) {", "gl_FragColor = color;", "}"].join("\n"), a.FRAGMENT_SHADER),
            d = sigma.utils.loadProgram(a, [b, c])
        }
    }
}(),
function() {
    "use strict";
    sigma.utils.pkg("sigma.webgl.edges"),
    sigma.webgl.edges.arrow = {
        POINTS: 9,
        ATTRIBUTES: 11,
        addEdge: function(a, b, c, d, e, f, g) {
            var h = (a[f + "size"] || 1) / 2
              , i = b[f + "x"]
              , j = b[f + "y"]
              , k = c[f + "x"]
              , l = c[f + "y"]
              , m = c[f + "size"]
              , n = a.color;
            if (!n)
                switch (g("edgeColor")) {
                case "source":
                    n = b.color || g("defaultNodeColor");
                    break;
                case "target":
                    n = c.color || g("defaultNodeColor");
                    break;
                default:
                    n = g("defaultEdgeColor")
                }
            n = sigma.utils.floatColor(n),
            d[e++] = i,
            d[e++] = j,
            d[e++] = k,
            d[e++] = l,
            d[e++] = h,
            d[e++] = m,
            d[e++] = 0,
            d[e++] = 0,
            d[e++] = 0,
            d[e++] = 0,
            d[e++] = n,
            d[e++] = k,
            d[e++] = l,
            d[e++] = i,
            d[e++] = j,
            d[e++] = h,
            d[e++] = m,
            d[e++] = 1,
            d[e++] = 1,
            d[e++] = 0,
            d[e++] = 0,
            d[e++] = n,
            d[e++] = k,
            d[e++] = l,
            d[e++] = i,
            d[e++] = j,
            d[e++] = h,
            d[e++] = m,
            d[e++] = 1,
            d[e++] = 0,
            d[e++] = 0,
            d[e++] = 0,
            d[e++] = n,
            d[e++] = k,
            d[e++] = l,
            d[e++] = i,
            d[e++] = j,
            d[e++] = h,
            d[e++] = m,
            d[e++] = 1,
            d[e++] = 0,
            d[e++] = 0,
            d[e++] = 0,
            d[e++] = n,
            d[e++] = i,
            d[e++] = j,
            d[e++] = k,
            d[e++] = l,
            d[e++] = h,
            d[e++] = m,
            d[e++] = 0,
            d[e++] = 1,
            d[e++] = 0,
            d[e++] = 0,
            d[e++] = n,
            d[e++] = i,
            d[e++] = j,
            d[e++] = k,
            d[e++] = l,
            d[e++] = h,
            d[e++] = m,
            d[e++] = 0,
            d[e++] = 0,
            d[e++] = 0,
            d[e++] = 0,
            d[e++] = n,
            d[e++] = k,
            d[e++] = l,
            d[e++] = i,
            d[e++] = j,
            d[e++] = h,
            d[e++] = m,
            d[e++] = 1,
            d[e++] = 0,
            d[e++] = 1,
            d[e++] = -1,
            d[e++] = n,
            d[e++] = k,
            d[e++] = l,
            d[e++] = i,
            d[e++] = j,
            d[e++] = h,
            d[e++] = m,
            d[e++] = 1,
            d[e++] = 0,
            d[e++] = 1,
            d[e++] = 0,
            d[e++] = n,
            d[e++] = k,
            d[e++] = l,
            d[e++] = i,
            d[e++] = j,
            d[e++] = h,
            d[e++] = m,
            d[e++] = 1,
            d[e++] = 0,
            d[e++] = 1,
            d[e++] = 1,
            d[e++] = n
        },
        render: function(a, b, c, d) {
            var e, f = a.getAttribLocation(b, "a_pos1"), g = a.getAttribLocation(b, "a_pos2"), h = a.getAttribLocation(b, "a_thickness"), i = a.getAttribLocation(b, "a_tSize"), j = a.getAttribLocation(b, "a_delay"), k = a.getAttribLocation(b, "a_minus"), l = a.getAttribLocation(b, "a_head"), m = a.getAttribLocation(b, "a_headPosition"), n = a.getAttribLocation(b, "a_color"), o = a.getUniformLocation(b, "u_resolution"), p = a.getUniformLocation(b, "u_matrix"), q = a.getUniformLocation(b, "u_matrixHalfPi"), r = a.getUniformLocation(b, "u_matrixHalfPiMinus"), s = a.getUniformLocation(b, "u_ratio"), t = a.getUniformLocation(b, "u_nodeRatio"), u = a.getUniformLocation(b, "u_arrowHead"), v = a.getUniformLocation(b, "u_scale");
            e = a.createBuffer(),
            a.bindBuffer(a.ARRAY_BUFFER, e),
            a.bufferData(a.ARRAY_BUFFER, c, a.STATIC_DRAW),
            a.uniform2f(o, d.width, d.height),
            a.uniform1f(s, d.ratio / Math.pow(d.ratio, d.settings("edgesPowRatio"))),
            a.uniform1f(t, Math.pow(d.ratio, d.settings("nodesPowRatio")) / d.ratio),
            a.uniform1f(u, 5),
            a.uniform1f(v, d.scalingRatio),
            a.uniformMatrix3fv(p, !1, d.matrix),
            a.uniformMatrix2fv(q, !1, sigma.utils.matrices.rotation(Math.PI / 2, !0)),
            a.uniformMatrix2fv(r, !1, sigma.utils.matrices.rotation(-Math.PI / 2, !0)),
            a.enableVertexAttribArray(f),
            a.enableVertexAttribArray(g),
            a.enableVertexAttribArray(h),
            a.enableVertexAttribArray(i),
            a.enableVertexAttribArray(j),
            a.enableVertexAttribArray(k),
            a.enableVertexAttribArray(l),
            a.enableVertexAttribArray(m),
            a.enableVertexAttribArray(n),
            a.vertexAttribPointer(f, 2, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0),
            a.vertexAttribPointer(g, 2, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8),
            a.vertexAttribPointer(h, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16),
            a.vertexAttribPointer(i, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 20),
            a.vertexAttribPointer(j, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 24),
            a.vertexAttribPointer(k, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 28),
            a.vertexAttribPointer(l, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 32),
            a.vertexAttribPointer(m, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 36),
            a.vertexAttribPointer(n, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 40),
            a.drawArrays(a.TRIANGLES, d.start || 0, d.count || c.length / this.ATTRIBUTES)
        },
        initProgram: function(a) {
            var b, c, d;
            return b = sigma.utils.loadShader(a, ["attribute vec2 a_pos1;", "attribute vec2 a_pos2;", "attribute float a_thickness;", "attribute float a_tSize;", "attribute float a_delay;", "attribute float a_minus;", "attribute float a_head;", "attribute float a_headPosition;", "attribute float a_color;", "uniform vec2 u_resolution;", "uniform float u_ratio;", "uniform float u_nodeRatio;", "uniform float u_arrowHead;", "uniform float u_scale;", "uniform mat3 u_matrix;", "uniform mat2 u_matrixHalfPi;", "uniform mat2 u_matrixHalfPiMinus;", "varying vec4 color;", "void main() {", "vec2 pos = normalize(a_pos2 - a_pos1);", "mat2 matrix = (1.0 - a_head) *", "(", "a_minus * u_matrixHalfPiMinus +", "(1.0 - a_minus) * u_matrixHalfPi", ") + a_head * (", "a_headPosition * u_matrixHalfPiMinus * 0.6 +", "(a_headPosition * a_headPosition - 1.0) * mat2(1.0)", ");", "pos = a_pos1 + (", "(1.0 - a_head) * a_thickness * u_ratio * matrix * pos +", "a_head * u_arrowHead * a_thickness * u_ratio * matrix * pos +", "a_delay * pos * (", "a_tSize / u_nodeRatio +", "u_arrowHead * a_thickness * u_ratio", ")", ");", "gl_Position = vec4(", "((u_matrix * vec3(pos, 1)).xy /", "u_resolution * 2.0 - 1.0) * vec2(1, -1),", "0,", "1", ");", "float c = a_color;", "color.b = mod(c, 256.0); c = floor(c / 256.0);", "color.g = mod(c, 256.0); c = floor(c / 256.0);", "color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;", "color.a = 1.0;", "}"].join("\n"), a.VERTEX_SHADER),
            c = sigma.utils.loadShader(a, ["precision mediump float;", "varying vec4 color;", "void main(void) {", "gl_FragColor = color;", "}"].join("\n"), a.FRAGMENT_SHADER),
            d = sigma.utils.loadProgram(a, [b, c])
        }
    }
}(),
function() {
    "use strict";
    if ("undefined" == typeof sigma)
        throw "sigma is not declared";
    sigma.utils.pkg("sigma.canvas.labels"),
    sigma.canvas.labels.def = function(a, b, c) {
        var d, e = c("prefix") || "", f = a[e + "size"];
        f < c("labelThreshold") || "string" == typeof a.label && (d = "fixed" === c("labelSize") ? c("defaultLabelSize") : c("labelSizeRatio") * f,
        b.font = (c("fontStyle") ? c("fontStyle") + " " : "") + d + "px " + c("font"),
        b.fillStyle = "node" === c("labelColor") ? a.color || c("defaultNodeColor") : c("defaultLabelColor"),
        b.fillText(a.label, Math.round(a[e + "x"] + f + 3), Math.round(a[e + "y"] + d / 3)))
    }
}
.call(this),
function() {
    "use strict";
    if ("undefined" == typeof sigma)
        throw "sigma is not declared";
    sigma.utils.pkg("sigma.canvas.hovers"),
    sigma.canvas.hovers.def = function(a, b, c) {
        var d, e, f, g, h, i = c("hoverFontStyle") || c("fontStyle"), j = c("prefix") || "", k = a[j + "size"], l = "fixed" === c("labelSize") ? c("defaultLabelSize") : c("labelSizeRatio") * k;
        b.font = (i ? i + " " : "") + l + "px " + (c("hoverFont") || c("font")),
        b.beginPath(),
        b.fillStyle = "node" === c("labelHoverBGColor") ? a.color || c("defaultNodeColor") : c("defaultHoverLabelBGColor"),
        c("labelHoverShadow") && (b.shadowOffsetX = 0,
        b.shadowOffsetY = 0,
        b.shadowBlur = 8,
        b.shadowColor = c("labelHoverShadowColor")),
        "string" == typeof a.label && (d = Math.round(a[j + "x"] - l / 2 - 2),
        e = Math.round(a[j + "y"] - l / 2 - 2),
        f = Math.round(b.measureText(a.label).width + l / 2 + k + 7),
        g = Math.round(l + 4),
        h = Math.round(l / 2 + 2),
        b.moveTo(d, e + h),
        b.arcTo(d, e, d + h, e, h),
        b.lineTo(d + f, e),
        b.lineTo(d + f, e + g),
        b.lineTo(d + h, e + g),
        b.arcTo(d, e + g, d, e + g - h, h),
        b.lineTo(d, e + h),
        b.closePath(),
        b.fill(),
        b.shadowOffsetX = 0,
        b.shadowOffsetY = 0,
        b.shadowBlur = 0),
        c("borderSize") > 0 && (b.beginPath(),
        b.fillStyle = "node" === c("nodeBorderColor") ? a.color || c("defaultNodeColor") : c("defaultNodeBorderColor"),
        b.arc(a[j + "x"], a[j + "y"], k + c("borderSize"), 0, 2 * Math.PI, !0),
        b.closePath(),
        b.fill());
        var m = sigma.canvas.nodes[a.type] || sigma.canvas.nodes.def;
        m(a, b, c),
        "string" == typeof a.label && (b.fillStyle = "node" === c("labelHoverColor") ? a.color || c("defaultNodeColor") : c("defaultLabelHoverColor"),
        b.fillText(a.label, Math.round(a[j + "x"] + k + 3), Math.round(a[j + "y"] + l / 3)))
    }
}
.call(this),
function() {
    "use strict";
    sigma.utils.pkg("sigma.canvas.nodes"),
    sigma.canvas.nodes.def = function(a, b, c) {
        var d = c("prefix") || "";
        b.fillStyle = a.color || c("defaultNodeColor"),
        b.beginPath(),
        b.arc(a[d + "x"], a[d + "y"], a[d + "size"], 0, 2 * Math.PI, !0),
        b.closePath(),
        b.fill()
    }
}(),
function() {
    "use strict";
    sigma.utils.pkg("sigma.canvas.edges"),
    sigma.canvas.edges.def = function(a, b, c, d, e) {
        var f = a.color
          , g = e("prefix") || ""
          , h = e("edgeColor")
          , i = e("defaultNodeColor")
          , j = e("defaultEdgeColor");
        if (!f)
            switch (h) {
            case "source":
                f = b.color || i;
                break;
            case "target":
                f = c.color || i;
                break;
            default:
                f = j
            }
        d.strokeStyle = f,
        d.lineWidth = a[g + "size"] || 1,
        d.beginPath(),
        d.moveTo(b[g + "x"], b[g + "y"]),
        d.lineTo(c[g + "x"], c[g + "y"]),
        d.stroke()
    }
}(),
function() {
    "use strict";
    sigma.utils.pkg("sigma.canvas.edges"),
    sigma.canvas.edges.arrow = function(a, b, c, d, e) {
        var f = a.color
          , g = e("prefix") || ""
          , h = e("edgeColor")
          , i = e("defaultNodeColor")
          , j = e("defaultEdgeColor")
          , k = a[g + "size"] || 1
          , l = c[g + "size"]
          , m = b[g + "x"]
          , n = b[g + "y"]
          , o = c[g + "x"]
          , p = c[g + "y"]
          , q = 2.5 * k
          , r = Math.sqrt(Math.pow(o - m, 2) + Math.pow(p - n, 2))
          , s = m + (o - m) * (r - q - l) / r
          , t = n + (p - n) * (r - q - l) / r
          , u = (o - m) * q / r
          , v = (p - n) * q / r;
        if (!f)
            switch (h) {
            case "source":
                f = b.color || i;
                break;
            case "target":
                f = c.color || i;
                break;
            default:
                f = j
            }
        d.strokeStyle = f,
        d.lineWidth = k,
        d.beginPath(),
        d.moveTo(m, n),
        d.lineTo(s, t),
        d.stroke(),
        d.fillStyle = f,
        d.beginPath(),
        d.moveTo(s + u, t + v),
        d.lineTo(s + .6 * v, t - .6 * u),
        d.lineTo(s - .6 * v, t + .6 * u),
        d.lineTo(s + u, t + v),
        d.closePath(),
        d.fill()
    }
}(),
function() {
    "use strict";
    sigma.utils.pkg("sigma.canvas.edges"),
    sigma.canvas.edges.curve = function(a, b, c, d, e) {
        var f = a.color
          , g = e("prefix") || ""
          , h = e("edgeColor")
          , i = e("defaultNodeColor")
          , j = e("defaultEdgeColor");
        if (!f)
            switch (h) {
            case "source":
                f = b.color || i;
                break;
            case "target":
                f = c.color || i;
                break;
            default:
                f = j
            }
        d.strokeStyle = f,
        d.lineWidth = a[g + "size"] || 1,
        d.beginPath(),
        d.moveTo(b[g + "x"], b[g + "y"]),
        d.quadraticCurveTo((b[g + "x"] + c[g + "x"]) / 2 + (c[g + "y"] - b[g + "y"]) / 4, (b[g + "y"] + c[g + "y"]) / 2 + (b[g + "x"] - c[g + "x"]) / 4, c[g + "x"], c[g + "y"]),
        d.stroke()
    }
}(),
function() {
    "use strict";
    if ("undefined" == typeof sigma)
        throw "sigma is not declared";
    sigma.utils.pkg("sigma.middlewares"),
    sigma.utils.pkg("sigma.utils"),
    sigma.middlewares.rescale = function(a, b, c) {
        var d, e, f, g, h, i, j, k, l = this.graph.nodes(), m = this.graph.edges(), n = this.settings.embedObjects(c || {}), o = n("bounds") || sigma.utils.getBoundaries(this.graph, a, !0), p = o.minX, q = o.minY, r = o.maxX, s = o.maxY, t = o.sizeMax, u = o.weightMax, v = n("width") || 1, w = n("height") || 1;
        for (j = "outside" === n("scalingMode") ? Math.max(v / Math.max(r - p, 1), w / Math.max(s - q, 1)) : Math.min(v / Math.max(r - p, 1), w / Math.max(s - q, 1)),
        k = (n("rescaleIgnoreSize") ? 0 : (n("maxNodeSize") || t) / j) + (n("sideMargin") || 0),
        r += k,
        p -= k,
        s += k,
        q -= k,
        j = "outside" === n("scalingMode") ? Math.max(v / Math.max(r - p, 1), w / Math.max(s - q, 1)) : Math.min(v / Math.max(r - p, 1), w / Math.max(s - q, 1)),
        n("maxNodeSize") || n("minNodeSize") ? n("maxNodeSize") === n("minNodeSize") ? (f = 0,
        g = n("maxNodeSize")) : (f = (n("maxNodeSize") - n("minNodeSize")) / t,
        g = n("minNodeSize")) : (f = 1,
        g = 0),
        n("maxEdgeSize") || n("minEdgeSize") ? n("maxEdgeSize") === n("minEdgeSize") ? (h = 0,
        i = n("minEdgeSize")) : (h = (n("maxEdgeSize") - n("minEdgeSize")) / u,
        i = n("minEdgeSize")) : (h = 1,
        i = 0),
        d = 0,
        e = m.length; e > d; d++)
            m[d][b + "size"] = m[d][a + "size"] * h + i;
        for (d = 0,
        e = l.length; e > d; d++)
            l[d][b + "size"] = l[d][a + "size"] * f + g,
            l[d][b + "x"] = (l[d][a + "x"] - (r + p) / 2) * j,
            l[d][b + "y"] = (l[d][a + "y"] - (s + q) / 2) * j
    }
    ,
    sigma.utils.getBoundaries = function(a, b, c) {
        var d, e, f = a.edges(), g = a.nodes(), h = -1 / 0, i = -1 / 0, j = 1 / 0, k = 1 / 0, l = -1 / 0, m = -1 / 0;
        if (c)
            for (d = 0,
            e = f.length; e > d; d++)
                h = Math.max(f[d][b + "size"], h);
        for (d = 0,
        e = g.length; e > d; d++)
            i = Math.max(g[d][b + "size"], i),
            l = Math.max(g[d][b + "x"], l),
            j = Math.min(g[d][b + "x"], j),
            m = Math.max(g[d][b + "y"], m),
            k = Math.min(g[d][b + "y"], k);
        return h = h || 1,
        i = i || 1,
        {
            weightMax: h,
            sizeMax: i,
            minX: j,
            minY: k,
            maxX: l,
            maxY: m
        }
    }
}
.call(this),
function() {
    "use strict";
    if ("undefined" == typeof sigma)
        throw "sigma is not declared";
    sigma.utils.pkg("sigma.middlewares"),
    sigma.middlewares.copy = function(a, b) {
        var c, d, e;
        if (b + "" != a + "") {
            for (e = this.graph.nodes(),
            c = 0,
            d = e.length; d > c; c++)
                e[c][b + "x"] = e[c][a + "x"],
                e[c][b + "y"] = e[c][a + "y"],
                e[c][b + "size"] = e[c][a + "size"];
            for (e = this.graph.edges(),
            c = 0,
            d = e.length; d > c; c++)
                e[c][b + "size"] = e[c][a + "size"]
        }
    }
}
.call(this),
function(a) {
    "use strict";
    if ("undefined" == typeof sigma)
        throw "sigma is not declared";
    sigma.utils.pkg("sigma.misc.animation.running");
    var b = function() {
        var a = 0;
        return function() {
            return "" + ++a
        }
    }();
    sigma.misc.animation.camera = function(c, d, e) {
        if (!(c instanceof sigma.classes.camera && "object" == typeof d && d))
            throw "animation.camera: Wrong arguments.";
        if ("number" != typeof d.x && "number" != typeof d.y && "number" != typeof d.ratio && "number" != typeof d.angle)
            throw "There must be at least one valid coordinate in the given val.";
        var f, g, h, i, j, k, l = e || {}, m = sigma.utils.dateNow();
        return k = {
            x: c.x,
            y: c.y,
            ratio: c.ratio,
            angle: c.angle
        },
        j = l.duration,
        i = "function" != typeof l.easing ? sigma.utils.easings[l.easing || "quadraticInOut"] : l.easing,
        f = function() {
            var b, e = l.duration ? (sigma.utils.dateNow() - m) / l.duration : 1;
            e >= 1 ? (c.isAnimated = !1,
            c.goTo({
                x: d.x !== a ? d.x : k.x,
                y: d.y !== a ? d.y : k.y,
                ratio: d.ratio !== a ? d.ratio : k.ratio,
                angle: d.angle !== a ? d.angle : k.angle
            }),
            cancelAnimationFrame(g),
            delete sigma.misc.animation.running[g],
            "function" == typeof l.onComplete && l.onComplete()) : (b = i(e),
            c.isAnimated = !0,
            c.goTo({
                x: d.x !== a ? k.x + (d.x - k.x) * b : k.x,
                y: d.y !== a ? k.y + (d.y - k.y) * b : k.y,
                ratio: d.ratio !== a ? k.ratio + (d.ratio - k.ratio) * b : k.ratio,
                angle: d.angle !== a ? k.angle + (d.angle - k.angle) * b : k.angle
            }),
            "function" == typeof l.onNewFrame && l.onNewFrame(),
            h.frameId = requestAnimationFrame(f))
        }
        ,
        g = b(),
        h = {
            frameId: requestAnimationFrame(f),
            target: c,
            type: "camera",
            options: l,
            fn: f
        },
        sigma.misc.animation.running[g] = h,
        g
    }
    ,
    sigma.misc.animation.kill = function(a) {
        if (1 !== arguments.length || "number" != typeof a)
            throw "animation.kill: Wrong arguments.";
        var b = sigma.misc.animation.running[a];
        return b && (cancelAnimationFrame(a),
        delete sigma.misc.animation.running[b.frameId],
        "camera" === b.type && (b.target.isAnimated = !1),
        "function" == typeof (b.options || {}).onComplete && b.options.onComplete()),
        this
    }
    ,
    sigma.misc.animation.killAll = function(a) {
        var b, c, d = 0, e = "string" == typeof a ? a : null, f = "object" == typeof a ? a : null, g = sigma.misc.animation.running;
        for (c in g)
            e && g[c].type !== e || f && g[c].target !== f || (b = sigma.misc.animation.running[c],
            cancelAnimationFrame(b.frameId),
            delete sigma.misc.animation.running[c],
            "camera" === b.type && (b.target.isAnimated = !1),
            d++,
            "function" == typeof (b.options || {}).onComplete && b.options.onComplete());
        return d
    }
    ,
    sigma.misc.animation.has = function(a) {
        var b, c = "string" == typeof a ? a : null, d = "object" == typeof a ? a : null, e = sigma.misc.animation.running;
        for (b in e)
            if (!(c && e[b].type !== c || d && e[b].target !== d))
                return !0;
        return !1
    }
}
.call(this),
function() {
    "use strict";
    if ("undefined" == typeof sigma)
        throw "sigma is not declared";
    sigma.utils.pkg("sigma.misc"),
    sigma.misc.bindEvents = function(a) {
        function b(b) {
            b && (f = "x"in b.data ? b.data.x : f,
            g = "y"in b.data ? b.data.y : g);
            var c, d, e, i, j, k, l, m, n = [], o = f + h.width / 2, p = g + h.height / 2, q = h.camera.cameraPosition(f, g), r = h.camera.quadtree.point(q.x, q.y);
            if (r.length)
                for (c = 0,
                e = r.length; e > c; c++)
                    if (i = r[c],
                    j = i[a + "x"],
                    k = i[a + "y"],
                    l = i[a + "size"],
                    !i.hidden && o > j - l && j + l > o && p > k - l && k + l > p && Math.sqrt(Math.pow(o - j, 2) + Math.pow(p - k, 2)) < l) {
                        for (m = !1,
                        d = 0; d < n.length; d++)
                            if (i.size > n[d].size) {
                                n.splice(d, 0, i),
                                m = !0;
                                break
                            }
                        m || n.push(i)
                    }
            return n
        }
        function c(a) {
            function c(a) {
                h.settings("eventsEnabled") && (h.dispatchEvent("click", a.data),
                g = b(a),
                g.length ? (h.dispatchEvent("clickNode", {
                    node: g[0]
                }),
                h.dispatchEvent("clickNodes", {
                    node: g
                })) : h.dispatchEvent("clickStage"))
            }
            function d(a) {
                h.settings("eventsEnabled") && (h.dispatchEvent("doubleClick", a.data),
                g = b(a),
                g.length ? (h.dispatchEvent("doubleClickNode", {
                    node: g[0]
                }),
                h.dispatchEvent("doubleClickNodes", {
                    node: g
                })) : h.dispatchEvent("doubleClickStage"))
            }
            function e() {
                if (h.settings("eventsEnabled")) {
                    var a, b, c, d = [];
                    for (a in i)
                        d.push(i[a]);
                    for (i = {},
                    b = 0,
                    c = d.length; c > b; b++)
                        h.dispatchEvent("outNode", {
                            node: d[b]
                        });
                    d.length && h.dispatchEvent("outNodes", {
                        nodes: d
                    })
                }
            }
            function f(a) {
                if (h.settings("eventsEnabled")) {
                    g = b(a);
                    var c, d, e, f = [], j = [], k = {}, l = g.length;
                    for (c = 0; l > c; c++)
                        e = g[c],
                        k[e.id] = e,
                        i[e.id] || (j.push(e),
                        i[e.id] = e);
                    for (d in i)
                        k[d] || (f.push(i[d]),
                        delete i[d]);
                    for (c = 0,
                    l = j.length; l > c; c++)
                        h.dispatchEvent("overNode", {
                            node: j[c]
                        });
                    for (c = 0,
                    l = f.length; l > c; c++)
                        h.dispatchEvent("outNode", {
                            node: f[c]
                        });
                    j.length && h.dispatchEvent("overNodes", {
                        nodes: j
                    }),
                    f.length && h.dispatchEvent("outNodes", {
                        nodes: f
                    })
                }
            }
            var g, i = {};
            a.bind("click", c),
            a.bind("mouseup", f),
            a.bind("mousemove", f),
            a.bind("mouseout", e),
            a.bind("doubleclick", d),
            h.bind("render", f)
        }
        var d, e, f, g, h = this;
        for (d = 0,
        e = this.captors.length; e > d; d++)
            c(this.captors[d])
    }
}
.call(this),
function() {
    "use strict";
    if ("undefined" == typeof sigma)
        throw "sigma is not declared";
    sigma.utils.pkg("sigma.misc"),
    sigma.misc.drawHovers = function(a) {
        function b() {
            c.contexts.hover.canvas.width = c.contexts.hover.canvas.width;
            var b, e = sigma.canvas.hovers, f = c.settings.embedObjects({
                prefix: a
            });
            if (f("enableHovering"))
                for (b in d)
                    d[b].hidden || (e[d[b].type] || e.def)(d[b], c.contexts.hover, f)
        }
        var c = this
          , d = {};
        this.bind("overNodes", function(a) {
            var c, e = a.data.nodes, f = e.length;
            for (c = 0; f > c; c++)
                d[e[c].id] = e[c];
            b()
        }),
        this.bind("outNodes", function(a) {
            var c, e = a.data.nodes, f = e.length;
            for (c = 0; f > c; c++)
                delete d[e[c].id];
            b()
        }),
        this.bind("render", function() {
            b()
        })
    }
}
.call(this),
function() {
    "use strict";
    if ("undefined" == typeof sigma)
        throw "sigma is not declared";
    sigma.classes.graph.addMethod("neighborhood", function(a) {
        var b, c, d, e, f, g = {}, h = {}, i = {
            nodes: [],
            edges: []
        };
        if (!this.nodes(a))
            return i;
        e = this.nodes(a),
        f = {},
        f.center = !0;
        for (b in e)
            f[b] = e[b];
        g[a] = !0,
        i.nodes.push(f);
        for (b in this.allNeighborsIndex[a]) {
            g[b] || (g[b] = !0,
            i.nodes.push(this.nodesIndex[b]));
            for (c in this.allNeighborsIndex[a][b])
                h[c] || (h[c] = !0,
                i.edges.push(this.edgesIndex[c]))
        }
        for (b in g)
            if (b !== a)
                for (c in g)
                    if (c !== a && b !== c && this.allNeighborsIndex[b][c])
                        for (d in this.allNeighborsIndex[b][c])
                            h[d] || (h[d] = !0,
                            i.edges.push(this.edgesIndex[d]));
        return i
    }),
    sigma.utils.pkg("sigma.plugins"),
    sigma.plugins.neighborhoods = function() {
        var a = new sigma.classes.graph;
        this.neighborhood = function(b) {
            return a.neighborhood(b)
        }
        ,
        this.load = function(b, c) {
            var d = function() {
                if (window.XMLHttpRequest)
                    return new XMLHttpRequest;
                var a, b;
                if (window.ActiveXObject) {
                    a = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
                    for (b in a)
                        try {
                            return new ActiveXObject(a[b])
                        } catch (c) {}
                }
                return null
            }();
            if (!d)
                throw "XMLHttpRequest not supported, cannot load the data.";
            return d.open("GET", b, !0),
            d.onreadystatechange = function() {
                4 === d.readyState && (a.clear().read(JSON.parse(d.responseText)),
                c && c())
            }
            ,
            d.send(),
            this
        }
        ,
        this.read = function(b) {
            a.clear().read(b)
        }
    }
}
.call(window),
function() {
    "use strict";
    var a = []
      , b = function(b, c, d) {
        a.push({
            name: b,
            drawShape: c,
            drawBorder: d
        })
    }
      , c = function() {
        return a
    }
      , d = function(a) {
        return function(b, c, d, e, f, g) {
            g.fillStyle = f,
            g.beginPath(),
            a(b, c, d, e, g),
            g.closePath(),
            g.fill()
        }
    }
      , e = function(a) {
        return function(b, c, d, e, f, g) {
            g.strokeStyle = f,
            g.lineWidth = e / 5,
            g.beginPath(),
            a(b, c, d, e, g),
            g.closePath(),
            g.stroke()
        }
    }
      , f = function(a, b, c, d, e) {
        var f = 45 * Math.PI / 180;
        e.moveTo(b + d * Math.sin(f), c - d * Math.cos(f));
        for (var g = 1; 4 > g; g++)
            e.lineTo(b + Math.sin(f + 2 * Math.PI * g / 4) * d, c - Math.cos(f + 2 * Math.PI * g / 4) * d)
    };
    b("square", d(f), e(f));
    var g = function(a, b, c, d, e) {
        e.arc(b, c, d, 0, 2 * Math.PI, !0)
    };
    b("circle", d(g), e(g));
    var h = function(a, b, c, d, e) {
        e.moveTo(b - d, c),
        e.lineTo(b, c - d),
        e.lineTo(b + d, c),
        e.lineTo(b, c + d)
    };
    b("diamond", d(h), e(h));
    var i = function(a, b, c, d, e) {
        var f = a.equilateral && a.equilateral.numPoints || 5
          , g = (a.equilateral && a.equilateral.rotate || 0) * Math.PI / 180
          , h = d;
        e.moveTo(b + h * Math.sin(g), c - h * Math.cos(g));
        for (var i = 1; f > i; i++)
            e.lineTo(b + Math.sin(g + 2 * Math.PI * i / f) * h, c - Math.cos(g + 2 * Math.PI * i / f) * h)
    };
    b("equilateral", d(i), e(i));
    var j = function(a, b, c, d, e) {
        var f = a.star && a.star.numPoints || 5
          , g = a.star && a.star.innerRatio || .5
          , h = d
          , i = d * g
          , j = Math.PI / f;
        e.moveTo(b, c - d);
        for (var k = 0; f > k; k++)
            e.lineTo(b + Math.sin(j + 2 * Math.PI * k / f) * i, c - Math.cos(j + 2 * Math.PI * k / f) * i),
            e.lineTo(b + Math.sin(2 * Math.PI * (k + 1) / f) * h, c - Math.cos(2 * Math.PI * (k + 1) / f) * h)
    };
    b("star", d(j), e(j));
    var k = function(a, b, c, d, e, f) {
        f.fillStyle = "yellow",
        f.beginPath(),
        f.arc(b, c, d, 1.25 * Math.PI, 0, !1),
        f.arc(b, c, d, 0, .75 * Math.PI, !1),
        f.lineTo(b, c),
        f.closePath(),
        f.fill(),
        f.fillStyle = "white",
        f.strokeStyle = "black",
        f.beginPath(),
        f.arc(b + d / 3, c - d / 3, d / 4, 0, 2 * Math.PI, !1),
        f.closePath(),
        f.fill(),
        f.stroke(),
        f.fillStyle = "black",
        f.beginPath(),
        f.arc(b + 4 * d / 9, c - d / 3, d / 8, 0, 2 * Math.PI, !1),
        f.closePath(),
        f.fill()
    };
    b("pacman", k, null),
    this.ShapeLibrary = {
        enumerate: c,
        version: "0.1"
    }
}
.call(this),
function(a) {
    "use strict";
    if ("undefined" == typeof sigma)
        throw "sigma is not declared";
    if ("undefined" == typeof ShapeLibrary)
        throw "ShapeLibrary is not declared";
    sigma.utils.pkg("sigma.canvas.nodes");
    var b = a
      , c = {}
      , d = function(a) {
        b = a
    }
      , e = function(a, d, e, f, g) {
        if (b && a.image && a.image.url) {
            var h = a.image.url
              , i = a.image.h || 1
              , j = a.image.w || 1
              , k = a.image.scale || 1
              , l = a.image.clip || 1
              , m = c[h];
            m || (m = document.createElement("IMG"),
            m.src = h,
            m.onload = function() {
                console.log("redraw on image load"),
                b.refresh()
            }
            ,
            c[h] = m);
            var n = i > j ? j / i : 1
              , o = j > i ? i / j : 1
              , p = f * k;
            g.save(),
            g.beginPath(),
            g.arc(d, e, f * l, 0, 2 * Math.PI, !0),
            g.closePath(),
            g.clip(),
            g.drawImage(m, d + Math.sin(-0.7855) * p * n, e - Math.cos(-0.7855) * p * o, p * n * 2 * Math.sin(-0.7855) * -1, p * o * 2 * Math.cos(-0.7855)),
            g.restore()
        }
    }
      , f = function(a, b, c) {
        sigma.canvas.nodes[a] = function(a, d, f) {
            var g = f("prefix") || ""
              , h = a[g + "size"]
              , i = a.color || f("defaultNodeColor")
              , j = a.borderColor || i
              , k = a[g + "x"]
              , l = a[g + "y"];
            d.save(),
            b && b(a, k, l, h, i, d),
            c && c(a, k, l, h, j, d),
            e(a, k, l, h, d),
            d.restore()
        }
    };
    ShapeLibrary.enumerate().forEach(function(a) {
        f(a.name, a.drawShape, a.drawBorder)
    }),
    this.CustomShapes = {
        init: d,
        version: "0.1"
    }
}
.call(this),
function() {
    "use strict";
    if ("undefined" == typeof sigma)
        throw "sigma is not declared";
    var a = sigma.utils.pkg("sigma.layout.forceatlas2");
    a.ForceAtlas2 = function(b, c) {
        var d = this;
        this.graph = b,
        this.p = sigma.utils.extend(c || {}, a.defaultSettings),
        this.state = {
            step: 0,
            index: 0
        },
        this.init = function() {
            return d.state = {
                step: 0,
                index: 0
            },
            d.graph.nodes().forEach(function(a) {
                a.fa2 = {
                    mass: 1 + d.graph.degree(a.id),
                    old_dx: 0,
                    old_dy: 0,
                    dx: 0,
                    dy: 0
                }
            }),
            d
        }
        ,
        this.go = function() {
            for (; d.atomicGo(); )
                ;
        }
        ,
        this.atomicGo = function() {
            var b, c, e, f, g, h, i, j = d.graph, k = j.nodes, l = j.edges, m = k(), n = l(), o = d.p.complexIntervals, p = d.p.simpleIntervals;
            switch (d.state.step) {
            case 0:
                for (b = 0,
                f = m.length; f > b; b++)
                    c = m[b],
                    c.fa2 = c.fa2 ? {
                        mass: 1 + d.graph.degree(c.id),
                        old_dx: c.fa2.dx || 0,
                        old_dy: c.fa2.dy || 0,
                        dx: 0,
                        dy: 0
                    } : {
                        mass: 1 + d.graph.degree(c.id),
                        old_dx: 0,
                        old_dy: 0,
                        dx: 0,
                        dy: 0
                    };
                if (d.p.barnesHutOptimize && (d.rootRegion = new a.Region(m,0),
                d.rootRegion.buildSubRegions()),
                d.p.outboundAttractionDistribution) {
                    for (d.p.outboundAttCompensation = 0,
                    b = 0,
                    f = m.length; f > b; b++)
                        c = m[b],
                        d.p.outboundAttCompensation += c.fa2.mass;
                    d.p.outboundAttCompensation /= m.length
                }
                return d.state.step = 1,
                d.state.index = 0,
                !0;
            case 1:
                var q, r, s, t, u, v, w = d.ForceFactory.buildRepulsion(d.p.adjustSizes, d.p.scalingRatio);
                if (d.p.barnesHutOptimize) {
                    for (u = d.rootRegion,
                    v = d.p.barnesHutTheta,
                    b = d.state.index; b < m.length && b < d.state.index + o; )
                        (c = m[b++]).fa2 && u.applyForce(c, w, v);
                    b === m.length ? d.state = {
                        step: 2,
                        index: 0
                    } : d.state.index = b
                } else {
                    for (s = d.state.index; s < m.length && s < d.state.index + o; )
                        if ((q = m[s++]).fa2)
                            for (t = 0; s > t; t++)
                                (r = m[t]).fa2 && w.apply_nn(q, r);
                    s === m.length ? d.state = {
                        step: 2,
                        index: 0
                    } : d.state.index = s
                }
                return !0;
            case 2:
                var x = d.p.strongGravityMode ? d.ForceFactory.getStrongGravity(d.p.scalingRatio) : d.ForceFactory.buildRepulsion(d.p.adjustSizes, d.p.scalingRatio)
                  , y = d.p.gravity
                  , z = d.p.scalingRatio;
                for (b = d.state.index; b < m.length && b < d.state.index + p; )
                    c = m[b++],
                    c.fa2 && x.apply_g(c, y / z);
                return b === m.length ? d.state = {
                    step: 3,
                    index: 0
                } : d.state.index = b,
                !0;
            case 3:
                var A = d.ForceFactory.buildAttraction(d.p.linLogMode, d.p.outboundAttractionDistribution, d.p.adjustSizes, d.p.outboundAttractionDistribution ? d.p.outboundAttCompensation : 1);
                if (b = d.state.index,
                0 === d.p.edgeWeightInfluence)
                    for (; b < n.length && b < d.state.index + o; )
                        e = n[b++],
                        A.apply_nn(k(e.source), k(e.target), 1);
                else if (1 === d.p.edgeWeightInfluence)
                    for (; b < n.length && b < d.state.index + o; )
                        e = n[b++],
                        A.apply_nn(k(e.source), k(e.target), e.weight || 1);
                else
                    for (; b < n.length && b < d.state.index + o; )
                        e = n[b++],
                        A.apply_nn(k(e.source), k(e.target), Math.pow(e.weight || 1, d.p.edgeWeightInfluence));
                return b === n.length ? d.state = {
                    step: 4,
                    index: 0
                } : d.state.index = b,
                !0;
            case 4:
                var B, C, D = 0, E = 0;
                for (b = 0,
                f = m.length; f > b; b++)
                    c = m[b],
                    g = c.fixed || !1,
                    !g && c.fa2 && (h = Math.sqrt(Math.pow(c.fa2.old_dx - c.fa2.dx, 2) + Math.pow(c.fa2.old_dy - c.fa2.dy, 2)),
                    D += c.fa2.mass * h,
                    E += .5 * c.fa2.mass * Math.sqrt(Math.pow(c.fa2.old_dx + c.fa2.dx, 2) + Math.pow(c.fa2.old_dy + c.fa2.dy, 2)));
                for (d.p.totalSwinging = D,
                d.p.totalEffectiveTraction = E,
                C = Math.pow(d.p.jitterTolerance, 2) * d.p.totalEffectiveTraction / d.p.totalSwinging,
                B = .5,
                d.p.speed = d.p.speed + Math.min(C - d.p.speed, B * d.p.speed),
                b = 0,
                f = m.length; f > b; b++)
                    c = m[b],
                    c.old_x = +c.x,
                    c.old_y = +c.y;
                return d.state.step = 5,
                !0;
            case 5:
                var F, G;
                if (b = d.state.index,
                d.p.adjustSizes)
                    for (G = d.p.speed; b < m.length && b < d.state.index + p; )
                        c = m[b++],
                        g = c.fixed || !1,
                        !g && c.fa2 && (h = Math.sqrt((c.fa2.old_dx - c.fa2.dx) * (c.fa2.old_dx - c.fa2.dx) + (c.fa2.old_dy - c.fa2.dy) * (c.fa2.old_dy - c.fa2.dy)),
                        i = .1 * G / (1 + G * Math.sqrt(h)),
                        F = Math.sqrt(Math.pow(c.fa2.dx, 2) + Math.pow(c.fa2.dy, 2)),
                        i = Math.min(i * F, 10) / F,
                        c.x += c.fa2.dx * i,
                        c.y += c.fa2.dy * i);
                else
                    for (G = d.p.speed; b < m.length && b < d.state.index + p; )
                        c = m[b++],
                        g = c.fixed || !1,
                        !g && c.fa2 && (h = Math.sqrt((c.fa2.old_dx - c.fa2.dx) * (c.fa2.old_dx - c.fa2.dx) + (c.fa2.old_dy - c.fa2.dy) * (c.fa2.old_dy - c.fa2.dy)),
                        i = G / (1 + G * Math.sqrt(h)),
                        c.x += c.fa2.dx * i,
                        c.y += c.fa2.dy * i);
                return b === m.length ? (d.state = {
                    step: 0,
                    index: 0
                },
                !1) : (d.state.index = b,
                !0);
            default:
                throw new Error("ForceAtlas2 - atomic state error")
            }
        }
        ,
        this.clean = function() {
            var a, b = this.graph.nodes(), c = b.length;
            for (a = 0; c > a; a++)
                delete b[a].fa2
        }
        ,
        this.setAutoSettings = function() {
            var a = this.graph;
            return this.p.scalingRatio = a.nodes().length >= 100 ? 2 : 10,
            this.p.strongGravityMode = !1,
            this.p.gravity = 1,
            this.p.outboundAttractionDistribution = !1,
            this.p.linLogMode = !1,
            this.p.adjustSizes = !1,
            this.p.edgeWeightInfluence = 1,
            this.p.jitterTolerance = a.nodes().length >= 5e4 ? 10 : a.nodes().length >= 5e3 ? 1 : .1,
            this.p.barnesHutOptimize = a.nodes().length >= 1e3 ? !0 : !1,
            this.p.barnesHutTheta = 1.2,
            this
        }
        ,
        this.kill = function() {}
        ,
        this.ForceFactory = {
            buildRepulsion: function(a, b) {
                return a ? new this.linRepulsion_antiCollision(b) : new this.linRepulsion(b)
            },
            getStrongGravity: function(a) {
                return new this.strongGravity(a)
            },
            buildAttraction: function(a, b, c, d) {
                return c ? a ? b ? new this.logAttraction_degreeDistributed_antiCollision(d) : new this.logAttraction_antiCollision(d) : b ? new this.linAttraction_degreeDistributed_antiCollision(d) : new this.linAttraction_antiCollision(d) : a ? b ? new this.logAttraction_degreeDistributed(d) : new this.logAttraction(d) : b ? new this.linAttraction_massDistributed(d) : new this.linAttraction(d)
            },
            linRepulsion: function(a) {
                this.coefficient = a,
                this.apply_nn = function(a, b) {
                    if (a.fa2 && b.fa2) {
                        var c = a.x - b.x
                          , d = a.y - b.y
                          , e = Math.sqrt(c * c + d * d);
                        if (e > 0) {
                            var f = this.coefficient * a.fa2.mass * b.fa2.mass / Math.pow(e, 2);
                            a.fa2.dx += c * f,
                            a.fa2.dy += d * f,
                            b.fa2.dx -= c * f,
                            b.fa2.dy -= d * f
                        }
                    }
                }
                ,
                this.apply_nr = function(a, b) {
                    var c = a.x - b.p.massCenterX
                      , d = a.y - b.p.massCenterY
                      , e = Math.sqrt(c * c + d * d);
                    if (e > 0) {
                        var f = this.coefficient * a.fa2.mass * b.p.mass / Math.pow(e, 2);
                        a.fa2.dx += c * f,
                        a.fa2.dy += d * f
                    }
                }
                ,
                this.apply_g = function(a, b) {
                    var c = a.x
                      , d = a.y
                      , e = Math.sqrt(c * c + d * d);
                    if (e > 0) {
                        var f = this.coefficient * a.fa2.mass * b / e;
                        a.fa2.dx -= c * f,
                        a.fa2.dy -= d * f
                    }
                }
            },
            linRepulsion_antiCollision: function(a) {
                this.coefficient = a,
                this.apply_nn = function(a, b) {
                    var c;
                    if (a.fa2 && b.fa2) {
                        var d = a.x - b.x
                          , e = a.y - b.y
                          , f = Math.sqrt(d * d + e * e) - a.size - b.size;
                        f > 0 ? (c = this.coefficient * a.fa2.mass * b.fa2.mass / Math.pow(f, 2),
                        a.fa2.dx += d * c,
                        a.fa2.dy += e * c,
                        b.fa2.dx -= d * c,
                        b.fa2.dy -= e * c) : 0 > f && (c = 100 * this.coefficient * a.fa2.mass * b.fa2.mass,
                        a.fa2.dx += d * c,
                        a.fa2.dy += e * c,
                        b.fa2.dx -= d * c,
                        b.fa2.dy -= e * c)
                    }
                }
                ,
                this.apply_nr = function(a, b) {
                    var c, d = a.fa2.x() - b.getMassCenterX(), e = a.fa2.y() - b.getMassCenterY(), f = Math.sqrt(d * d + e * e);
                    f > 0 ? (c = this.coefficient * a.fa2.mass * b.getMass() / Math.pow(f, 2),
                    a.fa2.dx += d * c,
                    a.fa2.dy += e * c) : 0 > f && (c = -this.coefficient * a.fa2.mass * b.getMass() / f,
                    a.fa2.dx += d * c,
                    a.fa2.dy += e * c)
                }
                ,
                this.apply_g = function(a, b) {
                    var c = a.x
                      , d = a.y
                      , e = Math.sqrt(c * c + d * d);
                    if (e > 0) {
                        var f = this.coefficient * a.fa2.mass * b / e;
                        a.fa2.dx -= c * f,
                        a.fa2.dy -= d * f
                    }
                }
            },
            strongGravity: function(a) {
                this.coefficient = a,
                this.apply_nn = function() {}
                ,
                this.apply_nr = function() {}
                ,
                this.apply_g = function(a, b) {
                    var c = a.x
                      , d = a.y
                      , e = Math.sqrt(c * c + d * d);
                    if (e > 0) {
                        var f = this.coefficient * a.fa2.mass * b;
                        a.fa2.dx -= c * f,
                        a.fa2.dy -= d * f
                    }
                }
            },
            linAttraction: function(a) {
                this.coefficient = a,
                this.apply_nn = function(a, b, c) {
                    if (a.fa2 && b.fa2) {
                        var d = a.x - b.x
                          , e = a.y - b.y
                          , f = -this.coefficient * c;
                        a.fa2.dx += d * f,
                        a.fa2.dy += e * f,
                        b.fa2.dx -= d * f,
                        b.fa2.dy -= e * f
                    }
                }
            },
            linAttraction_massDistributed: function(a) {
                this.coefficient = a,
                this.apply_nn = function(a, b, c) {
                    if (a.fa2 && b.fa2) {
                        var d = a.x - b.x
                          , e = a.y - b.y
                          , f = -this.coefficient * c / a.fa2.mass;
                        a.fa2.dx += d * f,
                        a.fa2.dy += e * f,
                        b.fa2.dx -= d * f,
                        b.fa2.dy -= e * f
                    }
                }
            },
            logAttraction: function(a) {
                this.coefficient = a,
                this.apply_nn = function(a, b, c) {
                    if (a.fa2 && b.fa2) {
                        var d = a.x - b.x
                          , e = a.y - b.y
                          , f = Math.sqrt(d * d + e * e);
                        if (f > 0) {
                            var g = -this.coefficient * c * Math.log(1 + f) / f;
                            a.fa2.dx += d * g,
                            a.fa2.dy += e * g,
                            b.fa2.dx -= d * g,
                            b.fa2.dy -= e * g
                        }
                    }
                }
            },
            logAttraction_degreeDistributed: function(a) {
                this.coefficient = a,
                this.apply_nn = function(a, b, c) {
                    if (a.fa2 && b.fa2) {
                        var d = a.x - b.x
                          , e = a.y - b.y
                          , f = Math.sqrt(d * d + e * e);
                        if (f > 0) {
                            var g = -this.coefficient * c * Math.log(1 + f) / f / a.fa2.mass;
                            a.fa2.dx += d * g,
                            a.fa2.dy += e * g,
                            b.fa2.dx -= d * g,
                            b.fa2.dy -= e * g
                        }
                    }
                }
            },
            linAttraction_antiCollision: function(a) {
                this.coefficient = a,
                this.apply_nn = function(a, b, c) {
                    if (a.fa2 && b.fa2) {
                        var d = a.x - b.x
                          , e = a.y - b.y
                          , f = Math.sqrt(d * d + e * e);
                        if (f > 0) {
                            var g = -this.coefficient * c;
                            a.fa2.dx += d * g,
                            a.fa2.dy += e * g,
                            b.fa2.dx -= d * g,
                            b.fa2.dy -= e * g
                        }
                    }
                }
            },
            linAttraction_degreeDistributed_antiCollision: function(a) {
                this.coefficient = a,
                this.apply_nn = function(a, b, c) {
                    if (a.fa2 && b.fa2) {
                        var d = a.x - b.x
                          , e = a.y - b.y
                          , f = Math.sqrt(d * d + e * e);
                        if (f > 0) {
                            var g = -this.coefficient * c / a.fa2.mass;
                            a.fa2.dx += d * g,
                            a.fa2.dy += e * g,
                            b.fa2.dx -= d * g,
                            b.fa2.dy -= e * g
                        }
                    }
                }
            },
            logAttraction_antiCollision: function(a) {
                this.coefficient = a,
                this.apply_nn = function(a, b, c) {
                    if (a.fa2 && b.fa2) {
                        var d = a.x - b.x
                          , e = a.y - b.y
                          , f = Math.sqrt(d * d + e * e);
                        if (f > 0) {
                            var g = -this.coefficient * c * Math.log(1 + f) / f;
                            a.fa2.dx += d * g,
                            a.fa2.dy += e * g,
                            b.fa2.dx -= d * g,
                            b.fa2.dy -= e * g
                        }
                    }
                }
            },
            logAttraction_degreeDistributed_antiCollision: function(a) {
                this.coefficient = a,
                this.apply_nn = function(a, b, c) {
                    if (a.fa2 && b.fa2) {
                        var d = a.x - b.x
                          , e = a.y - b.y
                          , f = Math.sqrt(d * d + e * e);
                        if (f > 0) {
                            var g = -this.coefficient * c * Math.log(1 + f) / f / a.fa2.mass;
                            a.fa2.dx += d * g,
                            a.fa2.dy += e * g,
                            b.fa2.dx -= d * g,
                            b.fa2.dy -= e * g
                        }
                    }
                }
            }
        }
    }
    ,
    a.Region = function(a, b) {
        this.depthLimit = 20,
        this.size = 0,
        this.nodes = a,
        this.subregions = [],
        this.depth = b,
        this.p = {
            mass: 0,
            massCenterX: 0,
            massCenterY: 0
        },
        this.updateMassAndGeometry()
    }
    ,
    a.Region.prototype.updateMassAndGeometry = function() {
        if (this.nodes.length > 1) {
            var a = 0
              , b = 0
              , c = 0;
            this.nodes.forEach(function(d) {
                a += d.fa2.mass,
                b += d.x * d.fa2.mass,
                c += d.y * d.fa2.mass
            });
            var d, e = b / a, f = c / a;
            this.nodes.forEach(function(a) {
                var b = Math.sqrt((a.x - e) * (a.x - e) + (a.y - f) * (a.y - f));
                d = Math.max(d || 2 * b, 2 * b)
            }),
            this.p.mass = a,
            this.p.massCenterX = e,
            this.p.massCenterY = f,
            this.size = d
        }
    }
    ,
    a.Region.prototype.buildSubRegions = function() {
        if (this.nodes.length > 1) {
            var b, c, d, e, f = [], g = [], h = [], i = this.p.massCenterX, j = this.p.massCenterY, k = this.depth + 1, l = this, m = [], n = [], o = [], p = [];
            this.nodes.forEach(function(a) {
                b = a.x < i ? f : g,
                b.push(a)
            }),
            f.forEach(function(a) {
                c = a.y < j ? m : n,
                c.push(a)
            }),
            g.forEach(function(a) {
                c = a.y < j ? p : o,
                c.push(a)
            }),
            [m, n, o, p].filter(function(a) {
                return a.length
            }).forEach(function(b) {
                k <= l.depthLimit && b.length < l.nodes.length ? (e = new a.Region(b,k),
                h.push(e)) : b.forEach(function(b) {
                    d = [b],
                    e = new a.Region(d,k),
                    h.push(e)
                })
            }),
            this.subregions = h,
            h.forEach(function(a) {
                a.buildSubRegions()
            })
        }
    }
    ,
    a.Region.prototype.applyForce = function(a, b, c) {
        if (this.nodes.length < 2) {
            var d = this.nodes[0];
            b.apply_nn(a, d)
        } else {
            var e = Math.sqrt((a.x - this.p.massCenterX) * (a.x - this.p.massCenterX) + (a.y - this.p.massCenterY) * (a.y - this.p.massCenterY));
            e * c > this.size ? b.apply_nr(a, this) : this.subregions.forEach(function(d) {
                d.applyForce(a, b, c)
            })
        }
    }
    ,
    sigma.prototype.startForceAtlas2 = function() {
        function b() {
            conrad.hasJob("forceatlas2_" + c.id) || conrad.addJob({
                id: "forceatlas2_" + c.id,
                job: c.forceatlas2.atomicGo,
                end: function() {
                    c.refresh(),
                    c.forceatlas2.isRunning && b()
                }
            })
        }
        if ((this.forceatlas2 || {}).isRunning)
            return this;
        this.forceatlas2 || (this.forceatlas2 = new a.ForceAtlas2(this.graph),
        this.forceatlas2.setAutoSettings(),
        this.forceatlas2.init()),
        this.forceatlas2.isRunning = !0;
        var c = this;
        return b(),
        this
    }
    ,
    sigma.prototype.stopForceAtlas2 = function() {
        return (this.forceatlas2 || {}).isRunning && (this.forceatlas2.state = {
            step: 0,
            index: 0
        },
        this.forceatlas2.isRunning = !1,
        this.forceatlas2.clean()),
        conrad.hasJob("forceatlas2_" + this.id) && conrad.killJob("forceatlas2_" + this.id),
        this
    }
    ,
    a.defaultSettings = {
        autoSettings: !0,
        linLogMode: !1,
        outboundAttractionDistribution: !1,
        adjustSizes: !1,
        edgeWeightInfluence: 0,
        scalingRatio: 1,
        strongGravityMode: !1,
        gravity: 1,
        jitterTolerance: 1,
        barnesHutOptimize: !1,
        barnesHutTheta: 1.2,
        speed: 1,
        outboundAttCompensation: 1,
        totalSwinging: 0,
        totalEffectiveTraction: 0,
        complexIntervals: 500,
        simpleIntervals: 1e3
    }
}(),
function() {
    "use strict";
    function a(a) {
        if (d[a])
            return d[a];
        var b = [0, 0, 0];
        return a.match(/^#/) ? (a = (a || "").replace(/^#/, ""),
        b = 3 === a.length ? [parseInt(a.charAt(0) + a.charAt(0), 16), parseInt(a.charAt(1) + a.charAt(1), 16), parseInt(a.charAt(2) + a.charAt(2), 16)] : [parseInt(a.charAt(0) + a.charAt(1), 16), parseInt(a.charAt(2) + a.charAt(3), 16), parseInt(a.charAt(4) + a.charAt(5), 16)]) : a.match(/^ *rgba? *\(/) && (a = a.match(/^ *rgba? *\( *([0-9]*) *, *([0-9]*) *, *([0-9]*) *(,.*)?\) *$/),
        b = [+a[1], +a[2], +a[3]]),
        d[a] = {
            r: b[0],
            g: b[1],
            b: b[2]
        },
        d[a]
    }
    function b(b, c, d) {
        b = a(b),
        c = a(c);
        var e = {
            r: b.r * (1 - d) + c.r * d,
            g: b.g * (1 - d) + c.g * d,
            b: b.b * (1 - d) + c.b * d
        };
        return "rgb(" + [0 | e.r, 0 | e.g, 0 | e.b].join(",") + ")"
    }
    if ("undefined" == typeof sigma)
        throw "sigma is not declared";
    sigma.utils.pkg("sigma.plugins");
    var c = 0
      , d = {};
    sigma.plugins.animate = function(a, d, e) {
        function f() {
            var c = (sigma.utils.dateNow() - k) / i;
            c >= 1 ? (a.graph.nodes().forEach(function(a) {
                for (var b in d)
                    b in d && (a[b] = a[d[b]])
            }),
            a.refresh(),
            "function" == typeof g.onComplete && g.onComplete()) : (c = j(c),
            a.graph.nodes().forEach(function(a) {
                for (var e in d)
                    e in d && (a[e] = e.match(/color$/) ? b(l[a.id][e], a[d[e]], c) : a[d[e]] * c + l[a.id][e] * (1 - c))
            }),
            a.refresh(),
            a.animations[h] = requestAnimationFrame(f))
        }
        var g = e || {}
          , h = ++c
          , i = g.duration || a.settings("animationsTime")
          , j = "string" == typeof g.easing ? sigma.utils.easings[g.easing] : "function" == typeof g.easing ? g.easing : sigma.utils.easings.quadraticInOut
          , k = sigma.utils.dateNow()
          , l = a.graph.nodes().reduce(function(a, b) {
            var c;
            a[b.id] = {};
            for (c in d)
                c in b && (a[b.id][c] = b[c]);
            return a
        }, {});
        a.animations = a.animations || Object.create({}),
        sigma.plugins.kill(a),
        f()
    }
    ,
    sigma.plugins.kill = function(a) {
        for (var b in a.animations || {})
            cancelAnimationFrame(a.animations[b])
    }
}
.call(window),
function() {
    "use strict";
    if ("undefined" == typeof sigma)
        throw "sigma is not declared";
    sigma.utils.pkg("sigma.parsers"),
    sigma.utils.pkg("sigma.utils"),
    sigma.utils.xhr = function() {
        if (window.XMLHttpRequest)
            return new XMLHttpRequest;
        var a, b;
        if (window.ActiveXObject) {
            a = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
            for (b in a)
                try {
                    return new ActiveXObject(a[b])
                } catch (c) {}
        }
        return null
    }
    ,
    sigma.parsers.json = function(a, b, c) {
        var d, e = sigma.utils.xhr();
        if (!e)
            throw "XMLHttpRequest not supported, cannot load the file.";
        e.open("GET", a, !0),
        e.onreadystatechange = function() {
            4 === e.readyState && (d = JSON.parse(e.responseText),
            b instanceof sigma ? (b.graph.clear(),
            b.graph.read(d)) : "object" == typeof b ? (b.graph = d,
            b = new sigma(b)) : "function" == typeof b && (c = b,
            b = null),
            c && c(b || d))
        }
        ,
        e.send()
    }
}
.call(this);
