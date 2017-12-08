"use strict";
window.$ = window.aero = (n => document.getElementById(n)), $.lastRequest = null, $.currentUrl = $.originalUrl = window.location.pathname, $.classes = {
    fadeIn: "fade-in",
    fadeOut: "fade-out"
}, $.init = function () {
    document.removeEventListener("DOMContentLoaded", $.init), $.content = $("content"), $.loadingAnimation = $("loading-animation"), $.content.addEventListener($.getTransitionEventName(), n => {
        if (n.target === $.content && n.target.classList.contains($.classes.fadeOut)) return $.content.response ? ($.setContent($.content.response), void $.scrollToTop()) : void($.content.transitionEnded = !0)
    }), $.ajaxifyLinks(), $.markActiveLinks()
}, document.addEventListener("DOMContentLoaded", $.init), window.addEventListener("popstate", n => {
    n.state ? $.load(n.state, !1) : $.currentUrl !== $.originalUrl && $.load($.originalUrl, !1)
});;
$.ajaxifyLinks = (t => {
    t || (t = document.body);
    let e = t.querySelectorAll(".ajax");
    for (let t = 0; t < e.length; t++) {
        let a = e[t];
        a.classList.remove("ajax"), a.onclick = function (t) {
            if (2 === t.which) return;
            let e = this.getAttribute("href");
            t.preventDefault(), t.stopPropagation(), e !== window.location.pathname && $.load(e)
        }
    }
});;
$.emit = (e => {
    document.dispatchEvent(new Event(e, {
        bubbles: !0,
        cancelable: !0
    }))
});;
$.executeScripts = (e => {
    e || (e = $.content);
    let t = e.getElementsByTagName("script");
    for (let e = 0; e < t.length; e++) {
        let n = t[e];
        "application/json" !== n.type && "application/ld+json" !== n.type && new Function(n.innerHTML)()
    }
});;
$.fadeIn = (s => {
    s && (s.classList.remove($.classes.fadeOut), s.classList.add($.classes.fadeIn))
});;
$.fadeOut = (s => {
    s && (s.classList.remove($.classes.fadeIn), s.classList.add($.classes.fadeOut))
});;
$.get = (e => new Promise((t, o) => {
    let r = new XMLHttpRequest;
    r.onerror = (() => o(new Error("You are either offline or the requested page doesn't exist."))), r.ontimeout = (() => o(new Error("The page took too much time to respond."))), r.onload = (() => {
        r.status < 200 || r.status >= 400 ? o(r.responseText) : t(r.responseText)
    }), r.open("GET", e, !0), r.send(), $.lastRequest = r
}));;
$.getJSON = (e => $.get(e).then(JSON.parse));;
$.getTransitionEventName = (() => {
    let n = document.createElement("fakeelement"),
        t = {
            transition: "transitionend",
            OTransition: "oTransitionEnd",
            MozTransition: "transitionend",
            WebkitTransition: "webkitTransitionEnd"
        };
    for (let i in t)
        if (void 0 !== n.style[i]) return t[i]
});;
$.load = ((t, n = !0) => {
    $.lastRequest && ($.lastRequest.abort(), $.lastRequest = null), $.currentUrl = t, n && history.pushState(t, null, t), $.content.response = null, $.content.transitionEnded = !1, $.fadeIn($.loadingAnimation), $.fadeOut($.content);
    let e = n => {
        if (t === $.currentUrl) return $.content.transitionEnded ? ($.setContent(n), void $.scrollToTop()) : void($.content.response = n)
    };
    $.get("/_" + t).then(e).catch(e), $.markActiveLinks(t)
});;
$.markActiveLinks = ((e, t) => {
    "object" == typeof e && (t = e, e = void 0), void 0 === e && (e = window.location.pathname), void 0 === t && (t = document.body);
    let i = t.querySelectorAll("a");
    for (let t = 0; t < i.length; t++) {
        let o = i[t];
        e === o.getAttribute("href") ? o.classList.add("active") : o.classList.remove("active")
    }
    $.emit("ActiveLinksMarked")
});;
$.post = ((e, t) => new Promise((s, o) => {
    let n = new XMLHttpRequest;
    n.onerror = (() => o(new Error("Error requesting " + e))), n.ontimeout = (() => o(new Error("Timeout requesting " + e))), n.onload = (() => {
        n.status < 200 || n.status >= 400 ? o(n.responseText) : s(n.responseText)
    }), n.open("POST", e, !0), "object" == typeof t ? (n.setRequestHeader("Content-type", "application/json"), n.send(JSON.stringify(t))) : n.send(t), $.lastRequest = n
}));;
$.scrollToTop = (() => {
    let o = $.content;
    for (; o = o.parentElement;) o.scrollTop = 0
});;
$.setContent = (n => {
    $.content.innerHTML = n, $.fadeIn($.content), $.fadeOut($.loadingAnimation), $.ajaxifyLinks($.content), $.markActiveLinks($.content), $.executeScripts($.content), $.emit("DOMContentLoaded")
});