(this["webpackJsonprestaurant-web"] = this["webpackJsonprestaurant-web"] || []).push([
    [0], {
        13: function(e, t, n) {},
        17: function(e, t, n) {
            "use strict";
            n.r(t);
            var a = n(1),
                r = n(4),
                d = n.n(r),
                c = (n(13), function(e) {
                    e && e instanceof Function && n.e(3).then(n.bind(null, 18)).then((function(t) {
                        var n = t.getCLS,
                            a = t.getFID,
                            r = t.getFCP,
                            d = t.getLCP,
                            c = t.getTTFB;
                        n(e), a(e), r(e), d(e), c(e)
                    }))
                }),
                i = n(7),
                s = (n(14), n(2)),
                l = n(8),
                o = n(0);

            function j() {
                var e = Object(s.utils)().getToday(),
                    t = Object(a.useState)(e),
                    n = Object(i.a)(t, 2),
                    r = n[0],
                    d = n[1],
                    c = { datePicked: r },
                    j = String(r.month + "/" + r.day + "/" + r.year);
                    //console.log("This is the date from react: "+j);
                return null != r ? Object(o.jsx)(o.Fragment, { children: Object(o.jsxs)(l.a, { id: "calendarWidget", children: [Object(o.jsx)("div", { className: "calendar-wrapper ", children: Object(o.jsx)(s.Calendar, { value: r, onChange: d, calendarClassName: "responsive-calendar", shouldHighlightWeekends: !0 }) }), Object(o.jsxs)("div", { className: "date-wrapper", children: [Object(o.jsxs)("p", { id: "date_picked", children: [c.datePicked.month, "-", c.datePicked.day, "-", c.datePicked.year] })] })] }) }) : Object(o.jsx)(o.Fragment, { children: Object(o.jsx)("div", { children: Object(o.jsx)("h1", { children: "An unexpected error has occurred." }) }) })
            }
            var h = n(5),
                u = n.n(h);

            function b() {
                var e = Object(h.useOpenWeather)({ key: "04b880df429434d7b1778907fa79b3ee", lat: "40.885632", lon: "-72.388509", lang: "en", unit: "imperial" }),
                    t = e.data,
                    n = e.isLoading,
                    a = e.errorMessage;
                return null != t , null != t ? Object(o.jsxs)("div", { className: "wheather-wrapper", children: [Object(o.jsx)(u.a, { isLoading: n, errorMessage: a, data: t, lang: "en", locationLabel: "Restaurant City", unitsLabels: { temperature: "F", windSpeed: "Mph" }, showForecast: !0 }), Object(o.jsx)("div", { id: "current-forecast", children: Object(o.jsx)("p", { children: t.current.description }) })] }) : Object(o.jsx)("div", { children: Object(o.jsx)("h1", { children: "Loading..." }) })
            }
            var g = document.getElementById("calendar-widget"),
                p = document.getElementById("weather-widget");
            g && d.a.render(Object(o.jsx)(j, {}), document.getElementById("calendar-widget")), p && d.a.render(Object(o.jsx)(b, {}), document.getElementById("weather-widget")), c()
        }
    },
    [
        [17, 1, 2]
    ]
]);
//# sourceMappingURL=main.0b138470.chunk.js.map