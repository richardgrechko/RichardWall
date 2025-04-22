var client = {
  events: {},
  on: function (type, call) {
    if (typeof call != "function") {
      throw "Callback is not a function";
    }
    type = type.toLowerCase();
    if (!client.events[type]) client.events[type] = [];
    client.events[type].push(call);
  },
  off: function (type, call) {
    type = type.toLowerCase();
    if (!client.events[type]) return;
    while (true) {
      var idx = client.events[type].indexOf(call);
      if (idx == -1) break;
      client.events[type].splice(idx, 1);
    }
  },
  emit: function (type, data) {
    type = type.toLowerCase();
    var evt = client.events[type];
    if (!evt) return;
    evt.forEach((func) => func(data));
  },
  commands: {
    getid: (args) => {
      var ids = [];
      client.cursors.forEach((cursor, id) => {
        if (cursor.n == args[0]) ids.push(id);
      });
      // clientMessage isn't defined 😔
      clientMessage(ids.join(", "));
    },
  },
  
};


let wsUrl = "wss://" + location.host + "/ws";

if (location.protocol !== "https:") {
    wsUrl = "ws://" + location.host + "/ws";
}

let flushInterval = 0;

var emotes = ["correct", "wrong", "chillcat", "revolver"];
function convertToEmote(msg) {
  return msg.replace(/:([a-zA-Z0-9_-]+):/g, (match, p1) =>
    emotes.includes(p1)
      ? `<img class="emoji" src="/static/emotes/${p1}.webp">`
      : match
  );
}
!(function (e) {
  var t = () => "";
  (function (e) {
    var n = t;
    class r {
      constructor(e, n) {
        var r = t;
        (this.charMap = new Map()),
          (this["scale"] = 1),
          (this.spaceMissingCharacters = !0),
          (this["forceSharpPixels"] = !1),
          (this["bold"] = !1),
          (this.italic = !1),
          null != e && this["fetchFont"](e, n);
      }
      ["fetchFont"](e, r) {
        var a = n,
          o = this,
          i = new XMLHttpRequest();
        (i.onreadystatechange = function () {
          var e = t;
          4 == i["readyState"] &&
            200 == i["status"] &&
            (o["parseFont"](i.responseText), null != r && r());
        }),
          i["open"]("GET", e, !0),
          i["send"](null);
      }
      ["parseFont"](e) {
        var t = n,
          r = e["split"]("\n");
        const a = r["length"];
        for (var o = 0; o < a; o++) {
          var i = r[o];
          if (!i.startsWith("#")) {
            var c = i["split"](":");
            if (2 == c.length) {
              for (
                var l = parseInt(c[0], 16),
                  u = c[1],
                  s = u["length"],
                  d = new Uint8Array(s / 2),
                  f = 0;
                f < s;
                f += 2
              )
                d[f / 2] = parseInt(u.slice(f, f + 2), 16);
              this.charMap.set(l, d);
            }
          }
        }
      }
      ["exportFont"]() {
        var e = n,
          t = "";
        for (const [n, o] of this["charMap"].entries()) {
          var r = "";
          (r += n["toString"](16)["padStart"](4, "0").toUpperCase()),
            (r += ":");
          for (var a = 0; a < o.length; a++)
            r += o[a]["toString"](16)["padStart"](2, "0")["toUpperCase"]();
          t += r += "\n";
        }
        return t;
      }
      drawChar(e, t, r, a) {
        var o = n,
          i = e.codePointAt(),
          c = this.charMap["get"](i);
        if (null == c)
          return this["spaceMissingCharacters"] ? 8 * this["scale"] : 0;
        var l = c["length"],
          u = l / 16,
          s = (this["bold"] ? 2 : 1) * this["scale"],
          d = 1 * this["scale"];
        this["forceSharpPixels"] && ((s = Math["ceil"](s)), (d = Math.ceil(d)));
        for (var f = 0; f < l; f++) {
          var v = c[f],
            m = this["italic"] ? Math.round((f - l) / 3) : 0,
            h = Math["floor"](f / u) * this.scale;
          this.forceSharpPixels && (h = Math["round"](h));
          for (var y = 0; y < 8; y++)
            if ((v >> y) & 1) {
              var g = (8 * (Math.floor(f % u) + 1) - y - m) * this.scale;
              this["forceSharpPixels"] && (g = Math["round"](g)),
                t.fillRect(r + g, a + h, s, d);
            }
        }
        return 8 * u * this["scale"];
      }
      ["drawText"](e, t, r, a) {
        for (
          var o = n, i = r, c = a, l = Array["from"](e), u = 0;
          u < l["length"];
          u++
        ) {
          var s = l[u];
          "\r" != s &&
            ("\n" != s
              ? (r += this.drawChar(s, t, r, a))
              : ((a += 16 * this.scale), (r = i)));
        }
        return { x: r - i, y: (a += 16 * this["scale"]) - c };
      }
    }
    var a,
      o = "/";
    const i = document.getElementById("textarea"),
      c = document["getElementById"]("connecting"),
      l = document["getElementById"]("info"),
      u =
        -1 != navigator.userAgent["indexOf"]("iPhone") ||
        -1 != navigator["userAgent"]["indexOf"]("iPod") ||
        -1 != navigator.userAgent.indexOf("iPad"),
      s = -1 != navigator["userAgent"]["indexOf"]("Firefox"),
      d = u ? 40 : 200,
      f = new Date();
    var v = devicePixelRatio,
      m = !1,
      h = document["title"],
      y = !0;
    const g = document["getElementById"]("toast");
    var p;
    const b = document["getElementById"]("clipboard"),
      x = document["getElementById"]("usermenu"),
      w = document["getElementById"]("colourlist"),
      M = document["getElementById"]("teleport");
    var k = document["getElementById"]("canvas");
    k["removeAttribute"]("id");
    var E = k.getContext("2d", { alpha: !1 });
    (k["width"] = Math.round(window["innerWidth"] * v)),
      (k["height"] = Math["round"](window.innerHeight * v)),
      (k["style"]["width"] = window["innerWidth"] + "px"),
      (k["style"]["height"] = window["innerHeight"] + "px"),
      (E.imageSmoothingEnabled = !1);
    const S = "#FFFFFF",
      I = "#EBEBEB";
    var C = S,
      A = I,
      T = Xr(A, 10);
    const B = document.getElementById("primary"),
      F = document["getElementById"]("secondary"),
      P = document["getElementById"]("themetext"),
      L = document["getElementById"]("thememenu"),
      O = document.getElementById("customfont"),
      R = document["getElementById"]("customfontsize"),
      D = document["getElementById"]("fontmenu");
    var N = 0;
    var j = 0,
      U = !1,
      W = "",
      H = "",
      K = !1;
    const X = document["getElementById"]("wallsettings"),
      z = document["getElementById"]("addmembers"),
      q = document["getElementById"]("walllist");
    var Y;
    const J = document["getElementById"]("deletewall"),
      V = String.fromCharCode(10240),
      Z = String["fromCharCode"](27),
      $ = {                     
        "Courier New": 16,                                          
        "Cousine": 16,                                              
        "Consolas": 18,                                             
        "Ubuntu Mono": 19,                                          
        "Inconsolata": 18,                                          
        "CMU Typewriter Text": 19,                                  
        "monospace": 18,                                            
        "Roboto Mono": 16,                                          
        "Source Code Pro": 17,                                      
        "Noto Sans Mono": 16,                                       
        "IBM Plex Mono": 16,                                        
        "Segoe Mono Boot": 18,                                      
        "Anonymous Pro": 19,                                        
        "MS Gothic": 18,                                            
        "Chivo Mono": 17,                                           
        "Unifont": 0,                                              
        "Terminus": 0,                                             
        "Lucida Console": 16,                                       
        "Fragment Mono": 16,                                        
        "DM Mono": 16,                                              
        "JetBrains Mono": 17,                                       
        "Cascadia Mono": 17,                                        
        "Cutive Mono": 18,                                          
        "Courier Prime": 16,                                        
        "Fantasque Sans Mono": 18,                                  
        Custom: 20,              
      };
    var G = "JetBrains Mono",
      Q = Math.floor($[G] * v) + "px " + G + ", monospace, Special";
    const _ = new Map();
    _["set"]("Unifont", void 0),
      _["set"]("Terminus", void 0),
      _["set"]("Fixed", void 0);
    const ee = Object.keys($)["length"],
      te = document["getElementById"]("fontselect");
    for (var ne = 0; te["length"] > 0; ne++);
    var option;
    for (ne = 0; ne < ee; ne++)
      (option = document["createElement"]("option")),
        (option["text"] = Object.keys($)[ne]),
        te.add(option);
    te["value"] = G;
    const re = document.getElementById("decorations");
    re["addEventListener"]("contextmenu", function (e) {
      e["preventDefault"]();
    });
    const ae = {
      bold: { el: document["getElementById"]("bold"), enabled: !1 },
      italic: { el: document["getElementById"]("italic"), enabled: !1 },
      underline: { el: document.getElementById("underline"), enabled: !1 },
      overline: { el: document.getElementById("overline"), enabled: !1 },
      strikethrough: {
        el: document.getElementById("strikethrough"),
        enabled: !1,
      },
    };
    var oe = Object.keys(ae);
    for (ne = 0; ne < oe.length; ne++)
      ae[oe[ne]].el.addEventListener("click", pr);
    function ie(e) {
      var t,
        r,
        a = n;
      if (e) {
        re["style"].display = "flex";
        var o =
          ((t = Ce.x),
          (r = Ce.y),
          {
            x:
              (t * (10 * v)) / devicePixelRatio +
              qe["offset"].x / devicePixelRatio,
            y:
              (r * (20 * v)) / devicePixelRatio +
              qe.offset.y / devicePixelRatio,
          });
        o.x + 15 * v + re["clientWidth"] > window["innerWidth"]
          ? (re.style["left"] = o.x - re["clientWidth"] - 5 * at + "px")
          : (re["style"]["left"] = o.x + 15 * at + "px"),
          (re["style"]["top"] =
            Math["max"](o.y - re["clientHeight"], 0) + "px");
      } else re["style"]["display"] = "none";
    }
    function ce() {
      var e = n,
        t = 0;
      return (
        ae.bold["enabled"] && (t += 8),
        ae.italic.enabled && (t += 4),
        ae["underline"]["enabled"] && (t += 2),
        ae["overline"]["enabled"] && (t += 16),
        ae["strikethrough"]["enabled"] && (t += 1),
        t
      );
    }
    function le(e) {
      var t = n;
      br("bold", Boolean(8 & e)),
        br("italic", Boolean(4 & e)),
        br("underline", Boolean(2 & e)),
        br("overline", Boolean(16 & e)),
        br("strikethrough", Boolean(1 & e));
    }
    const ue = 192,
      se = [
        '#141617',
        '#3d4043',
        '#798086',
        '#bcbfc2',
        '#bf0808',
        '#ed2626',
        '#f7a1a1',
        '#bf3608',
        '#ed5826',
        '#f7b7a1',
        '#bf6408',
        '#ed8a26',
        '#f7cca1',
        '#bfbf08',
        '#eded26',
        '#f7f7a1',
        '#5aad07',
        '#75db0f',
        '#b3f273',
        '#069e06',
        '#0ecd0e',
        '#54ed54',
        '#069c82',
        '#26dced',
        '#a1f0f7',
        '#087fd4',
        '#269aed',
        '#a1d3f7',
        '#083cd4',
        '#2658ed',
        '#a1b7f7',
        '#3908c9',
        '#5826ed',
        '#b6a1f7',
        '#7308bf',
        '#9a26ed',
        '#d3a1f7',
        '#bf08bf',
        '#ed26ed',
        '#f7a1f7'
      ],
      de = [
        "Black/White",
        "Dark Grey",
        "Grey",
        "Light Grey",
        "Ruby",
        "Red",
        "Pale Red",
        "Topaz",
        "Tangerine",
        "Beige",
        "Brown",
        "Orange",
        "Flesh",
        "Sunflower",
        "Yellow",
        "Pale Yellow",
        "Camouflage Green",
        "Chartreuse",
        "Lime",
        "Dark Green",
        "Green",
        "Light Green",
        "Teal",
        "Cyan",
        "Sky",
        "Prussian Blue",
        "Cerulean",
        "Baby Blue",
        "Sea Blue",
        "Blue",
        "Periwinkle",
        "Indigo",
        "Blueberry",
        "Lilac",
        "Violet",
        "Purple",
        "Light Purple",
        "Dark Magenta",
        "Magenta",
        "Pink",
      ],
      fe = [
        0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39
      ];
    function ve(e) {
      for (var t = n, r = 0; r < se["length"]; r++) if (fe[r] == e) return r;
      return -1;
    }
    var me = [];
    !(function () {
      var e = n;
      for (ne = 0; ne < se["length"]; ne++) me[ne] = Yr(se[ne], 0.2);
      me[se["length"]] = "rgba(255, 255, 255, 0.2)";
    })();
    client.color = 0;
    window.writeBuffer = [];
    var he,
      ye,
      ge,
      be = Yr(se[client.color], 0.6),
      xe = !1,
      we = new Map(),
      
      ke = [],
      Ee = new Map(),
      Se = new Worker("/static/ping.js"),
      Ie = !1,
      Ce = {
        x: 0,
        y: 0,
        rawx: 0,
        rawy: 0,
        visible: !0,
        start: 0,
        lastedit: { x: 0, y: 0 },
      },
      Ae = { x: 0, y: 0 },
      Te = { x: 0, y: 0 },
      Be = [],
      Fe = [],
      Pe = new Map(),
      Le = !0,
      Oe = !0,
      Re = !0,
      De = !1,
      Ne = [],
      je = "",
      Ue = 0,
      We = 0,
      He = document["getElementById"]("coords"),
      Ke = document.getElementById("nearby"),
      Xe = performance["now"](),
      ze = { scale: 1, offset: { x: 0, y: 0 } },
      qe = {
        start: { x: null, y: null },
        offset: { x: 0, y: 0 },
        coords: { x: 0, y: 0 },
      },
      Ye = !1,
      Je = !1,
      Ve = !1,
      Ze = !1,
      $e = {},
      Ge = [],
      Qe = null,
      _e = [];
    
   
    for (ne = 0; ne < 200; ne++) _e[ne] = " ";
    var et = [];
    for (ne = 0; ne < 200; ne++) et[ne] = 0;
    document.getElementById("fontselect")["onchange"] = function (e) {
      var t = n;
      vt(e["target"]["value"]);
    };
    const tt = {
      showothercurs: document.getElementById("showothercurs"),
      shownametags: document["getElementById"]("shownametags"),
      showchat: document["getElementById"]("showchat"),
      disablecolour: document.getElementById("disablecolour"),
      smoothpanning: document["getElementById"]("smoothpanning"),
      smoothcursors: document.getElementById("smoothcursors"),
      copycolour: document["getElementById"]("copycolour"),
      copydecorations: document["getElementById"]("copydecorations"),
      rainbow: document["getElementById"]("rainbow"),
      anonymous: document["getElementById"]("anonymous"),
    };
    (tt.showothercurs["checked"] = !0),
      (tt["shownametags"]["checked"] = !0),
      (tt.showchat["checked"] = !0),
      (tt["disablecolour"]["checked"] = !1),
      (tt["smoothpanning"]["checked"] = !0),
      (tt["smoothcursors"].checked = !0);
    const nt = {
      protect: document["getElementById"]("protect"),
      clear: document.getElementById("clear"),
      readOnly: document["getElementById"]("readonly"),
      private: document.getElementById("private"),
      hideCursors: document["getElementById"]("hidecursors"),
      disableChat: document["getElementById"]("disablechat"),
      disableColour: document["getElementById"]("walldisablecolour"),
      disableBraille: document.getElementById("disablebraille"),
    };
    var rt = 1,
      at = 1,
      ot = document["getElementById"]("zoom");
    function it(e, t) {
      var r = n;
      (rt = e),
        (at = Math.round(100 * rt) / 100);
        at = Math.min(Math.max(at, 0.5), 3);
        localStorage["setItem"]("zoom", Math.min(Math.max(at, 0.5), 3)),
        (ot["value"] = 10 * at),
        t && ir(Math["round"](100 * at) + "%", 1e3),
        kn();
    }
    client.changeZoom = function(decimal, showUser, save) {
      var r = n;
      (rt = e),
        (decimal = Math.round(100 * rt) / 100);
        save && localStorage["setItem"]("zoom", Math.min(Math.max(decimal, 0.5), 3)),
        (ot["value"] = 10 * decimal),
        showUser && ir(Math["round"](100 * decimal) + "%", 1e3),
        kn();
    }
    function ct() {
      it(ot["value"] / 10, !0);
    }
    var lt = document["getElementById"]("registerlink"),
      ut = document["getElementById"]("loginlink"),
      st = document.getElementById("logoutlink");
    function dt(e, t) {
      var r = n;
      e &&
        (localStorage.removeItem("username"),
        localStorage["removeItem"]("token")),
        (je = "(" + client.id + ")"),
        (client.registered = false),
        (j = 0),
        (X.style["display"] = "none"),
        a.readyState != a["OPEN"] ||
          t ||
          (nt.private["checked"] && Cn("textwall", "main"),
          a.send(Or({ logout: 0 })),
          (Re = !0)),
        (document["getElementById"]("login")["style"]["display"] = "block"),
        (document["getElementById"]("loginwithdiscord")["style"]["display"] =
          "inline"),
        (document["getElementById"]("logintext")["style"]["display"] = "block"),
        (document.getElementById("loggedin")["style"].display = "none"),
        (document.getElementById("register")["style"].display = "none"),
        //cancelDiscordLogin(),
        vn(!1),
        xn(),
        (m = !1),
        (document["getElementById"]("admin")["style"]["display"] = "none"),
        (ge = !0);
    }
    function ft() {
      var e = n;
      return 16 * Math["round"](v) > 20 * v || 16 * Math["round"](v) < 13 * v
        ? v
        : Math["round"](v);
    }
    function vt(e) {
      var t = n;
      if (((G = e), _["has"](G))) {
        var a = _.get(G);
        if (null == a) {
          switch (G) {
            case "Unifont":
              a = new r("/static/fonts/unifont-15.0.01.hex", Sn);
              break;
            case "Terminus":
              a = new r("/static/fonts/terminus.hex", Sn);
              break;
            default:
              a = new r("/static/fonts/fixed.hex", Sn);
          }
          (a["forceSharpPixels"] = !0), _["set"](G, a);
        }
        a["scale"] = ft();
      }
      var o = G,
        i = $[G];
      "Custom" == G
        ? (D["classList"].remove("hidden"),
          (o = O["value"]),
          (i = Math["max"](Math["min"](20, R["value"]), 1)),
          localStorage["setItem"]("customfont", o),
          localStorage["setItem"]("customfontsize", i),
          (o = '"' + (o || "monospace") + '"'))
        : D.classList["add"]("hidden"),
        (Q = Math["floor"](i * v) + "px " + o + ", monospace, Special"),
        localStorage["setItem"]("font", G),
        (document.getElementById("fontselect")["value"] = G),
        (ge = !0);
    }
    function mt() {
      var e = n;
      return Math["ceil"](0.1 * Math["round"]((Et * v) / 0.1));
    }
    function ht() {
      return mt();
    }
    function yt(e) {
      var t = n;
      E["fillRect"](
        Math["round"](10 * e[0] * v),
        Math.round(20 * e[1] * v),
        mt(),
        ht()
      );
    }
    function gt(e) {
      var t = n;
      e.font = Math["round"](11 * v) + "px " + G + ", monospace";
    }
    function pt(e, t) {
      var r = n,
        a = we["get"](e);
      if (a.empty) (E.fillStyle = a.protected ? A : C), yt(t);
      else {
        var o = a["img"];
        s && (o = a["bmp"]),
          null != o
            ? (E["drawImage"](
                o,
                Math["round"](10 * t[0] * v),
                Math.round(20 * t[1] * v),
                mt(),
                ht()
              ),
              (a["dpr"] == v && a.font == Q) || St(e, !1))
            : ((E.fillStyle = T), yt(t), St(e, !1));
      }
    }
    function bt(e) {
      var t = n;
      return (
        (e = e || 0),
        {
          minx: -qe["offset"].x / v / 10 - e,
          maxx: -qe.offset.x / v / 10 + window.innerWidth / at / 10 + e - 20,
          miny: -qe["offset"].y / v / 20 - e,
          maxy:
            -qe["offset"].y / v / 20 + window["innerHeight"] / at / 20 + e - 10,
        }
      );
    }
    function xt(e, t) {
      var r = n;
      return (
        e[0] < t.minx || e[0] > t["maxx"] || e[1] < t.miny || e[1] > t["maxy"]
      );
    }
    function wt(e) {
      var t = n;
      return we["get"](e)["coords"] || e["split"](",");
    }
    function Mt(e, t, r, a) {
      var o = n;
      if ("" != e) {
        E["fillStyle"] = "rgba(34, 34, 34, 0.4)";
        var i = E["measureText"](e);
        E.beginPath(),
          E.roundRect(
            Math["round"](t - i.width / 2),
            Math["round"](r + 21 * v),
            Math["round"](i["width"] + 10 * v),
            Math["round"](14 * v),
            [a]
          ),
          E["fill"](),
          (E["fillStyle"] = "#FFFFFF"),
          E.fillText(
            e,
            Math.round(t - i["width"] / 2 + 5 * v),
            Math["round"](r + 31 * v)
          );
      }
    }
    function kt(e, t, r, a) {
      var o = n;
      E["fillRect"](
        Math["round"](e),
        Math["round"](t),
        Math["round"](r),
        Math["round"](a)
      );
    }
    !(function () {
      var e = n;
      (E["font"] = "10px Special"),
        E["fillText"]("abc", 0, 10),
        (E["font"] = Q),
        E["fillText"]("abc", 0, 10);
      for (var t = 0; t < Object.keys($)["length"]; t++)
        (E.font = "10px " + Object.keys($)[t]),
          E["fillText"]("abc", 0, 10),
          (E["font"] = "bold 10px " + Object["keys"]($)[t]),
          E.fillText("abc", 0, 10),
          (E.font = "italic 10px " + Object["keys"]($)[t]),
          E["fillText"]("abc", 0, 10),
          (E.font = "italic bold 10px " + Object["keys"]($)[t]),
          E.fillText("abc", 0, 10);
    })();
    const Et = 200;
    function St(e, t) {
      var r = n;
      Ee["has"](e)
        ? 0 == Ee["get"](e) && t && Ee["set"](e, t)
        : (ke["push"](e), Ee["set"](e, t));
    }
    function It(e, t) {
      var r = n;
      Ee["has"](e)
        ? 0 == Ee["get"](e) && t && Ee["set"](e, t)
        : (ke["unshift"](e), Ee["set"](e, t));
    }
    var Ct, At, Tt;
    try {
      Ct = RegExp("p{Extended_Pictographic}", "u");
    } catch (e) {
      Ct = !1;
    }
    try {
      At = RegExp("\t", "gm");
    } catch (e) {
      At = !1;
    }
    try {
      Tt = RegExp("\r", "gm");
    } catch (e) {
      Tt = !1;
    }
    var Bt = RegExp("^[a-zA-Z0-9_-]{1,24}$");
    function Ft(e) {
      return "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math["floor"](26 * e)].codePointAt();
    }
    function Pt(e) {
      return 48 + Math.floor(10 * e);
    }
    function Lt(e) {
      return "AIEOU"[Math["floor"](5 * e)].codePointAt();
    }
    function Asymt(e) {
      return "~!@#$%^&*()_+{}|:<>?`-=[];',./\"\\"[Math["floor"](32 * e)].codePointAt();
    }
    function Ot(e) {
      var t = n;
      return "BCDFGHJKLMNPÞRSTVWXYZQ"[Math["floor"](22 * e)]["codePointAt"]();
    }
    function IPAA(e) {
      return "aäæɐɑɒʌeɘəɚɛɜɝɞiɨɪoøœɔɵɶuʉʊɯyɤɥʏ"[Math["floor"](32 * e)]["codePointAt"]();
    }
    function IPAB(e) {
      return "bɓʙꞵcçɕdðɖɗʣʥʤᶑfgɠɡɢɣʛhħɦɧʜjɟʝklɫɬɭɮʟmɱnŋɲɳɴθpþɸqrɹɺɻɽɾʀʁsʂʃʄtʈʦʧvʋⱱwɰʍxχzʐʑʒǀǂǃʘʔʡʕʢ"[Math["floor"](76 * e)]["codePointAt"]();
    }
    function IPAC(e) {
      return "aäæɐɑɒʌeɘəɚɛɜɝɞiɨɪoøœɔɵɶuʉʊɯyɤɥʏbɓʙꞵcçɕdðɖɗʣʥʤᶑfgɠɡɢɣʛhħɦɧʜjɟʝklɫɬɭɮʟmɱnŋɲɳɴθpþɸqrɹɺɻɽɾʀʁsʂʃʄtʈʦʧvʋⱱwɰʍxχzʐʑʒǀǂǃʘʔʡʕʢ"[Math["floor"](116 * e)]["codePointAt"]();
    }
    function ArrowB(e) {
      return "↕↔⤡⤢"[Math["floor"](4 * e)]["codePointAt"]();
    }
    function ArrowA(e) {
      return "←↑→↓↖↗↘↙"[Math["floor"](8 * e)]["codePointAt"]();
    }
    function ArrowD(e) {
      return "←↑→↓"[Math["floor"](4 * e)]["codePointAt"]();
    }
    function ArrowC(e) {
      return "←↑→↓↔↕↖↗↘↙⤡⤢"[Math["floor"](12 * e)]["codePointAt"]();
    }
    function BinaryA(e) {
      return "01"[Math["floor"](2 * e)]["codePointAt"]();
    }
    function HexA(e) {
      return "0123456789ABCDEF"[Math["floor"](16 * e)]["codePointAt"]();
    }
    function HexB(e) {
      return "0123456789abcdef"[Math["floor"](16 * e)]["codePointAt"]();
    }
    function ToneA(e) {
      return "˥˦˧˨˩"[Math["floor"](5 * e)]["codePointAt"]();
    }
    function SegA(e) {
      return 130032 + Math.floor(10 * e);
    }
    function SegB(e) {
      return 130032 + Math.floor(2 * e);
    }
    function BrailleA(e) {
      return 10240 + Math.floor(256 * e);
    }
    function HexagramA(e) {
      return 19904 + Math.floor(64 * e);
    }
    function FullUniA(e) {
      return Math.floor(65535 * e);
    }
    function LNums(e) {
      return "0123456789QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm"[Math["floor"](62 * e)]["codePointAt"]();
    }
    function LowNums(e) {
      return "0123456789qwertyuiopasdfghjklzxcvbnm"[Math["floor"](36 * e)]["codePointAt"]();
    }
    function UppNums(e) {
      return "0123456789QWERTYUIOPASDFGHJKLZCVBNM"[Math["floor"](35 * e)]["codePointAt"]();
    }
    function Rt(e) {
      const t = Math.random();
      switch (e - 58112) {
        case 0:
          return LNums(t);
        case 1:
          return LowNums(t);
        case 2:
          return UppNums(t);
        case 3:
          return t < 0.5 ? Ft(t) + 32 : Ft(t);
        case 4:
          return Ft(t) + 32;
        case 5:
          return Ft(t);
        case 6:
          return Pt(t);
        case 7:
          return t < 0.5 ? Lt(t) + 32 : Lt(t);
        case 8:
          return Lt(t) + 32;
        case 9:
          return Lt(t);
        case 10:
          return t < 0.5 ? Ot(t) + 32 : Ot(t);
        case 11:
          return Ot(t) + 32;
        case 12:
          return Ot(t);
        case 13:
          return IPAA(t);
        case 14:
          return IPAB(t);
        case 15:
          return IPAC(t);
        case 16:
          return ArrowA(t);
        case 17:
          return ArrowB(t);
        case 18:
          return ArrowC(t);
        case 19:
          return ArrowD(t);
        case 20:
          return BinaryA(t);
        case 21:
          return HexA(t);
        case 22:
          return HexB(t);
        case 23:
          return SegA(t);
        case 24:
          return SegB(t);
        case 25:
          return ToneA(t);
        case 26:
          return BrailleA(t);
        case 27:
          return Asymt(t);
        case 28:
          return HexagramA(t);
      }
      return FullUniA(t);
    }
    function Dt(e) {
      return (e + 2) % 20 < 2;
    }
    function Nt(e) {
      var t = n;
      return Math["round"](14 * e) + "px Courier";
    }
    function jt(e, t, r, a, o) {
      var i = n;
      e["fillText"](t, Math.floor(r), Math["floor"](a + 15 * o));
    }
    function Ut(e, t, r, a, o, i, c) {
      var l = n;
      e["drawChar"](
        r,
        t,
        Math["floor"](a),
        Math["floor"](o + (10 * i - c / 2))
      );
    }
    function Wt(e) {
      var t = n;
      e["font"] = "bold " + e.font;
    }
    function Ht(e) {
      var t = n;
      e["font"] = "italic " + e.font;
    }
    function Kt(e, t) {
      var r = n;
      tt["disablecolour"]["checked"] && (t = 0),
        (e["fillStyle"] = xe && 0 == t ? "#FFFFFF" : se[t]);
    }
    function Xt(e, t) {
      var r = n,
        a = we["get"](e);
      if (null != a && null != a["txt"]) {
        var o = zt(e);
        if (((a["empty"] = o), o)) {
          qt(e);
          var i = wt(e),
            c = i[0] + 20 + "," + i[1];
          if (we["has"](c)) {
            var l = we.get(c);
            null != l["txt"] &&
              (zt(c) ? ((l["empty"] = !0), qt(c)) : t && It(c, !1));
          }
        } else {
          var u = mt(),
            d = ht();
          null == a["img"] &&
            (null != window["OffscreenCanvas"]
              ? (a["img"] = new OffscreenCanvas(u, d))
              : (a["img"] = document["createElement"]("canvas"))),
            (a.img["width"] = u),
            (a.img["height"] = d),
            (function (e, t, n, a, o) {
              var i = r,
                c = we["get"](a);
              (e["imageSmoothingEnabled"] = !1),
                (e.textBaseline = "alphabetic"),
                (e["textAlign"] = "left"),
                (e.fillStyle = c.protected ? A : C),
                e["fillRect"](0, 0, t, n);
              var l,
                u,
                s = {},
                d = !1,
                f = wt(a),
                v = f[0] - 20 + "," + f[1];
              if (we["has"](v)) {
                var m = we.get(v);
                null == m.edge ||
                  (!m.protected && c["protected"]) ||
                  (l = m["edge"]);
              }
              for (
                var h, y = t / Et, g = _["get"](G), p = 16 * ft(), b = 0;
                b < 10;
                b++
              )
                for (var x = -2; x < 20; x++) {
                  var w = (t / 20) * x,
                    M = (n / 10) * b;
                  if (x < 0 && null != l) {
                    var k = x + 20 * b;
                    if (null != l[k]) {
                      var E = l[k];
                      Kt(e, E[2]),
                        null != g && g["charMap"]["has"](E[0]["codePointAt"]())
                          ? ((g["bold"] = E[3]),
                            (g["italic"] = E[4]),
                            Ut(g, e, E[0], w, M, y, p))
                          : ((e["font"] = E[1] ? Nt(y) : Q),
                            E[3] && Wt(e),
                            E[4] && Ht(e),
                            jt(e, E[0], w, M, y));
                    }
                  }
                  if (!(x < 0)) {
                    var S = c["txt"][x + 20 * b],
                      I = Zr(c.clr[x + 20 * b]),
                      T = I[1];
                    if (!Qn(S, T)) {
                      var B = S["codePointAt"](),
                        F = I[0];
                      Kt(e, F), (e["font"] = Q);
                      var P = !1;
                      8 & T && ((P = !0), Wt(e));
                      var L = !1;
                      if (
                        (4 & T && ((L = !0), Ht(e)),
                        (h = B) >= 58112 &&
                          h <= 58161 &&
                          ((B = Rt(B)), (S = String["fromCodePoint"](B))),
                        ((u = B) >= 9472 &&
                          u <= 9632 &&
                          !(u >= 9476 && u <= 9483) &&
                          !(u >= 9548 && u <= 9551)) ||
                          (u >= 117760 && u <= 118527) ||
                          (u >= 129792 && u <= 130031) ||
                         (u >= 9698 && u <= 9701) ||
                          qr(B))
                      )
                        (e["font"] = Math["round"](20 * y) + "px Special"),
                          e["fillText"](
                            S,
                            Math["round"](w),
                            Math["floor"](M + 15 * y)
                          );
                      if (
                        (4 & T && ((L = !0), Ht(e)),
                        (h = B) >= 58112 &&
                          h <= 58161 &&
                          ((B = Rt(B)), (S = String["fromCodePoint"](B))),
                        ((u = B) >= 12320 &&
                          u <= 40959 &&
                          !(u >= 19904 && u <= 19967) &&
                          !(u >= 9548 && u <= 9551)) ||
                          (u >= 43360 && u <= 43391) ||
                          (u >= 44032 && u <= 55291) ||
                          (u >= 65072 && u <= 65103) ||
                          (u >= 9312 && u <= 9471) ||
                          (u >= 10102 && u <= 10131) ||
                          (u >= 11904 && u <= 12287) ||
                          (u >= 127488 && u <= 127743) ||
                          (u >= 63744 && u <= 64255))
                      )
                        (e["font"] = Math["round"](10 * y) + "px MS Gothic"),
                          e["fillText"](
                            S,
                            Math["round"](w),
                            Math["floor"](M + 15 * y)
                          );
                      else {
                        var O = !1;
                        Ct && Ct["test"](S) && ((O = !0), (e["font"] = Nt(y))),
                          null != g && g["charMap"]["has"](B)
                            ? ((g["bold"] = P),
                              (g["italic"] = L),
                              Ut(g, e, S, w, M, y, p))
                            : jt(e, S, w, M, y),
                          x >= 18 &&
                            ((s[x - 20 + 20 * b] = [S, O, F, P, L]), (d = !0));
                      }
                      2 & T &&
                        e["fillRect"](
                          Math["floor"](w - 0.5 * y),
                          Math["round"](M + 17.5 * y),
                          Math["ceil"](11 * y),
                          Math["ceil"](y)
                        ),
                        1 & T &&
                          e.fillRect(
                            Math["floor"](w - 0.5 * y),
                            Math["floor"](M + 9 * y),
                            Math.ceil(11 * y),
                            Math["ceil"](y)
                          );
                    }
                  }
                }
              if (((c["edge"] = d ? s : void 0), o)) {
                var R = f[0] + 20 + "," + f[1];
                we.has(R) && null != we["get"](R)["txt"] && It(R, !1);
              }
            })(a["img"]["getContext"]("2d", { alpha: !1 }), u, d, e, t),
            (a["dpr"] = v),
            (a["font"] = Q),
            s &&
              createImageBitmap(a["img"])["then"](function (t) {
                var n = r;
                if (we["has"](e)) {
                  var a = we["get"](e);
                  null != a.bmp && a["bmp"]["close"](),
                    (a["bmp"] = t),
                    (ge = !0);
                }
              }),
            (a["empty"] = !1);
        }
      }
    }
    function zt(e) {
      for (var t = n, r = we["get"](e), a = !0, o = 0; o < 200; o++)
        if (!Qn(r.txt[o], Zr(r["clr"][o])[1])) {
          a = !1;
          break;
        }
      if ((a && (r["edge"] = void 0), a)) {
        var i = wt(e),
          c = i[0] - 20 + "," + i[1];
        we["has"](c) && null != we["get"](c).edge && (a = !1);
      }
      return a;
    }
    function qt(e) {
      var t = n;
      if (we.has(e)) {
        var r = we["get"](e);
        null != r["img"] && delete r.img;
      }
    }
    var Yt = null;
    function Jt(e, t) {
      var r = n;
      return (
        null != Yt &&
        Yt["minx"] <= e &&
        e < Yt.maxx &&
        Yt["miny"] <= t &&
        t < Yt["maxy"]
      );
    }
    function Vt(e, t) {
      return e[0] === t[0] ? 0 : e[0] < t[0] ? -1 : 1;
    }
    function Zt(e) {
      for (
        var t = n,
          r = innerWidth / innerHeight,
          a = [],
          o = qe["coords"].x,
          i = 2 * qe.coords.y * r,
          c = 0;
        c < e.length;
        c += 2
      ) {
        var l = e[c] + 10,
          u = 2 * (e[c + 1] + 5) * r,
          s = Math["sqrt"](Jr(o - l) + Jr(i - u));
        a["push"]([s, c]);
      }
      return a["sort"](Vt), a;
    }
    var $t,
      Gt = !1;
    function Qt() {
      var e = n;
      if (!Gt) {
        for (
          var t = -120 - 20 * Math["floor"](qe["offset"].x / (200 * v)),
            r = -60 - 10 * Math["floor"](qe["offset"].y / (200 * v)),
            o = r,
            i = Math.floor(
              window.innerWidth / (10 * at) - qe["offset"].x / (10 * v) + 120
            ),
            c = Math.floor(
              window["innerHeight"] / (20 * at) - qe["offset"].y / (20 * v) + 60
            ),
            l = [];
          t < i;

        ) {
          for (; r < c; ) {
            var u = t + "," + r;
            !we["has"](u) && Jt(t, r) && l["push"](t, r), (r += 10);
          }
          (r = o), (t += 20);
        }
        if (0 != l["length"]) {
          var s = Zt(l);
          $t = [];
          for (var d = 0, f = 0; f < s["length"]; f++) {
            var m = s[f][1],
              h = l[m],
              y = l[m + 1];
            if (
              ((u = h + "," + y),
              $t["push"](h / 20, y / 10),
              we["set"](u, {}),
              100 == ++d)
            )
              break;
          }
          d > 0 && (a["send"](Or({ r: $t })), (Gt = !0), (ge = !0));
        }
      }
    }
    function _t() {
      var e,
        t = n,
        r = bt(250);
      for (const n of we["keys"]()) {
        var a = wt(n);
        !xt(a, r) ||
          ((e = a)[0] > Ce.x - 20 &&
            e[0] < Ce.x + 20 &&
            e[1] > Ce.y - 10 &&
            e[1] < Ce.y + 10) ||
          we.delete(n);
      }
    }
    function en() {
      var e = n;
      "ontouchstart" in window || i["focus"]();
    }
    var tn = !1;
    function nn(e) {
      var t = n;
      if (e.isTrusted) {
        var r = 20 * Math["floor"](Ce.x / 20),
          o = 10 * Math["floor"](Ce.y / 10),
          c = r + "," + o;
        we["has"](c) &&
          (Ve && a["send"](Or({ p: c })),
          Ze && (tn ? (tn = !1) : a["send"](Or({ c: [r, o, r + 19, o + 9] }))),
          i["focus"]());
      }
    }
    function rn(e) {
      var t = n;
      return e.target["parentElement"]["parentElement"].dataset.id;
    }
    function an(e) {
      m && a["send"](Or({ i: rn(e) }));
    }
    function on(e) {
      var t = n;
      m && a["send"](Or({ a: [rn(e), e["target"]["checked"]] }));
    }
    function cn(e) {
      m && a["send"](Or({ aa: rn(e) }));
    }
    function ln(e) {
      var t = n,
        r = rn(e),
        a = Pe["get"](r);
      null != a &&
        m &&
        ((a["highlighted"] = e["target"]["checked"]), (ge = !0));
    }
    function un(e) {
      var t = n,
        r = e["target"]["parentElement"]["dataset"].id,
        a = Pe.get(r);
      null != a &&
        m &&
        ir((a.n || r) + ": (" + a.l[0] + ", " + -a.l[1] + ")", 3e3);
    }
    function sn(e) {
      var t = n,
        r = e["target"].parentElement["dataset"].id,
        a = Pe["get"](r);
      null != a && m && Zn(a.l[0], a.l[1]);
    }
    function dn(e) {
      var t = n,
        r = document["createElement"]("tr"),
        a = document["createElement"]("td"),
        o = document["createElement"]("td"),
        i = document["createElement"]("td"),
        c = document.createElement("input"),
        l = document.createElement("input"),
        u = document.createElement("button"),
        s = document["createElement"]("button");
      (l["type"] = "checkbox"),
        (l["checked"] = !1),
        (u["innerText"] = "2"),
        (s.innerText = "3"),
        l["addEventListener"]("click", on),
        u["addEventListener"]("click", cn),
        s["addEventListener"]("click", an),
        c.addEventListener("click", ln);
      var d = Pe["get"](e);
      (c["type"] = "checkbox"),
        (c["checked"] = 1 == d["highlighted"]),
        a.appendChild(c);
      var f = d.c;
      (o["style"].backgroundColor = "#FFFFFF" == se[f] ? "#222222" : se[f]),
        (o.style["fontSize"] = "10px"),
        (o["style"].userSelect = "all"),
        (o["innerText"] = d.n || e),
        o.addEventListener("click", un),
        o["addEventListener"]("dblclick", sn),
        i.appendChild(l),
        i["appendChild"](u),
        i["appendChild"](s),
        (r["dataset"].id = e),
        r["appendChild"](a),
        r["appendChild"](o),
        r["appendChild"](i),
        document["getElementById"]("admintable")["appendChild"](r);
    }
    function fn(e) {
      e["preventDefault"]();
    }
    function vn(e) {
      for (
        var t = n,
          r = [
            "loginbtn",
            "registerbtn",
            "loginname",
            "loginpass",
            "username",
            "password",
            "password2",
            "registerbtn",
            "chngusername",
            "chngeusrpass",
            "submitnamechange",
            "oldpass",
            "newpass",
            "newpass2",
            "submitpasschange",
            "deletepassword",
            "deleteaccount",
          ],
          a = 0;
        a < r["length"];
        a++
      )
        document.getElementById(r[a]).disabled = e;
      if (!e) {
        var o = [
          "loginname",
          "loginpass",
          "username",
          "password",
          "password2",
          "chngusername",
          "chngeusrpass",
          "oldpass",
          "newpass",
          "newpass2",
          "deletepassword",
        ];
        for (a = 0; a < o["length"]; a++)
          document["getElementById"](o[a])["value"] = "";
      }
    }
    k["addEventListener"]("pointerdown", function (e) {
      var t = n;

      e["isTrusted"] &&
        (ie(!1),
        (null != Dn && 1 != e.pointerId) ||
          Nn ||
          ((Dn = e["pointerId"]),
          (Te = Wn(e)),
          Je
            ? (($e["start"] = Te), ($e["end"] = $e.start))
            : ((Ye = !0),
              (qe["start"].x = e["clientX"] * v),
              (qe["start"].y = e["clientY"] * v),
              (Ge = []),
              (Qe = null),
              Rn(e),
              (k.style["cursor"] = "move"),
              (function (e) {
                var n = t;
                if (e["pointerId"] == Dn) {
                  nr();
                  var r = Wn(e);
                  if (
                    ((Ce.x == r.x && Ce.y == r.y) || (Le = !0),
                    (Ce.x = r.x),
                    (Ce.y = r.y),
                    (Ce.start = Ce.x),
                    e["altKey"])
                  ) {
                    var a = rr();
                    a && (Qn(a[0], Zr(a[1])[1]) ? mr(0) : mr(Zr(a[1])[0]));
                  }
                  Hn();
                }
              })(e)),
          (ge = !0)));
    }),
      k["addEventListener"]("contextmenu", function (e) {
        e["preventDefault"](), ie(!0);
      }),
      document.addEventListener("pointermove", function (e) {
        var t = n;
        if (
          e["isTrusted"] &&
          ((Te = Wn(e)), (Ve || Ze) && (ge = !0), e["pointerId"] == Dn && !Nn)
        ) {
          if ((e["preventDefault"](), Je)) $e["end"] = Te;
          else if (Ye) {
            var r = e.clientX * devicePixelRatio - qe.start.x / at,
              a = e["clientY"] * devicePixelRatio - qe["start"].y / at;
            (qe["offset"].x = Math["round"](ze["offset"].x + r)),
              (qe["offset"].y = Math["round"](ze["offset"].y + a)),
              tt["smoothpanning"]["checked"] && Rn(e);
          }
          ge = !0;
        }
      }),
      k["addEventListener"]("click", nn),
      k.addEventListener(
        "wheel",
        function (e) {
          var t = n;
          if (e["isTrusted"] && (ie(!1), !Ye)) {
            if ((e["preventDefault"](), e["ctrlKey"]))
              it(rt - e["deltaY"] / 1e3, !0);
            else if (e["altKey"])
              1 == Math.sign(e["deltaY"])
                ? mr(
                    client.color == fe[se["length"] - 1]
                      ? fe[0]
                      : fe[ve(client.color) + 1]
                  )
                : mr(
                    client.color == fe[0]
                      ? fe[se["length"] - 1]
                      : fe[ve(client.color) - 1]
                  );
            else {
              var r = e.deltaX,
                a = e["deltaY"];
              e.shiftKey && ((r ^= a), (r ^= a ^= r)),
                Mn(qe["offset"].x - r, qe.offset.y - a);
            }
            ge = !0;
          }
        },
        { passive: !1 }
      ),
      document["addEventListener"]("pointerup", function (e) {
        var t = n;
        if (
          e["isTrusted"] &&
          (e["preventDefault"](), e["pointerId"] == Dn && !Nn)
        ) {
          if (Je && $e["start"] && $e["end"]) {
            var r = Math.min($e.start.x, $e["end"].x),
              o = Math["min"]($e.start.y, $e["end"].y),
              i = Math["max"]($e.start.x, $e["end"].x),
              c = Math["max"]($e.start.y, $e["end"].y);
            if (((Je = !1), ($e = {}), m && Ze))
              (tn = !0), a["send"](Or({ c: [r, o, i, c] }));
            else {
              var l = Ce.x,
                u = Ce.y;
              (Ce.x = r), (Ce.y = o);
              for (var s = "", d = "", f = !1, v = !1, h = o; h <= c; h++) {
                for (var y = r; y <= i; y++) {
                  var g = rr();
                  if (g) {
                    g[0] == Z ? (s += " ") : (s += g[0]);
                    var [p, b] = Zr(g[1]);
                    tt["copycolour"]["checked"] &&
                    tt["copydecorations"]["checked"]
                      ? (d += String["fromCharCode"](ue + g[1]))
                      : tt.copycolour["checked"]
                      ? (d += String["fromCharCode"](ue + p))
                      : tt["copydecorations"].checked &&
                        (d += String["fromCharCode"](ue + Vr(0, b))),
                      Qn(g[0], b) || (0 != b && (v = !0), 0 != p && (f = !0)),
                      Ce.x++;
                  }
                }
                (Ce.x = r), Ce.y++, (s += "\n"), (d += "�");
              }
              (s = s["slice"](0, -1)),
                (d = d["slice"](0, -1)),
                s["startsWith"]("http") && (f = v = !1),
                (tt["copycolour"]["checked"] && f) ||
                (tt["copydecorations"]["checked"] && v)
                  ? ar(s + Z + d)
                  : ar(s),
                (Ce.x = l),
                (Ce.y = u),
                ir("Copied selection.", 1500);
              var x = document["getElementById"]("copyico");
              (x.src = "/static/done.svg"),
                setTimeout(function () {
                  var e = t;
                  x["src"] = "/static/copy.svg";
                }, 1e3);
            }
          } else if (
            ((Dn = void 0),
            (Ye = !1),
            (qe["start"].x = null),
            (qe["start"].y = null),
            Mn(qe["offset"].x, qe.offset.y),
            tt.smoothpanning["checked"])
          ) {
            Rn(e);
            var w = Ge["length"] - 1;
            ((Qe = {
              dx: Ge[0][0] - Ge[w][0],
              dy: Ge[0][1] - Ge[w][1],
              dt: Ge[0][2] - Ge[w][2],
            }).dt > 90 ||
              (Math.abs(Qe.dx) < 5 && Math["abs"](Qe.dy) < 5)) &&
              (Qe = null);
          }
          (k["style"]["cursor"] = "text"), (ge = !0);
        }
      }),
      document["addEventListener"]("pointerleave", Un),
      document["addEventListener"]("pointercancel", Un),
      i["addEventListener"]("input", function (e) {
        var t = n;
        if ((e.preventDefault(), e["isTrusted"])) {
          if ("insertLineBreak" != e["inputType"])
            return "deleteContentBackward" == e["inputType"]
              ? ((Ce.x -= 1), Vn(" ", 0, !1, !0) || (Ce.x += 1), void nr())
              : void (
                  null != e["data"] &&
                  "" != e["data"] &&
                  "insertFromPaste" != e["inputType"] &&
                  (nr(),
                  Array["from"](e.data).length > 1
                    ? tr(e["data"])
                    : Vn(e["data"], 1))
                );
          cr();
        }
      }),
      i["addEventListener"]("keydown", function (e) {
        var t = n;
        if (e["isTrusted"]) {
          switch (e["keyCode"]) {
            case 38:
              (Ce.y -= 1), nr(), ie(!1), e["preventDefault"]();
              break;
            case 40:
              (Ce.y += 1), nr(), ie(!1), e["preventDefault"]();
              break;
            case 37:
              (Ce.x -= 1), nr(), ie(!1), e.preventDefault();
              break;
            case 39:
              (Ce.x += 1), nr(), ie(!1), e["preventDefault"]();
              break;
            case 9:
              (Ce.x += 3), nr(), ie(!1), e.preventDefault();
              break;
            case 36:
              (Ce.x = Ce["start"]), nr(), ie(!1), e["preventDefault"]();
              break;
            case 46:
              Vn(" ", 0, !1, !0), nr(), e["preventDefault"]();
          }
          ((!e["ctrlKey"] && !e["shiftKey"] && !e["altKey"]) ||
            37 == e["keyCode"] ||
            38 == e["keyCode"] ||
            39 == e["keyCode"] ||
            40 == e["keyCode"]) &&
            Hn();
        }
      }),
      document["addEventListener"]("keydown", function (e) {
        var r = n;
        if (e.isTrusted)
          switch (e.keyCode) {
            case 90:
              e.ctrlKey &&
                ((function () {
                  var e = t;
                  if (0 != Be["length"]) {
                    var n = Be["shift"]();
                    (Ce.x = n[0]), (Ce.y = n[1]);
                    var r = client.color,
                      a = ce(),
                      o = Zr(n[3]);
                    (client.color = o[0]),
                      le(o[1]),
                      Vn(n[2], 0, !0) || Be.unshift(n),
                      (client.color = r),
                      le(a);
                  }
                })(),
                e["preventDefault"]());
              break;
            case 89:
              e["ctrlKey"] &&
                ((function () {
                  var e = r;
                  if (0 != Fe["length"]) {
                    var t = Fe["shift"]();
                    (Ce.x = t[0]), (Ce.y = t[1]);
                    var n = client.color,
                      a = ce(),
                      o = Zr(t[3]);
                    (client.color = o[0]),
                      le(o[1]),
                      Vn(t[2], 1, !1) || Fe["unshift"](t),
                      (client.color = n),
                      le(a);
                  }
                })(),
                e["preventDefault"]());
              break;
            case 67:
              e["altKey"] && or(e);
              break;
            case 71:
              e["ctrlKey"] && (e["preventDefault"](), dr());
              break;
            case 66:
              e.ctrlKey && (e["preventDefault"](), br("bold"), ie(!0));
              break;
            case 50:
              e.ctrlKey && (e["preventDefault"](), br("overline"), ie(!0));
              break;
            case 73:
              e.ctrlKey &&
                !e.shiftKey(e.preventDefault(), br("italic"), ie(!0));
              break;
            case 85:
              e.ctrlKey && (e["preventDefault"](), br("underline"), ie(!0));
              break;
            case 83:
              e["ctrlKey"] &&
                (e["preventDefault"](), br("strikethrough"), ie(!0));
              break;
            case 18:
              e["preventDefault"]();
              break;
            case 27:
              Je &&
                ((Je = !1),
                ($e = {}),
                (k.style["cursor"] = "text"),
                e["preventDefault"]()),
                M["classList"]["remove"]("open"),
                ie(!1),
                nr();
              break;
            case 107:
            case 187:
              e["ctrlKey"] && (e["preventDefault"](), it(rt + 0.1, !0));
              break;
            case 109:
            case 189:
              e["ctrlKey"] && (e.preventDefault(), it(rt - 0.1, !0));
          }
      }),
      i.addEventListener("paste", function (e) {
        var t = n;
        e["isTrusted"] &&
          tr((e["clipboardData"] || window["clipboardData"]).getData("text"));
      }),
      i["addEventListener"]("copy", function (e) {
        var t = n,
          r = rr();
        if (r) {
          ar(r[0]),
            e["preventDefault"](),
            e["clipboardData"] || ir("Copied character.", 1e3);
          var a = document["getElementById"]("copyico");
          (a["src"] = "/static/done.svg"),
            setTimeout(function () {
              var e = t;
              a["src"] = "/static/copy.svg";
            }, 1e3),
            i["focus"]();
        }
      }),
      Ke["addEventListener"]("click", function () {
        ir(We + " online", 3e3);
      }),
      He.addEventListener("click", function () {
        var e = n;
        history["pushState"]({}, null, o),
          ar(
            location.protocol +
              "//" +
              location["host"] +
              o +
              "?x=" +
              Ce.x +
              "&y=" +
              -Ce.y
          ),
          ir("Copied link to current coordinates.", 1e3),
          i["focus"]();
      }),
      document["getElementById"]("closemenu")["addEventListener"](
        "click",
        function () {
          ur(0);
        }
      ),
      document["getElementById"]("openmenu").addEventListener(
        "click",
        function () {
          ur(1);
        }
      ),
      document
        .getElementById("options")
        ["addEventListener"]("click", function () {
          ur(2);
        }),
      document["getElementById"]("home")["addEventListener"](
        "click",
        function () {
          $n(), Zn(0, 0);
        }
      ),
      document["getElementById"]("home")["addEventListener"](
        "contextmenu",
        function (e) {
          var t = n;
          e["preventDefault"](), Cn("textwall", "main") && Zn(0, 0);
        }
      ),
      document["getElementById"]("copy")["addEventListener"]("click", or),
      document["getElementById"]("paste")["addEventListener"](
        "click",
        function () {
          var e = n;
          navigator["clipboard"]["readText"]()["then"](function (t) {
            var n = e;
            tr(t);
            var r = document["getElementById"]("pasteico");
            (r.src = "/static/done.svg"),
              setTimeout(function () {
                r["src"] = "/static/paste.svg";
              }, 1e3),
              en();
          });
        }
      ),
      document.getElementById("theme").addEventListener("click", function () {
        yr();
      }),
      B["addEventListener"]("input", gr),
      F["addEventListener"]("input", gr),
      P["addEventListener"]("change", function (e) {
        gr(e), yr(2);
      }),
      O.addEventListener("input", function () {
        vt(G);
      }),
      R["addEventListener"]("input", function () {
        vt(G);
      }),
      document["getElementById"]("goto")["addEventListener"]("click", dr),
      x["addEventListener"]("click", function (e) {
        var t = n,
          r = JSON["stringify"](e["target"]["checked"]);
        switch (e.target) {
          case tt["showothercurs"]:
            localStorage["setItem"]("showothercurs", r), (ge = !0);
            break;
          case tt["shownametags"]:
            localStorage.setItem("shownametags", r), (ge = !0);
            break;
          case tt["showchat"]:
            localStorage["setItem"]("showchat", r),
              e["target"]["checked"]
                ? hn["classList"]["remove"]("hidden")
                : hn.classList["add"]("hidden");
            break;
          case tt.disablecolour:
            localStorage.setItem("disablecolour", r),
              nt.disableColour["checked"] || hr(tt["disablecolour"].checked),
              (ge = !0),
              Sn();
            break;
          case tt["smoothpanning"]:
            localStorage["setItem"]("smoothpanning", r), (ge = !0);
            break;
          case tt["smoothcursors"]:
            localStorage["setItem"]("smoothcursors", r);
            break;
          case tt["copycolour"]:
            localStorage["setItem"]("copycolour", r);
            break;
          case tt["copydecorations"]:
            localStorage["setItem"]("copydecorations", r);
            break;
          case tt["rainbow"]:
            localStorage["setItem"]("rainbow", r);
            break;
          case tt.anonymous:
            localStorage["setItem"]("anonymous", r), (Re = !0), (ge = !0);
            break;
          case lt:
            (document["getElementById"]("login")["style"]["display"] = "none"),
              (document["getElementById"]("logintext")["style"]["display"] =
                "none"),
              (document["getElementById"]("loginwithdiscord")["style"][
                "display"
              ] = "none"),
              (document["getElementById"]("login")["style"]["display"] =
                "none"),
              (document["getElementById"]("register").style.display = "block");
            break;
          case ut:
            (document["getElementById"]("login")["style"].display = "block"),
              (document["getElementById"]("logintext")["style"]["display"] =
                "block"),
              (document["getElementById"]("loginwithdiscord")["style"][
                "display"
              ] = "inline"),
              (document["getElementById"]("login")["style"]["display"] =
                "block"),
              (document["getElementById"]("register")["style"]["display"] =
                "none");
            break;
          case st:
            dt(!0);
        }
      }),
      document["getElementById"]("closeteleport").addEventListener(
        "click",
        function () {
          var e = n;
          M.classList["remove"]("open");
        }
      ),
      document["getElementById"]("closeshortcut").addEventListener(
        "click",
        function () {
          document.getElementById("shortcuts").classList["remove"]("open");
        }
      ),
      document
        .getElementById("tpwordgo")
        ["addEventListener"]("click", function (e) {
          var t = n;
          e["preventDefault"]();
          var r = document["getElementById"]("tpword");
          vr(r["value"]), r.blur();
        }),
      document["getElementById"]("tpword")["addEventListener"](
        "input",
        function () {
          var e = n,
            t = document["getElementById"]("tpword").value["replace"](
              /^\/|\/$/g,
              ""
            ),
            r = 0 == t || t["startsWith"]("~") ? { x: 0, y: 0 } : Lr(t);
          (document["getElementById"]("tpx")["value"] = r.x),
            (document["getElementById"]("tpy")["value"] = -r.y);
        }
      ),
      document["getElementById"]("tpcoordgo").addEventListener(
        "click",
        function (e) {
          var t = n;
          e["preventDefault"]();
          var r = document["getElementById"]("tpx"),
            a = document["getElementById"]("tpy"),
            i = parseInt(r["value"], 10),
            c = parseInt(a.value, 10);
          (isNaN(i) && isNaN(c)) ||
            (0 !== i && (i = i || Ce.x),
            0 !== c && (c = c || Ce.y),
            Zn(
              (i = Math["max"](Math["min"](i, Yt.maxx - 1), Yt["minx"])),
              (c = Math["max"](Math["min"](-c, Yt["maxy"] - 1), Yt["miny"]))
            ),
            history["pushState"]({}, null, o),
            M["classList"]["remove"]("open"),
            r["blur"](),
            a["blur"]());
        }
      ),
      window["addEventListener"]("resize", kn),
      window["addEventListener"]("orientationchange", kn),
      window["addEventListener"]("popstate", function () {
        vr(Pr());
      }),
      window.addEventListener("focus", function () {
        (y = !0), En(), Kr();
      }),
      window.addEventListener("blur", function () {
        (y = !1), En();
      }),
      ot["addEventListener"]("input", ct),
      ot.addEventListener("change", ct),
      Se["addEventListener"]("message", function (e) {
        var t = n;
        a && a["readyState"] == a.OPEN && a["send"](e["data"]);
      }),
      document["getElementById"]("chatbutton")["addEventListener"](
        "click",
        function () {
          var e = n;
          hn["classList"]["contains"]("open")
            ? hn["classList"].remove("open")
            : (hn["classList"]["add"]("open"),
              yn["classList"]["remove"]("show"),
              gn());
        }
      ),
      document["getElementById"]("sendmsg")["addEventListener"]("click", bn),
      document["getElementById"]("chatmsg")["addEventListener"](
        "keyup",
        function (e) {
          13 == e["keyCode"] && bn(e);
        }
      ),
      document["getElementById"]("loginbtn")["addEventListener"](
        "click",
        function (e) {
          var t = n;
          if (e.isTrusted) {
            var r = document["getElementById"]("loginname"),
              o = document["getElementById"]("loginpass");
            mn.test(r["value"])
              ? 0 != r.value.length
                ? 0 != o.value["length"]
                  ? (vn(!0), a.send(Or({ login: [r["value"], o["value"]] })))
                  : ir("Please type your password.", 3e3)
                : ir("Please type your username.", 3e3)
              : ir("Username is invalid.", 3e3);
          }
        }
      ),
      document
        .getElementById("registerbtn")
        ["addEventListener"]("click", function (e) {
          var t = n;
          if (e.isTrusted) {
            var r = document.getElementById("username"),
              o = document["getElementById"]("password"),
              i = document["getElementById"]("password2");
            mn["test"](r["value"])
              ? 0 != r.value.length
                ? 0 != o["value"]["length"]
                  ? o.value == i["value"]
                    ? (vn(!0),
                      a["send"](Or({ register: [r["value"], o.value] })))
                    : ir("Passwords do not match.", 3e3)
                  : ir("Please type a password.", 3e3)
                : ir("Please type a username.", 3e3)
              : ir("Username is invalid.", 3e3);
          }
        }),
      document.getElementById("login")["addEventListener"]("submit", fn),
      document["getElementById"]("register")["addEventListener"]("submit", fn),
      document
        .getElementById("accsettinglink")
        ["addEventListener"]("click", function () {
          var e = n,
            t = document["getElementById"]("accountsettings");
          (t["style"]["display"] =
            "block" == t["style"]["display"] ? "none" : "block"),
            (document.getElementById("optionsmenu")["scrollTop"] =
              t["clientHeight"] - 60);
        }),
      document["getElementById"]("changenameform")["addEventListener"](
        "submit",
        fn
      ),
      document["getElementById"]("submitnamechange").addEventListener(
        "click",
        function (e) {
          var t = n;
          if (e["isTrusted"]) {
            var r = document["getElementById"]("chngusername"),
              o = document["getElementById"]("chngeusrpass");
            mn["test"](r.value)
              ? 0 != r["value"]["length"]
                ? je != r.value
                  ? 0 != o["value"].length
                    ? (vn(!0),
                      a["send"](Or({ namechange: [r.value, o.value] })))
                    : ir("Please type your password.", 3e3)
                  : ir("You have typed in your current username.", 3e3)
                : ir("Please type a new username.", 3e3)
              : ir("Username is invalid.", 3e3);
          }
        }
      ),
      document["getElementById"]("changepassform").addEventListener(
        "submit",
        fn
      ),
      document["getElementById"]("submitpasschange")["addEventListener"](
        "click",
        function (e) {
          var t = n;
          if (e.isTrusted) {
            var r = document["getElementById"]("oldpass"),
              o = document["getElementById"]("newpass"),
              i = document["getElementById"]("newpass2");
            0 != r["value"]["length"]
              ? 0 != o["value"].length
                ? 0 != i["value"].length
                  ? o.value == i["value"]
                    ? (vn(!0),
                      a["send"](Or({ passchange: [r["value"], o["value"]] })))
                    : ir("New passwords are not the same.", 3e3)
                  : ir("Please type your new password again.", 3e3)
                : ir("Please type your new password.", 3e3)
              : ir("Please type your password.", 3e3);
          }
        }
      ),
      document["getElementById"]("delaccountform")["addEventListener"](
        "submit",
        fn
      ),
      document["getElementById"]("deleteaccount")["addEventListener"](
        "click",
        function (e) {
          var t = n;
          if (e.isTrusted) {
            var r = document["getElementById"]("deletepassword");
            0 != r.value["length"]
              ? (vn(!0), a.send(Or({ deleteaccount: r["value"] })))
              : ir("Please type your password.", 3e3);
          }
        }
      ),
      nt["protect"]["addEventListener"]("click", function (e) {
        (Ve = e["target"].checked), (ge = !0);
      }),
      nt["clear"]["addEventListener"]("click", function (e) {
        var t = n;
        (Ze = e.target["checked"]), (ge = !0);
      }),
      nt["readOnly"]["addEventListener"]("click", function (e) {
        var t = n;
        a.send(Or({ ro: e["target"]["checked"] }));
      }),
      nt.private["addEventListener"]("click", function (e) {
        var t = n;
        a["send"](Or({ priv: e["target"]["checked"] }));
      }),
      nt["hideCursors"].addEventListener("click", function (e) {
        var t = n;
        a["send"](Or({ ch: e.target["checked"] }));
      }),
      nt.disableChat["addEventListener"]("click", function (e) {
        var t = n;
        a.send(Or({ dc: e["target"]["checked"] }));
      }),
      nt["disableColour"]["addEventListener"]("click", function (e) {
        var t = n;
        a["send"](Or({ dcl: e["target"].checked }));
      }),
      nt["disableBraille"]["addEventListener"]("click", function (e) {
        var t = n;
        a["send"](Or({ db: e["target"]["checked"] }));
      }),
      document["getElementById"]("addmemberbtn")["addEventListener"](
        "click",
        function (e) {
          var t = n;
          e["preventDefault"](), document["getElementById"]("optionsmenu");
          var r = document["getElementById"]("inputmember"),
            o = document["getElementById"]("memberlist"),
            i = r.value.toLowerCase();
          (r["value"] = ""),
            (i.length =
              (function (e) {
                for (
                  var n = t,
                    r = document["getElementById"]("memberlist"),
                    a = 0;
                  a < r["childElementCount"];
                  a++
                )
                  if (r.children[a]["innerText"] == e) return !0;
                return !1;
              })(i) || i == je) ||
              (mn["test"](i)
                ? o.childElementCount >= 20
                  ? ir("You cannot add more than 20 members.", 3e3)
                  : a["send"](Or({ addmem: i }))
                : ir("Username is invalid.", 3e3));
        }
      ),
      J["addEventListener"]("click", function (e) {
        var t = n,
          r = document["getElementById"]("deletewallconfirm");
        if (null == r) {
          var o = document["createElement"]("br");
          return (
            e["target"]["parentNode"].insertBefore(o, e.target["nextSibling"]),
            ((r = document["createElement"]("input")).type = "text"),
            (r["placeholder"] = "type 'confirm' here"),
            (r["maxLength"] = 7),
            (r.id = "deletewallconfirm"),
            o.parentNode["insertBefore"](r, o["nextSibling"]),
            void r.focus()
          );
        }
        "confirm" == r["value"]
          ? (r.parentElement["removeChild"](r.previousSibling),
            r.parentNode["removeChild"](r),
            a["send"](Or({ dw: 0 })),
            Cn("textwall", "main"),
            ir("Deleting wall...", 3e3))
          : ir(
              "Please type 'confirm' in the text box if you would like to delete your wall.",
              3e3
            );
      }),
      document["getElementById"]("l")["addEventListener"](
        "click",
        function (e) {
          var t = n;
          m && a["send"](Or({ l: e["target"]["checked"] }));
        }
      ),
      document["getElementById"]("refresh").addEventListener(
        "click",
        function () {
          var e = n;
          if (m) {
            document["getElementById"]("admintable")["innerHTML"] = "";
            var t = !1;
            for (const n of Pe["keys"]()) dn(n), (t = !0);
            if (t) {
              var r = document.getElementById("optionsmenu");
              r["scrollTop"] = r["scrollHeight"];
            }
          }
        }
      ),
      document["getElementById"]("sendalert")["addEventListener"](
        "click",
        function () {
          var e = n,
            t = document["getElementById"]("alerttext")["value"];
          m && 0 != t["length"] && a.send(Or({ alert: t }));
        }
      ),
      document["getElementById"]("reload")["addEventListener"](
        "click",
        function () {
          m && a["send"](Or({ reload: !0 }));
        }
      ),
      document["getElementById"]("delete").addEventListener(
        "click",
        function () {
          var e = n;
          if (m) {
            var t = document["getElementById"]("deletename").value;
            0 != t["length"] && a["send"](Or({ aaa: t }));
          }
        }
      ),
      document.getElementById("free")["addEventListener"]("click", function () {
        var e = n;
        if (m) {
          var t = document["getElementById"]("freename")["value"];
          0 != t["length"] && a["send"](Or({ aaaa: t }));
        }
      }),
      b["setAttribute"]("id", "textarea"),
      i.setAttribute("id", "clipboard");
    var mn = /^[\w.-]+$/;
    const hn = document["getElementById"]("chat"),
      yn = document["getElementById"]("unread");
    function gn() {
      var e = n,
        t = document["getElementById"]("chatbox");
      t.scrollTop = t["scrollHeight"];
    }
    function pn() {
      var e = n,
        t = document["getElementById"]("chatbox");
      null != t["lastElementChild"] &&
        "HR" != t["lastElementChild"]["tagName"] &&
        (t.appendChild(document["createElement"]("hr")), gn());
    }
    function bn(e) {
      var t = n;
      if (e["isTrusted"]) {
        var r = document["getElementById"]("chatmsg");
        gn(),
          Xe + 300 > performance["now"]()
            ? (r["value"] = "")
            : client.chat.send(r["value"]["substr"](0, 400)),
          (Xe = performance["now"]()),
          (r.value = ""),
          r.focus();
      }
    }
    function xn() {
      var e = n,
        t = document["getElementsByClassName"]("msgcontainer")[0];
      (nt["readOnly"].checked && 0 == j) || (U && !client.registered)
        ? t["classList"].add("hidden")
        : t["classList"]["remove"]("hidden");
    }
    function wn(e) {
      var t = n;
      e["preventDefault"](),
        Cn(e.target["innerText"]["toLowerCase"](), "main") && Zn(0, 0);
    }
    function Mn(e, t, r) {
      var a = n;
      r
        ? ((qe["offset"].x = e), (qe["offset"].y = t))
        : ((qe["offset"].x = Math["ceil"](e)), (qe["offset"].y = Math.ceil(t))),
        (ze["offset"].x = qe.offset.x),
        (ze["offset"].y = qe["offset"].y);
      var o = qe["coords"].x,
        i = qe.coords.y;
      (qe["coords"].x = Math["floor"](
        window.innerWidth / at / 20 - qe["offset"].x / 10 / v
      )),
        (qe["coords"].y = Math["floor"](
          window["innerHeight"] / at / 40 - qe.offset.y / 20 / v
        )),
        (De = o != qe.coords.x || i != qe["coords"].y);
    }
    function kn() {
      var e = n,
        t = v;
      if (
        ((v = devicePixelRatio * at),
        (k["width"] = Math["round"](window.innerWidth * devicePixelRatio)),
        (k.height = Math.round(window["innerHeight"] * devicePixelRatio)),
        (k.style["width"] = Math["round"](k.width / devicePixelRatio) + "px"),
        (k["style"]["height"] =
          Math.round(k["height"] / devicePixelRatio) + "px"),
        (E["imageSmoothingEnabled"] = !1),
        (ge = !0),
        t != v)
      ) {
        ie(!1);
        var r = Math["floor"]((qe["offset"].x - k.width / 2) / t),
          a = Math["floor"]((qe.offset.y - k["height"] / 2) / t);
        Mn(
          (r + window["innerWidth"] / at / 2) * v,
          (a + window.innerHeight / at / 2) * v
        ),
          vt(G);
      }
    }
    function En() {
      var e = n,
        t = h;
      "textwall" != W && ((t = "@" + W), "main" != H && (t += "/" + H)),
        null == a || a["readyState"] == a.CLOSED
          ? (document["title"] = h + " (disconnected)")
          : (document["title"] = y
              ? "textwall" != W
                ? t
                : h
              : t + " (" + Ue + " " + (Ue == 1 ? "person" : "people") + ")");
    }
    function Sn(e) {
      var t = n;
      (ke = []), Ee.clear();
      var r = [];
      for (const e of we.keys()) {
        var a = wt(e);
        r["push"](a[0], a[1]);
      }
      for (var o = Zt(r), i = 0; i < o["length"]; i++) {
        var c = o[i][1],
          l = r[c] + "," + r[c + 1],
          u = we["get"](l);
        e ? u.protected && St(l, !1) : u["empty"] || St(l, !1);
      }
    }
    function In() {
      var e = n;
      (document["getElementById"]("connecting1")["innerText"] = "Connected!"),
        (document["getElementById"]("connecting2")["innerText"] =
          "Joining wall..."),
        (document["getElementById"]("admin")["style"]["display"] = "none"),
        null != localStorage["getItem"]("username") &&
          null != localStorage["getItem"]("token") &&
          (vn(!0),
          (document.getElementById("connecting2").innerText = "Logging in..."),
          a["send"](
            Or({
              token: [
                localStorage["getItem"]("username"),
                localStorage["getItem"]("token"),
              ],
            })
          ));
      client.serverClosed = false;
      var t = "textwall",
        r = "main",
        o = location["pathname"]["split"]("/")["splice"](1, 2);
      o[0]["startsWith"]("@") &&
        "" == (t = o[0]["replace"]("@", "")) &&
        (t = "textwall"),
        o[1] && (r = o[1]),
        Cn(t, r);
    }
    function Cn(e, t) {
      var r = n;
      return !(
        (W == e && H == t) ||
        K ||
        ((K = !0),
        (e = e),
        (t = t),
        clearInterval(he),
        clearInterval(ye),
        nr(),
        pn(),
        (Yt = null),
        a["send"](Or({ j: [e, t] })),
        Xn(),
        we["clear"](),
        Pe["clear"](),
        (window.writeBuffer = []),
        0)
      );
    }
    function An() {
      var e = n;
      En(),
        (m = !1),
        (Gt = !1),
        (H = ""),
        (W = ""),
        pn(),
        gn(),
        (c["style"]["display"] = "flex"),
        setTimeout(function () {
          var t = e;
          c["style"]["opacity"] = "100%";
        }, 50),
        clearInterval(he),
        clearInterval(ye),
        nr(),
        dt(!1);
      if (client.banned) {
        document.getElementById("connecting1").innerText = "Banned";
        document.getElementById(
          "connecting2"
        ).innerText = `Refresh to reconnect${
          client.banReason ? `\nReason: ${client.banReason}` : ""
        }\nYou can appeal in the server\n`;
      } else if (client.serverClosed) {
        document["getElementById"]("connecting2")["innerText"] =
          "Click to reconnect\nThis might be because of the site updating. (refresh to see changes)\nHaving issues? Ask in the Discord server!\n"; //connecting2 text
        document["getElementById"]("connecting1").innerText =
          "Server closed/restarting"; //connecting1 text
      } else {
        document["getElementById"]("connecting2")["innerText"] =
          "Click to reconnect\nHaving issues? Ask in the Discord server!\n"; //connecting2 text
        document["getElementById"]("connecting1").innerText = "Disconnected."; //connecting1 text
      }
      var a = document.createElement("a");
      a.href = "https://discord.gg/rDXPEgFA6m";
      a.innerText = "https://discord.gg/rDXPEgFA6m";
      a.target = "_blank";
      document.getElementById("connecting2").append(a);
      c.onclick = Kr;
    }
    window.addChat = addChat;
    window.clientMessage = clientMessage;
    function addChat(name, color, message, registered, id) {
      var o = t,
        i = document.getElementById("chatbox"),
        c = document["createElement"]("p"),
        l = document.createElement("a");
      (l["innerText"] = name),
        (l.style["color"] = "#FFFFFF" == se[color] ? "#222222" : se[color]),
        registered &&
          ((l["href"] = "/@" + name), l.onclick = wn), // teleportTo is not defined glitch just doesnt know it right 
        (l.title = "(" + id + ")");
      c["appendChild"](l),
        c.appendChild(document.createTextNode(": " + message));
      c.innerHTML = c.innerHTML.replace(
        /((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g,
        '<a href="$1" target="_blank">$1</a>'
      );
      var u =
        Math["abs"](i["scrollHeight"] - i["scrollTop"] - i["clientHeight"]) < 5;
      twemoji.parse(c, { base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/" }); // twemoji isnt defined
      c.innerHTML = convertToEmote(c.innerHTML);
      c.childNodes[0].onclick = l.onclick;
      i.appendChild(c),
        u && gn(),
        hn["classList"]["contains"]("open") || yn["classList"]["add"]("show");
    }
    function clientMessage(msg) {
      addChat("Client", 0, msg, false, 0);
    }
    function Tn(e) {
      var t = n,
        r = new Uint8Array(e["data"]).buffer,
        a = Rr(new Uint8Array(r));
      client.emit("wsmessage", a);
      switch (Object["keys"](a)[0]) {
        case "b":
          var i = a.b;
          (Yt = { minx: i[0], maxx: i[1], miny: i[2], maxy: i[3] }),
            Jt(Ce.x, Ce.y) || Zn(0, 0),
            (ge = !0);
          break;
        case "j":
          var l = a.j;
          (W = l[0]),
            (H = l[1]),
            En(),
            "textwall" == W && (nt["private"]["disabled"] = !0),
            "textwall" != W
              ? "main" != H
                ? ((o = "/@" + W + "/" + H), history["pushState"]({}, null, o))
                : ((o = "/@" + W), history["pushState"]({}, null, o))
              : ((o = "/"),
                Pr()["startsWith"]("@") && history["pushState"]({}, null, o),
                (J["style"]["display"] = "none")),
            client.emit("wallchange", getWallName()); // getwallname isnt defined
          (Gt = !1),
            (he = setInterval(Qt, 250)),
            (ye = setInterval(_t, 2e3)),
            Qt(),
            nr(),
            (c["style"]["opacity"] = "0%"),
            (Je = !1),
            ($e = {}),
            (k["style"]["cursor"] = "text"),
            Pe["clear"](),
            (window.writeBuffer = []),
            (K = !1),
            On(),
            tt["showchat"]["checked"] && hn["classList"].remove("hidden"),
            x["classList"]["remove"]("hidden"),
            (q["innerHTML"] = ""),
            (Le = !0),
            (Oe = !0),
            (Re = !0),
            setTimeout(function () {
              c["style"].display = "none";
            }, 500);
          break;
        case "alert":
          ir(a["alert"], 8e3);
          break;
        case "online":
          (We = a["online"]), (Ke["title"] = We + " online");
          break;
        case "e":
          for (var u = a.e.e, s = 0; s < u["length"]; s++) {
            var d = (w = 20 * u[s][0]) + "," + (M = 10 * u[s][1]);
            if (we["has"](d) && null != (E = we["get"](d))["txt"])
              for (var f = 2; f < u[s]["length"]; f += 3) {
                var v = String["fromCodePoint"](u[s][f]),
                  h = u[s][f + 1],
                  y = u[s][f + 2];
                (E["txt"][h] == v && E["clr"][h] == y) ||
                  ((E["txt"][h] = v), (E["clr"][h] = y), It(d, Dt(h))),
                  setTimeout(
                    Kn,
                    ((f - 2) / 3) * 25,
                    w + (h - 20 * Math["floor"](h / 20)),
                    M + Math["floor"](h / 20),
                    y,
                    a.e.a
                  );
              }
          }
          break;
        case "chunks":
          var g = (a = a.chunks)["length"];
          for (s = 0; s < g; s += 5) {
            var p = (w = 20 * a[s]) + "," + (M = 10 * a[s + 1]);
            if (we["has"](p))
              if (
                (((E = we["get"](p))["coords"] = [w, M]),
                a[s + 4] && (E["protected"] = !0),
                0 !== a[s + 2])
              )
                for (
                  St(p, !0),
                    E["txt"] = Array["from"](a[s + 2]),
                    E.clr = Array["from"](a[s + 3]),
                    f = 0;
                  f < 200;
                  f++
                )
                  E["clr"][f] = E["clr"][f]["codePointAt"]() - ue;
              else
                (E.txt = _e["slice"]()),
                  (E.clr = et["slice"]()),
                  (E.empty = !0);
          }
          var b = $t["length"];
          for (s = 0; s < b; s += 2) {
            var w, M, E;
            (p = (w = 20 * $t[s]) + "," + (M = 10 * $t[s + 1])),
              we.has(p) &&
                null == (E = we["get"](p))["txt"] &&
                we["set"](p, {
                  txt: _e.slice(),
                  clr: et.slice(),
                  empty: !0,
                  coords: [w, M],
                });
          }
          (Gt = !1), (ge = !0);
          break;
        case "p":
          var S = a.p;
          (p = S[0]),
            we["has"](p) && ((we.get(p)["protected"] = S[1]), It(p, !0));
          break;
        case "c":
          !(function (e, n, r, a) {
            for (var o = t, i = n; i <= a; i++)
              for (var c = e; c <= r; c++) {
                var l = 20 * Math["floor"](c / 20),
                  u = 10 * Math["floor"](i / 10),
                  s = l + "," + u;
                if (we["has"](s)) {
                  var d = we["get"](s);
                  if (null != d["txt"]) {
                    var f = c - l + 20 * (i - u);
                    (d["txt"][f] = " "), (d.clr[f] = 0), St(s, Dt(f));
                  }
                }
              }
            ge = !0;
          })((i = a.c)[0], i[1], i[2], i[3]);
          break;
        case "cu":
          var I = a.cu,
            C = I.id;
          client.emit("cursor", {
            id: I.id,
            color: I.c,
            location: I.l,
            name: I.n,
          });
          Pe.has(C) || Pe.set(C, { c: 0, n: "", l: [0, 0], rawx: 0, rawy: 0 });
          var A = Pe["get"](C);
          null != I.l &&
            ((A.l = I.l),
            tt["smoothcursors"]["checked"] ||
              ((A["rawx"] = A.l[0]), (A["rawy"] = A.l[1]))),
            null != I.c && (A.c = I.c),
            null != I.n && (A.n = I.n),
            (ge = !0),
            On();
          break;
        case "msg":
          var T = a.msg;
          client.emit("chat", {
            username: T[0],
            color: T[1],
            message: T[2],
            registered: T[3],
            id: T[4],
          });
          addChat(T[0], T[1], T[2], T[3], T[4]);
          break;
        case "rc":
          Pe["delete"](a.rc), (ge = !0), On();
          break;
        case "ro":
          var B = a.ro;
          (nt["readOnly"].checked = B),
            B && ir("This wall is read-only; you cannot type on it.", 3e3),
            xn();
          break;
        case "priv":
          (nt["private"]["checked"] = a["priv"]),
            (function () {
              var e = t;
              if (null != Y)
                for (var n = 0; n < Y["length"]; n += 2)
                  if (Y[n] == H)
                    return (Y[n + 1] = nt["private"]["checked"]), void Ln(Y);
            })();
          break;
        case "ch":
          var F = a.ch;
          (nt["hideCursors"].checked = F),
            m ||
              ((tt["showothercurs"]["disabled"] = F),
              (tt["showothercurs"].checked =
                !F && "false" != localStorage.getItem("showothercurs"))),
            (ge = !0);
          break;
        case "dc":
          var P = a.dc;
          (nt["disableChat"]["checked"] = P),
            (tt["showchat"].disabled = P),
            P
              ? ((tt["showchat"]["checked"] = !1),
                hn["classList"]["add"]("hidden"))
              : ((tt["showchat"]["checked"] =
                  "false" != localStorage["getItem"]("showchat")),
                tt.showchat.checked && hn["classList"].remove("hidden"));
          break;
        case "dcl":
          var L = a["dcl"];
          (nt["disableColour"]["checked"] = L),
            hr(!!L || tt["disablecolour"]["checked"]);
          break;
        case "db":
          var O = a.db;
          nt["disableBraille"]["checked"] = O;
          break;
        case "l":
          (U = a.l), (document.getElementById("l")["checked"] = a.l), xn();
          break;
        case "regclosed":
          var closed = a.regclosed;
          document.getElementById("closereg").checked = closed;
          break;
        case "perms":
          (j = a["perms"]),
            (X["style"]["display"] = 2 == j || 1 == j ? "block" : "none"),
            2 == j
              ? ((z["style"]["display"] = "block"), (J.style.display = "block"))
              : ((z["style"]["display"] = "none"),
                (J.style["display"] = "none")),
            (nt["readOnly"]["disabled"] =
              nt["private"].disabled =
              nt["hideCursors"].disabled =
              nt.disableChat["disabled"] =
              nt["disableColour"]["disabled"] =
              nt["disableBraille"].disabled =
                !(2 == j || m)),
            m &&
              (J["style"]["display"] = "textwall" != W || K ? "block" : "none"),
            0 == j && ((Ve = !1), (Ze = !1)),
            (ge = !0),
            xn();
          break;
        case "addmem":
          let optionsmenu;
          Fn(a["addmem"]),
            (optionsmenu.scrollTop = optionsmenu["clientHeight"]);
          break;
        case "ml":
          let memberList;
          for (
            memberList = a.ml,
              document["getElementById"]("memberlist")["innerHTML"] = "",
              s = 0;
            s < memberList["length"];
            s++
          )
            Fn(memberList[s]);
          break;
        case "wl":
          Ln((Y = a.wl));
          break;
        case "nametaken":
          ir("Username is already in use.", 3e3), vn(!1);
          break;
        case "noreg":
          ir("Registration is closed.", 3e3), vn(!1);
          break;
        case "wrongpass":
          ir("Password is incorrect.", 3e3), vn(!1);
          break;
        case "loginfail":
          ir("Username/Password is incorrect.", 3e3), vn(!1);
          break;
        case "tokenfail":
          vn(!1),
            (document.getElementById("connecting2").innerText =
              "Joining wall..."),
            localStorage["removeItem"]("username"),
            localStorage.removeItem("token");
          break;
        case "namechanged":
          vn(!1),
            ir("Your username is now: " + (je = a.namechanged), 3e3),
            localStorage["setItem"]("username", je),
            Bn(),
            (ge = !0),
            (Re = !0);
          break;
        case "passchanged":
          ir("Password has been changed.", 3e3), vn(!1);
          break;
        case "accountdeleted":
          ir("Your account has been deleted.", 3e3),
            vn(!1),
            (Re = !0),
            dt(!0, !0);
          break;
        case "cool":
          ir("Rate limit", 3e3), vn(!1);
          break;
        case "token":
          client.registered = true;
          vn(!1);
          document.getElementById("connecting2").innerText = "Joining wall...";
          var R = a["token"];
          (je = R[0]),
            localStorage["setItem"]("username", je),
            localStorage["setItem"]("token", R[1]),
            (document["getElementById"]("login")["style"]["display"] = "none"),
            (document["getElementById"]("logintext")["style"]["display"] =
              "none"),
            (document["getElementById"]("loginwithdiscord")["style"][
              "display"
            ] = "none"),
            (document["getElementById"]("discordloginbtn").disabled = false),
            (document["getElementById"]("register")["style"]["display"] =
              "none"),
            (document["getElementById"]("loggedin").style["display"] = "block"),
            Bn(),
            (ge = !0),
            (Re = !0);
          break;
        case "admin":
          a["admin"]
            ? ((m = !0),
              (document["getElementById"]("admin").style.display = "block"))
            : ((m = !1),
              (document.getElementById("admin")["style"].display = "none"));
          break;
        case "t":
          document["getElementById"]("t").value = a.t;
          break;
        case "id":
          client.id = a.id;
          console.log("Your ID: " + client.id);
          console.log("Joined on " + new Date());
          je = "(" + client.id + ")";
          ge = true;
          break;
        case "banned":
          client.banned = true;
          client.banReason = a.banned;
          break;
        case "closing":
          client.serverClosed = true;
          break;
        case "typeconfirm":
          ir('Please type "confirm" as the password.', 3e3);
          vn(!1);
          break;
        case "cantchangepass":
          ir(
            "You cannot change your password, as you used Discord to log in.",
            8e3
          );
          vn(!1);
          break;
      }
    }
    function Bn() {
      var e = n,
        t = document["getElementById"]("name");
      (t["innerText"] = je),
        (t["href"] = "/@" + je),
        (t["onclick"] = function (e) {
          e.preventDefault(), vr("@" + je);
        });
    }
    function Fn(e) {
      var t = n,
        r = document["getElementById"]("memberlist"),
        a = document["createElement"]("div");
      a["classList"]["add"]("member"),
        (a["innerText"] = e),
        a["addEventListener"]("click", Pn),
        r.appendChild(a);
    }
    function Pn(e) {
      var t = n,
        r = e["target"]["innerText"];
      a.send(Or({ rmmem: r })), e["target"].remove();
    }
    function Ln(e) {
      for (var t = n, r = {}, a = [], o = !1, i = 0; i < e["length"]; i += 2) {
        var c = e[i],
          l = e[i + 1];
        "main" == c ? (o = !0) : a.push(c), (r[c] = l);
      }
      a["sort"](),
        o && a["unshift"]("main"),
        (q["innerHTML"] = ""),
        q["appendChild"](document["createElement"]("hr"));
      var u = document["createElement"]("span");
      (u["innerText"] = W + "'s walls"), q["appendChild"](u);
      var s = q.appendChild(document["createElement"]("ul"));
      for (s.classList["add"]("walllist"), i = 0; i < a.length; i++) {
        l = r[(c = a[i])];
        var d = s["appendChild"](document["createElement"]("li")),
          f = document["createElement"]("a"),
          v = document.createElement("img");
        l
          ? ((v["src"] = "/static/lock.svg"),
            (v["alt"] = v["title"] = "Private"))
          : ((v["src"] = "/static/lock_open.svg"),
            (v["alt"] = v.title = "Public"));
        const e = "@" + W + ("main" == c ? "" : "/" + c);
        f["appendChild"](v),
          f["appendChild"](document["createTextNode"](e)),
          (f.href = "/" + f["innerText"]),
          f["classList"].add("buttonlink"),
          c == H && f["classList"]["add"]("bold"),
          f["addEventListener"]("click", function (n) {
            n["preventDefault"](), vr(e);
          }),
          d.appendChild(f),
          s["appendChild"](d);
      }
        var m = q["appendChild"](document["createElement"]("form"));
        (m.style["display"] = "flex"),
          (m.style["justifyContent"] = "space-between");
        var h = m.appendChild(document["createElement"]("input"));
        (h.type = "text"),
          (h["placeholder"] = "Create a new wall"),
          (h["maxLength"] = 24),
          (h["style"].width = "100%");
        var y = m["appendChild"](document["createElement"]("input"));
        (y["type"] = "submit"),
          (y["value"] = "Create"),
          y.addEventListener("click", function (e) {
            var n = t;
            e.preventDefault();
            var r = h["value"];
            (h.value = ""),
              Bt["test"](r)
                ? (Cn(W, r), Zn(0, 0), M.classList["remove"]("open"))
                : ir("Invalid wall name", 2e3);
          });
    }
    function On() {
      var e = n;
      (Ue = Pe["size"]),
        (Ke["innerText"] = Ue + " " + ((Ue == 1) ? "person" : "people")),
        (document.getElementById("chatmsg")["placeholder"] =
          0 == Ue
            ? "chat with nobody"
            : 1 == Ue
            ? "chat with 1 other user"
            : "chat with " + Ue + " other users"),
        y || En();
    }
    function Rn(e) {
      var t = n;
      Ge["unshift"]([
        (e.clientX * v) / at,
        (e.clientY * v) / at,
        performance["now"](),
      ]),
        Ge.length > 4 && Ge["pop"]();
    }
    var Dn,
      Nn = !1,
      jn = 0;
    function Un(e) {
      var t = n;
      e["isTrusted"] &&
        (e["preventDefault"](), e["pointerId"] == Dn && (Dn = void 0));
    }
    window.screenCoordsToCharCoords = (x, y) => Wn({ pageX: x, pageY: y });
    window.charCoordsToScreenCoords = charCoordsToScreenCoords;
    function charCoordsToScreenCoords(x, y) {
      return {
        x:
          (x * (10 * v)) / devicePixelRatio + qe["offset"].x / devicePixelRatio,
        y: (y * (20 * v)) / devicePixelRatio + qe.offset.y / devicePixelRatio,
      };
    }
    function Wn(e) {
      var t = n;
      return {
        x: Math["floor"](
          (e.pageX * devicePixelRatio - qe["offset"].x) / (10 * v)
        ),
        y: Math["floor"](
          (e["pageY"] * devicePixelRatio - qe["offset"].y) / (20 * v)
        ),
      };
    }
    function Hn() {
      var e = n;
      (He.innerText = Ce.x + " X, " + -Ce.y + " Y"),
        Ce.x + qe["offset"].x / v / 10 <= 0 &&
          Mn(10 * -Ce.x * v, qe["offset"].y),
        Ce.x + qe["offset"].x / v / 10 >= window["innerWidth"] / at / 10 - 1 &&
          Mn((10 * -Ce.x + window.innerWidth / at - 10) * v, qe["offset"].y),
        Ce.y + qe.offset.y / v / 20 <= 0 && Mn(qe["offset"].x, 20 * -Ce.y * v);
      var t = window["innerWidth"] < 750 ? l.clientHeight : 0;
      Ce.y + qe["offset"].y / v / 20 >=
        (window["innerHeight"] - t) / at / 20 - 1 &&
        Mn(
          qe["offset"].x,
          (20 * -Ce.y + window["innerHeight"] / at - 20 - t / at) * v
        ),
        (Le = Ae.x != Ce.x || Ae.y != Ce.y || Le),
        (Ae.x = Ce.x),
        (Ae.y = Ce.y),
        tt["smoothcursors"]["checked"] ||
          ((Ce["rawx"] = Ce.x), (Ce.rawy = Ce.y)),
        (Math.abs(Ce.lastedit.x - Ce.x) > 300 ||
          Math["abs"](Ce["lastedit"].y - Ce.y) > 300) &&
          ((Ce["start"] = Ce.x), Xn()),
        Ce.x < Ce["start"] && (Ce.start = Ce.x),
        (ge = !0),
        localStorage["setItem"]("x", Ce.x),
        localStorage["setItem"]("y", Ce.y);
    }
    function Kn(e, t, r, a) {
      var o = n;
      tt["disablecolour"].checked && (r = 0),
        (r = Zr(r)[0]),
        xt([e, t], bt(20)) || Ne["push"]([e, t, 0.1, r, a]);
    }
    function Xn() {
      (Be = []), (Fe = []);
    }
    k.addEventListener(
      "touchstart",
      function (e) {
        var t = n;
        2 === e["touches"]["length"] &&
          ((Nn = !0), (Dn = void 0), (jn = 0), i["blur"]());
      },
      { passive: !0 }
    ),
      k["addEventListener"](
        "touchmove",
        function (e) {
          var r = n;
          Nn &&
            ((function (e) {
              var n = t;
              if (e.touches.length > 1) {
                var r = Math["sqrt"](
                  Jr(e.touches[0]["pageX"] - e.touches[1]["pageX"]) +
                    Jr(e.touches[0]["pageY"] - e["touches"][1]["pageY"])
                );
                0 != jn &&
                  it(Math.max(Math.min(rt - (jn - r) / 300, 3), 0.5), !0),
                  (Dn = void 0),
                  (jn = r);
              }
            })(e),
            i["blur"]());
        },
        { passive: !0 }
      ),
      k["addEventListener"]("touchend", function (e) {
        Nn && ((Dn = void 0), (jn = 0), (Nn = !1), i["blur"]());
      });
    var zn = 0,
      qn = performance["now"](),
      Yn = 0, Jn = [0x5, 0x8, 0xB, 0xE, 0x11, 0x14, 0x17, 0x1A, 0x1D, 0x20, 0x23, 0x26], rainbowMode = "Normal", rainbowModeMap = new Map();
    rainbowModeMap.set("Light",[0x6, 0x9, 0xC, 0xF, 0x12, 0x15, 0x18, 0x1B, 0x1E, 0x21, 0x24, 0x27]),
    rainbowModeMap.set("Normal",[0x5, 0x8, 0xB, 0xE, 0x11, 0x14, 0x17, 0x1A, 0x1D, 0x20, 0x23, 0x26]),
    rainbowModeMap.set("Dark",[0x4, 0x7, 0xA, 0xD, 0x10, 0x13, 0x16, 0x19, 0x1C, 0x1F, 0x22, 0x25]);
    class rainbowModeClass {
      constructor(e,t) {
        return rainbowMode.set(e,t)
      }
    }
    function rainbowModeChange(e) {
      var t = n, a;
      if (((rainbowMode = e), rainbowModeMap["has"](rainbowMode))){
        Jn = rainbowModeMap.get(rainbowMode);
      }
    }
    document.getElementById
    ("rainbowmodeselect")
    .onchange = function (e) {
      var t = n;
      rainbowModeChange(e.target.value)
      console.log(rainbowModeMap.get(e.target.value))
    };
    client.chat = {
      send: (msg) => {
        msg = msg.toString().slice(0, 400);
        var args = msg.split(" ");
        var cmd = args.shift();
        if (cmd.startsWith("/") && client.commands[cmd.slice(1)])
          return client.commands[cmd.slice(1)](args);
        a.send(Or({ msg }));
      },
    };
    var system = {
      onmute: () => {
        a.send(Or({ msg: "You are muted" }));
      },
    };
    window.writeChar = Vn;
    window.writeCharAt = writeCharAt;
    window.getCharInfo = getCharInfo;
    window.teleportTo = vr;
    window.n = n;
    client.chunks = we;
    client.cursors = Pe;
    client.cursor = Ce;
    function getCharInfo(x, y) {
      var char = {};
      var chunkX = Math.floor(x / 20) * 20;
      var chunkY = Math.floor(y / 10) * 10;
      var chunk = client.chunks.get(chunkX + "," + chunkY);
      if (!chunk) return;
      var i = (y - chunkY) * 20 + (x - chunkX);
      char.char = chunk.txt[i];
      char.color = chunk.clr[i] % 40;
      char.protected = chunk.protected ? true : false;
      var format = Math.floor(chunk.clr[i] / 40);
      char.decorations = {
        bold: (format & 8) == 8,
        italic: (format & 4) == 4,
        underline: (format & 2) == 2,
        overline: (format & 16) == 16,
        strike: (format & 1) == 1,
      };
      return char;
    }
    function Vn(e, t, r, a) {
      var o = n;
      if (
        (ie(!1),
        performance["now"]() - qn >= 100 &&
          ((qn = performance.now()), (zn = 0)),
        !e || zn >= 3)
      )
        return 0;
      var i = (e = Array.from(e)[0])["codePointAt"]();
      if (nt["disableBraille"]["checked"] && qr(i)) return 0;
      var c = 20 * Math["floor"](Ce.x / 20),
        l = 10 * Math["floor"](Ce.y / 10),
        u = c + "," + l;
      if (!we["has"](u)) return 0;
      var s = we["get"](u);
      if (
        ((s.protected ||
          nt["readOnly"]["checked"] ||
          (U && !client.registered)) &&
          !m &&
          0 == j) ||
        null == s["txt"] ||
        K
      )
        return (
          U &&
            !client.registered &&
            !nt["readOnly"]["checked"] &&
            ir("Please log in before typing.", 3e3),
          0
        );
      tt.rainbow["checked"] &&
        !r &&
        (mr(Jn[Yn]), ++Yn == Jn.length && (Yn = 0));
      var d,
        f,
        v,
        h,
        y,
        g,
        p,
        b,
        x,
        w,
        M,
        k,
        E,
        S = 1,
        I = a ? 0 : ce(),
        C = Vr(client.color, I),
        A = Ce.x - c + 20 * (Ce.y - l),
        T = s["clr"][A],
        B = Zr(T),
        F = B[0],
        P = B[1],
        L = s.txt[A];
      return (
        (L == e && T == C) ||
          (Qn(e, I) && Qn(L, P)) ||
          ((M = P),
          (k = e),
          (E = I),
          Gn(L) &&
            Gn(k) &&
            (2 & M) == (2 & E) &&
            (1 & M) == (1 & E) &&
            F == client.color) ||
          (r
            ? ((g = Ce.x),
              (p = Ce.y),
              (b = s["txt"][A]),
              (x = T),
              (w = o),
              Fe.unshift([g, p, b, x]),
              Fe["length"] > 1e3 && Fe["pop"]())
            : ((d = Ce.x),
              (f = Ce.y),
              (v = s["txt"][A]),
              (h = T),
              Be["unshift"]([d, f, v, h]),
              Be["length"] > 1e3 && Be["pop"]()),
          (s["txt"][A] = e),
          (s.clr[A] = C),
          window.writeBuffer.push([c / 20, l / 10, e.codePointAt(), A, C]),
          (S = 2),
          It(u, Dt(A))),
        (Ce["lastedit"].x = Ce.x),
        (Ce["lastedit"].y = Ce.y),
        (Ce.x += t),
        Hn(),
        S
      );
    }
    function writeCharAt(e, coordX, coordY, color = client.color, r, a) {
      var Ce = { x: coordX, y: coordY };
      var o = n;
      if (
        (ie(!1),
        performance["now"]() - qn >= 100 &&
          ((qn = performance.now()), (zn = 0)),
        !e || zn >= 3)
      )
        return 0;
      var i = (e = Array.from(e)[0])["codePointAt"]();
      if (nt["disableBraille"]["checked"] && qr(i)) return 0;
      var c = 20 * Math["floor"](Ce.x / 20),
        l = 10 * Math["floor"](Ce.y / 10),
        u = c + "," + l;
      if (!we["has"](u)) return 0;
      var s = we["get"](u);
      if (
        ((s.protected ||
          nt["readOnly"]["checked"] ||
          (U && !client.registered)) &&
          !m &&
          0 == j) ||
        null == s["txt"] ||
        K
      )
        return (
          U &&
            !client.registered &&
            !nt["readOnly"]["checked"] &&
            ir("Please log in before typing.", 3e3),
          0
        );
      tt.rainbow["checked"] &&
        color !== undefined &&
        !r &&
        (mr(Jn[Yn]), ++Yn == Jn.length && (Yn = 0));
      var d,
        f,
        v,
        h,
        y,
        g,
        p,
        b,
        x,
        w,
        M,
        k,
        E,
        S = 1,
        I = a ? 0 : ce(),
        C = Vr(color, I),
        A = Ce.x - c + 20 * (Ce.y - l),
        T = s["clr"][A],
        B = Zr(T),
        F = B[0],
        P = B[1],
        L = s.txt[A];
      return (
        (L == e && T == C) ||
          (Qn(e, I) && Qn(L, P)) ||
          ((M = P),
          (k = e),
          (E = I),
          Gn(L) &&
            Gn(k) &&
            (2 & M) == (2 & E) &&
            (1 & M) == (1 & E) &&
            F == client.color) ||
          (r
            ? ((g = Ce.x),
              (p = Ce.y),
              (b = s["txt"][A]),
              (x = T),
              (w = o),
              Fe.unshift([g, p, b, x]),
              Fe["length"] > 1e3 && Fe["pop"]())
            : ((d = Ce.x),
              (f = Ce.y),
              (v = s["txt"][A]),
              (h = T),
              Be["unshift"]([d, f, v, h]),
              Be["length"] > 1e3 && Be["pop"]()),
          (s["txt"][A] = e),
          (s.clr[A] = C),
          window.writeBuffer.push([c / 20, l / 10, e.codePointAt(), A, C]),
          (S = 2),
          It(u, Dt(A))),
        Hn(),
        S
      );
    }
    function Zn(e, t) {
      var r = n;
      ie(!1),
        (Ce.x = e),
        (Ce.y = t),
        Mn(
          (10 * -Ce.x + window.innerWidth / at / 2) * v,
          (20 * -Ce.y + window["innerHeight"] / at / 2) * v
        ),
        (document["getElementById"]("tpword")["value"] = ""),
        (document["getElementById"]("tpx").value = 0),
        (document["getElementById"]("tpy")["value"] = 0),
        nr(),
        Hn(),
        en(),
        _t();
    }
    function $n() {
      history.pushState({}, null, o);
    }
    function Gn(e) {
      return " " == e || e == V;
    }
    function Qn(e, t) {
      return Gn(e) && 0 == (2 & t) && 0 == (1 & t);
    }
    const _n = Math["log"](5 / 3) / 1e3;
    var er = !1;
    function tr(e) {
      var t = n;
      if (!Ie) {
        var r,
          a,
          o = (e = e["replace"](Tt, ""))["split"](Z),
          i = !1;
        if (
          (2 == o["length"]
            ? ((i = !0),
              (r = Array["from"](o[0])),
              (a = Array["from"](o[1])),
              (r["length"] != a.length || tt["rainbow"]["checked"]) && (i = !1))
            : ((e = e.replace(At, "   ")), (r = Array["from"](e))),
          1 != r["length"])
        ) {
          if (((Ie = !0), !er)) {
            (er = !0), (Ce["start"] = Ce.x);
            var c = client.color,
              l = ce();
            !(function e(n, o) {
              var u = t;
              if (n == r["length"] || !Ie)
                return nr(), (er = !1), mr(c), void le(l);
              if ("\n" == r[n]) return cr(), setTimeout(e, 20 / 1.5, n + 1, o);
              var s,
                d,
                f = r[n];
              if (i) {
                var v =
                    ((s = a[n]),
                    (d = s["codePointAt"]()),
                    ((d -= d < ue ? 65 : ue) < 0 || d > 495) && (d = 0),
                    d),
                  [m, h] = Zr(v);
                Qn(f, h) || mr(m), le(h);
              }
              switch (((zn = 0), Vn(f, 1))) {
                case 0:
                case 1:
                  return setTimeout(e, 10 / 1.5, n + 1, o);
                default:
                  return setTimeout(
                    e,
                    (36 * Math["pow"](Math.E, _n * o)) / 1.5,
                    n + 1,
                    o + 1
                  );
              }
            })(0, 0);
          }
        } else Vn(r[0], 1);
      }
    }
    function nr() {
      Ie = !1;
    }
    function rr() {
      var e = n,
        t = 20 * Math["floor"](Ce.x / 20),
        r = 10 * Math["floor"](Ce.y / 10),
        a = we["get"](t + "," + r);
      if (!a || null == a["txt"]) return !1;
      var o = Ce.x - t + 20 * (Ce.y - r);
      return [a["txt"][o], a["clr"][o]];
    }
    function ar(e) {
      var t = n;
      navigator.clipboard
        ? navigator["clipboard"]["writeText"](e)
        : ((b["value"] = e),
          b["focus"](),
          b["select"](),
          document["execCommand"]("copy"));
    }
    function or(e) {
      var t = n;
      e["preventDefault"](),
        (Je = !0),
        (k.style.cursor = "crosshair"),
        ir("Select an area to copy.", 1500);
    }
    window.showAlert = ir;
    function ir(e, t) {
      var r = n;
      clearTimeout(p),
        (g.innerText = e),
        g["classList"]["add"]("toasting"),
        (p = setTimeout(function () {
          g["classList"].remove("toasting");
        }, t));
    }
    function cr() {
      (Ce.x = Ce.start), Ce.y++, Hn();
    }
    (!navigator.clipboard || !navigator.clipboard.readText) &&
      (document["getElementById"]("paste").style["display"] = "none");
    var lr = 0;
    function ur(e) {
      var t = n;
      switch (
        (ie(!1), ((2 == e && 2 == lr) || (1 == e && 1 == lr)) && (e = 0), e)
      ) {
        case 0:
          x.style["transform"] = "translateX(-105%)";
          break;
        case 1:
          var r = document.getElementById("optionsmenu")["clientWidth"];
          x["style"]["transform"] = "translateX(" + -r + "px)";
          break;
        default:
          (x.style.transform = "translateX(0px)"),
            M["classList"]["contains"]("open") &&
              M["classList"]["remove"]("open");
      }
      (lr = e), en();
    }
    function sr(e) {
      var t = n,
        r = document.createElement("div");
      r["classList"]["add"]("colour"),
        r.addEventListener("click", function (t) {
          mr(e), nn(t);
        }),
        r.setAttribute("id", e),
        (r["style"]["backgroundColor"] = se[e]),
        (r["title"] = de[e]),
        w["appendChild"](r);
    }
    function dr() {
      var e = n;
      ie(!1),
        M["classList"]["contains"]("open")
          ? (M.classList["remove"]("open"), en())
          : (M["classList"]["add"]("open"),
            2 == lr && ur(0),
            document.getElementById("tpword")["focus"]());
    }
    function fr(e) {
      return e["replace"](/^\/|\/$/g, "");
    }
    function vr(e) {
      var t = n,
        r = (e = (e = fr(e))["replace"](/\@\/*/, "@"))["split"]("/");
      if (
        ((e = r["shift"]()),
        r["length"] > 0 && (e += "/" + r["shift"]()),
        (e = fr(e))["startsWith"]("@") && "@main" != e)
      ) {
        var a = e["split"]("/"),
          o = a[0]["replace"]("@", ""),
          i = "main";
        a.length > 1 && (i = a[1]), Cn(o, i), Zn(0, 0);
      } else {
        var c = Lr(e);
        Zn(c.x, c.y),
          Cn("textwall", "main"),
          0 == c.x && 0 == c.y
            ? $n()
            : (history["pushState"]({}, null, e),
              client.emit("wallchange", getWallName()));
      }
      M["classList"]["remove"]("open");
    }
    function mr(e) {
      var t = n;
      (tt["disablecolour"]["checked"] || nt["disableColour"]["checked"]) &&
        (e = 0),
        client.color != e && (Oe = !0);
      var r = document.getElementById(client.color);
      r["classList"]["remove"]("selected"),
        (client.color = e),
        (be =
          xe && 0 == client.color
            ? "rgba(255, 255, 255, 0.6)"
            : Yr(se[client.color], 0.6)),
        (r = document["getElementById"](client.color))["classList"]["add"](
          "selected"
        ),
        r["offsetTop"] < w["scrollTop"] + 36 &&
          (w["scrollTop"] = r["offsetTop"] - 36),
        r.offsetTop > w.scrollTop + w["clientHeight"] &&
          (w.scrollTop = r.offsetTop - w.clientHeight),
        document
          .getElementById("theme-colour")
          ["setAttribute"]("content", se[e]),
        localStorage["setItem"]("col", e),
        (ge = !0);
    }
    for (w["children"].length > 0 && (a = !0), ne = 0; ne < se["length"]; ne++)
      sr(fe[ne]);
    function hr(e) {
      for (var t = n, r = 0; r < w.children.length; r++)
        "0" != w["children"][r].id &&
          (e
            ? w["children"][r]["classList"].add("hidden")
            : w["children"][r].classList.remove("hidden"));
      e && mr(0);
    }
    function yr(e) {
      var t = n;
      if (null != e) N = e;
      else
        switch (N) {
          case 0:
            N = 1;
            break;
          case 1:
            N = 2;
            break;
          case 2:
            N = 0;
        }
      0 == N &&
        ((xe = !1),
        (document["getElementById"]("themeico")["src"] = "/static/sun.svg"),
        (document["getElementById"]("themeico")["alt"] = "☀"),
        (C = S),
        (A = I)),
        1 == N &&
          ((xe = !0),
          (document["getElementById"]("themeico")["src"] = "/static/moon.svg"),
          (document["getElementById"]("themeico")["alt"] = "🌙"),
          (C = "#000000"),
          (A = "#141414")),
        2 == N
          ? ((xe = P.checked),
            (document.getElementById("themeico")["src"] = "/static/star.svg"),
            (document.getElementById("themeico")["alt"] = "⭐"),
            (C = B["value"]),
            (A = F["value"]),
            L["classList"].remove("hidden"))
          : L.classList["add"]("hidden"),
        (T = Xr(A, 10)),
        localStorage.setItem("theme", N),
        (ge = !0),
        en(),
        mr(client.color),
        Sn();
    }
    function gr(e) {
      var t = n;
      e["target"] == B
        ? ((C = B["value"]), Sn())
        : e.target == F && ((A = F.value), (T = Xr(A, 10)), Sn(!0)),
        localStorage["setItem"](
          "customtheme",
          JSON["stringify"]({
            primary: B.value,
            secondary: F["value"],
            texttheme: P["checked"],
          })
        );
    }
    function pr(e) {
      var t = n;
      br(e["target"]["parentElement"].id), en();
    }
    function br(e, t) {
      var r = n,
        a = ae[e];
      (a.enabled = null != t ? t : !a.enabled),
        a["enabled"]
          ? a.el["classList"]["add"]("enabled")
          : a.el["classList"]["remove"]("enabled"),
        localStorage.setItem("dec", ce());
    }
    function xr(e, t, r) {
      var a = n;
      if (Math["abs"](e - t) > 0.1) {
        for (var o = 0; o < r; o++) e += (t - e) / 20;
        return (ge = !0), Math["round"](100 * e) / 100;
      }
      return e != t ? ((ge = !0), Math["round"](e)) : e;
    }
    client.setFlushInterval = function(ms) {
      clearInterval(flushInterval);
      flushInterval = setInterval(function() {
        var e = n;
        if (a && a["readyState"] == a["OPEN"]) {
          if ((Le || Oe || Re || De) && 0 != we.size) {
            var t = {};
            Le && (t.l = [Ce.x, Ce.y]),
              Oe && (t.c = client.color),
              Re && (t.n = tt["anonymous"]["checked"]),
              De && (t.p = [qe.coords.x, qe.coords.y]),
              a["send"](Or({
                ce: t
              })),
              (Le = !1),
              (Oe = !1),
              (Re = !1),
              (De = !1);
          }
          if (window.writeBuffer.length > 0) {
            var r;
            (r = window.writeBuffer["splice"](0, 64)), (t = []);
            e: for (var o = 0; o < r.length; o++) {
              for (
                var i = r[o][0],
                  c = r[o][1],
                  l = r[o][2],
                  u = r[o][3],
                  s = r[o][4],
                  d = 0; d < t["length"]; d++
              )
                if (t[d][0] == i && t[d][1] == c) {
                  t[d]["push"](l, u, s);
                  continue e;
                }
              t["push"]([i, c, l, u, s])                           // r spliced part
              /*
              if (                                                 // o index of current edit
                (t["push"]([i, c, l, u, s]),
                  4 == t["length"] && o + 1 < r["length"])
              ) {
                for (d = o + 1; d < r["length"]; d++) window.writeBuffer["unshift"](r[d]);
                break;
              }  // i think i know what this does, if the edit goes across 4 chunks, then it puts some edits at the start
                 // duck did this probably so that the closest edit to the cursor will be first, so the server doesnt kick the client
                 // (bro had to get around his own anti-scripting stuff)
                 // this can be an issue if you NEED edits to be in a specific order
                 // but since we're not on the anti-script site textwall.cc, we don't need this
                 */
            }
            a.send(Or({
              e: t
            }));
          }
        }
      }, ms);
    }
    client.setFlushInterval(200);
    var wr = performance.now(),
      Mr = 100,
      kr = performance["now"]() + 1e3;
    window.requestAnimationFrame(function e() {
      var t = n,
        r = Math["min"](Math["ceil"](performance["now"]() - wr), 100);
      if (
        ((wr = performance.now()),
        (r < Mr || wr > kr) && ((Mr = r), (kr = performance["now"]() + 1e3)),
        null != Qe)
      ) {
        (ge = !0),
          Mn(qe["offset"].x + Qe.dx, qe["offset"].y + Qe.dy, !0),
          0 == Qe.dx && 0 == Qe.dy && Mn(qe.offset.x, qe["offset"].y);
        for (var a = 0; a < r; a++) (Qe.dx *= 0.993), (Qe.dy *= 0.993);
        Math["abs"](Qe.dx) <= 0.3 && (Qe.dx = 0),
          Math.abs(Qe.dy) <= 0.3 && (Qe.dy = 0),
          0 == Qe.dy && 0 == Qe.dx && (Qe = null);
      }
      if (tt["smoothcursors"]["checked"]) {
        (Ce.rawx = xr(Ce["rawx"], Ce.x, r)),
          (Ce.rawy = xr(Ce["rawy"], Ce.y, r));
        var o = bt(20);
        for (const e of Pe.values())
          null == e["rawx"] ||
            null == e["rawy"] ||
            xt(e.l, o) ||
            ((e["rawx"] = xr(e["rawx"], e.l[0], r)),
            (e["rawy"] = xr(e["rawy"], e.l[1], r)));
      }
      if (0 != Ne.length) {
        for (var c = 0; c < Ne["length"]; c++)
          if (Ne[c][2] < 0.01) Ne["splice"](c, 1);
          else for (a = 0; a < r; a++) Ne[c][2] *= 0.995;
        ge = !0;
      }
      if (
        (ge &&
          ((function () {
            var e = t;
            E["setTransform"](1, 0, 0, 1, 0, 0),
              (E["fillStyle"] = A),
              E["fillRect"](0, 0, k["width"], k["height"]),
              E["translate"](
                Math.ceil(qe["offset"].x),
                Math["ceil"](qe.offset.y)
              );
            const r = 10 * v,
              a = 20 * v,
              o = Math["round"](5 * v);
            var i,
              c,
              l,
              u,
              s = bt(20),
              f = bt(d);
            for (const t of we["keys"]())
              xt((h = wt(t)), s)
                ? xt(h, f) && delete we.get(t)["img"]
                : pt(t, h);
            if (
              tt["showothercurs"]["checked"] &&
              (!nt.hideCursors["checked"] || m)
            ) {
              gt(E);
              for (const t of Pe.values()) {
                var h = t.l;
                if (!xt(h, s)) {
                  var y = Math.round(10 * t.rawx * v),
                    g = Math.round(20 * t["rawy"] * v);
                  t["highlighted"] &&
                    ((E["fillStyle"] = "rgba(239, 255, 71, 0.5)"),
                    E["fillRect"](
                      y - 2 * v,
                      g - 2 * v,
                      Math["ceil"](r) + 4 * v,
                      Math.round(a) + 4 * v
                    ));
                  var p = t.c;
                  tt.disablecolour["checked"] && (p = 0),
                    0 == p && xe && (p = se["length"]),
                    (E["fillStyle"] = me[p]),
                    kt(y, g, r, a),
                    !tt["shownametags"]["checked"] ||
                      ((i = h),
                      (c = void 0),
                      (l = void 0),
                      (u = void 0),
                      (c = n),
                      (l =
                        20 * Math["floor"](i[0] / 20) +
                        "," +
                        10 * Math.floor(i[1] / 10)),
                      (u = we["get"](l)) && u.protected && 0 == j) ||
                      Mt(t.n, y, g, o);
                }
              }
            }
            for (var b = 0; b < Ne["length"]; b++) {
              0 == (p = Ne[b][3]) && xe && (p = se["length"]),
                (E["fillStyle"] = me[p]["replace"]("0.2", Ne[b][2]));
              var x = 10 * Ne[b][0] * v,
                w = 20 * Ne[b][1] * v;
              if (tt["showothercurs"]["checked"] && m) {
                var M = Pe.get(Ne[b][4]);
                null != M &&
                  M["highlighted"] &&
                  ((E.lineWidth = 3 * v),
                  (E["strokeStyle"] = p == se["length"] ? "#FFFFFF" : se[p]),
                  E["beginPath"](),
                  E["moveTo"](
                    Math["round"](10 * M["rawx"] * v + r / 2),
                    Math["round"](20 * M["rawy"] * v + a)
                  ),
                  E["lineTo"](Math["round"](x + r / 2), Math.round(w + a)),
                  E.stroke());
              }
              E["fillRect"](x, w, r, a);
            }
            if (
              ((E["fillStyle"] = be),
              kt(
                (y = Math["round"](10 * Ce["rawx"] * v)),
                (g = Math["round"](20 * Ce["rawy"] * v)),
                r,
                a
              ),
              tt["shownametags"].checked &&
                ws.readyState == WebSocket.OPEN &&
                (gt(E),
                Mt(
                  tt["anonymous"]["checked"] ? "(" + client.id + ")" : je,
                  y,
                  g,
                  o
                )),
              Je && $e["start"] && $e["end"])
            ) {
              (E.fillStyle = "rgba(0,120,212,0.5)"),
                (y = Math["round"](
                  10 * Math["min"]($e["start"].x, $e.end.x) * v
                )),
                (g = Math.round(20 * Math.min($e["start"].y, $e["end"].y) * v));
              var S = Math.round(
                  10 * Math.max($e["start"].x, $e["end"].x) * v - y + 10 * v
                ),
                I = Math.round(
                  20 * Math["max"]($e["start"].y, $e["end"].y) * v - g + 20 * v
                );
              E["fillRect"](y, g, S, I);
            }
            if (Ve || Ze) {
              E["fillStyle"] =
                Ve && Ze
                  ? "rgba(195,219,224,0.5)"
                  : Ve
                  ? "rgba(204,204,204,0.5)"
                  : "rgba(221,249,255,0.5)";
              var C = 20 * Math.floor(Te.x / 20),
                T = 10 * Math["floor"](Te.y / 10);
              E.fillRect(10 * C * v, 20 * T * v, 200 * v, 200 * v);
            }
          })(),
          (ge = !1),
          "\n\n\n\n\n\n\n\n\n" != i.value && (i.value = "\n\n\n\n\n\n\n\n\n"),
          (i["selectionEnd"] = 4)),
        0 != Ee["size"])
      ) {
        for (var l = wr + (Mr - 2); ; ) {
          var u = ke.shift(),
            s = Ee["get"](u);
          if (
            (Ee["delete"](u), Xt(u, s), 0 == Ee.size || performance.now() >= l)
          )
            break;
        }
        ge = !0;
      }
      window["requestAnimationFrame"](e);
    }),
      null != localStorage["getItem"]("x") &&
        (Ce.x = parseInt(localStorage["getItem"]("x"))),
      null != localStorage["getItem"]("y") &&
        (Ce.y = parseInt(localStorage["getItem"]("y"))),
      null != localStorage["getItem"]("col")
        ? mr(parseInt(localStorage["getItem"]("col")))
        : mr(0),
      null != localStorage["getItem"]("dec") &&
        le(localStorage["getItem"]("dec")),
      null != localStorage.getItem("customfont") &&
        (O["value"] = localStorage["getItem"]("customfont")),
      null != localStorage.getItem("customfontsize") &&
        (R.value = localStorage["getItem"]("customfontsize")),
      null != $[localStorage["getItem"]("font")] &&
        vt(localStorage["getItem"]("font"));
    var Er = Object["keys"](tt);
    for (ne = 0; ne < Er["length"]; ne++) {
      var Sr = Er[ne];
      null != localStorage.getItem(Sr) &&
        (tt[Sr]["checked"] = "true" == localStorage["getItem"](Sr));
    }
    if (
      (tt["showchat"].checked || hn["classList"]["add"]("hidden"),
      tt["disablecolour"]["checked"] && hr(!0),
      null != localStorage["getItem"]("customtheme"))
    ) {
      var Ir = localStorage.getItem("customtheme");
      try {
        var Cr = JSON.parse(Ir);
        null != Cr["primary"] && (B["value"] = Cr["primary"]),
          null != Cr.secondary && (F["value"] = Cr.secondary),
          null != Cr["texttheme"] && (P.checked = Cr["texttheme"]);
      } catch (e) {}
    }
    if (null != localStorage.getItem("theme")) {
      var Ar = localStorage["getItem"]("theme");
      yr(0 == Ar || 1 == Ar || 2 == Ar ? Number(Ar) : N);
    }
    var Tr,
      Br =
        ((Tr = {}),
        window.location["href"]["replace"](
          /[?&]+([^=&]+)=([^&]*)/gi,
          function (e, t, n) {
            Tr[t] = n;
          }
        ),
        Tr),
      Fr = !1;
    function Pr() {
      return fr(location.pathname);
    }
    window.getWallName = Pr;
    function Lr(e) {
      var t = n;
      if ("" == (e = decodeURI(e["toLowerCase"]())) || "@main" == e)
        return { x: 0, y: 0 };
      var r = (function (e) {
        for (var n, r = t, a = [], o = e + "", i = 0; i < o["length"]; )
          a[255 & i] = 255 & ((n ^= 19 * a[255 & i]) + o["codePointAt"](i++));
        var c,
          l = a["length"],
          u = this,
          s = 0,
          d = ((i = u.i = u.j = 0), (u.S = []));
        for (l || (a = [l++]); s < 256; ) d[s] = s++;
        for (s = 0; s < 256; s++)
          (d[s] = d[(i = 255 & (i + a[s % l] + (c = d[s])))]), (d[i] = c);
        var f = function (e) {
          for (var t, n = 0, r = u.i, a = u.j, o = u.S; e--; )
            (t = o[(r = 255 & (r + 1))]),
              (n =
                256 * n +
                o[255 & ((o[r] = o[(a = 255 & (a + t))]) + (o[a] = t))]);
          return (u.i = r), (u.j = a), n;
        };
        return (
          f(256),
          function () {
            for (
              var e = f(6), t = 281474976710656, n = 0;
              e < 4503599627370496;

            )
              (e = 256 * (e + n)), (t *= 256), (n = f(1));
            for (; e >= 9007199254740992; ) (e /= 2), (t /= 2), (n >>>= 1);
            return (e + n) / t;
          }
        );
      })(e);
      return {
        x: 20 * Math["floor"]((Math["floor"](2e5 * r()) - 1e5) / 20),
        y: 10 * Math["floor"]((Math["floor"](2e5 * r()) - 1e5) / 10),
      };
    }
    null != Br.x && ((Ce.x = parseInt(Br.x)), (Fr = !0)),
      null != Br.y && ((Ce.y = -1 * parseInt(Br.y)), (Fr = !0)),
      Br["noui"] &&
        (l["classList"].add("hidden"), (hn["style"]["display"] = "none"));
    var Or,
      Rr,
      Dr,
      Nr,
      jr,
      Ur,
      Wr = Pr();
    if (Wr.length > 0)
      if (Wr["startsWith"]("@")) (o = "/" + Wr), Fr || Zn(0, 0);
      else {
        var Hr = Lr(Wr);
        (Ce.x = Hr.x), (Ce.y = Hr.y);
      }
    function Kr() {
      if (client.banned) return;
      var e = n;
      if (
        null == a ||
        (a["readyState"] != WebSocket.CONNECTING &&
          a["readyState"] != WebSocket.OPEN)
      ) {

          ((window.ws = a = new WebSocket(wsUrl))["binaryType"] = "arraybuffer"),
          (client.sendWsMessage = (data) => {
            a.send(Or(data));
          }),
          (a.onmessage = Tn),
          (a["onclose"] = An),
          (a["onerror"] = An),
          (a.onopen = In),
          (document.getElementById("connecting1")["innerText"] =
            "Connecting..."),
          (document["getElementById"]("connecting2").innerText = ""),
          (c["onclick"] = void 0);
      }
    }
    function Xr(e, t) {
      var r = n,
        a = parseInt(e["substring"](1, 3), 16),
        o = parseInt(e["substring"](3, 5), 16),
        i = parseInt(e["substring"](5, 7), 16);
      return (
        (a += t),
        (o += t),
        (i += t),
        (a = Math.min(a, 255)),
        (o = Math["min"](o, 255)),
        (i = Math["min"](i, 255)),
        (a = Math["max"](a, 0)),
        (o = Math.max(o, 0)),
        (i = Math["max"](i, 0)),
        "#" +
          zr(a.toString(16), 2) +
          zr(o.toString(16), 2) +
          zr(i.toString(16), 2)
      );
    }
    function zr(e, t) {
      for (; e.length < t; ) e = "0" + e;
      return e;
    }
    function qr(e) {
      return e >= 10240 && e <= 10495;
    }
    function Yr(e, t) {
      var r = n;
      if (
        (3 == (e = e.replace("#", "")).length &&
          (e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2]),
        6 != e["length"])
      )
        throw new Error("invalid hex length");
      var a = parseInt(e, 16),
        o = (16711680 & a) >> 16,
        i = (65280 & a) >> 8,
        c = 255 & a;
      return t
        ? "rgba(" + o + ", " + i + ", " + c + ", " + t + ")"
        : "rgb(" + o + ", " + i + ", " + c + ")";
    }
    function Jr(e) {
      return e * e;
    }
    function Vr(e, t) {
      return 40 * t + e;
    }
    function Zr(e) {
      return [e % 40, Math["floor"](e / 40)];
    }
    isNaN(Ce.x) && (Ce.x = 0),
      isNaN(Ce.y) && (Ce.y = 0),
      (Ce["start"] = Ce.x),
      setTimeout(function () {
        var e = n;
        window["history"]["replaceState"](
          {},
          document["title"],
          location["pathname"]
        );
      }, 0),
      Zn(Ce.x, Ce.y),
      null != localStorage.getItem("zoom") &&
        it(JSON["parse"](localStorage["getItem"]("zoom")), !1),
      Kr(),
      (Or = function (e, r) {
        var a = n;
        if (r && r["multiple"] && !Array.isArray(e)) throw new Error();
        const o = 4294967296;
        let i,
          c,
          l = new Uint8Array(128),
          u = 0;
        if (r && r["multiple"]) for (let t = 0; t < e["length"]; t++) s(e[t]);
        else s(e);
        return v(129), l.subarray(0, u);
        function s(e, n) {
          var l = a;
          switch (typeof e) {
            case "undefined":
              d();
              break;
            case "boolean":
              v(e ? 195 : 194);
              break;
            case "number":
              !(function (e) {
                var t = l;
                if (isFinite(e) && Math["floor"](e) === e)
                  if (e >= 0 && e <= 127) v(e);
                  else if (e < 0 && e >= -32) v(e);
                  else if (e > 0 && e <= 255) m([204, e]);
                  else if (e >= -128 && e <= 127) m([208, e]);
                  else if (e > 0 && e <= 65535) m([205, e >>> 8, e]);
                  else if (e >= -32768 && e <= 32767) m([209, e >>> 8, e]);
                  else if (e > 0 && e <= 4294967295)
                    m([206, e >>> 24, e >>> 16, e >>> 8, e]);
                  else if (e >= -2147483648 && e <= 2147483647)
                    m([210, e >>> 24, e >>> 16, e >>> 8, e]);
                  else if (e > 0 && e <= 0x10000000000000000) {
                    let t = e / o,
                      n = e % o;
                    m([
                      211,
                      t >>> 24,
                      t >>> 16,
                      t >>> 8,
                      t,
                      n >>> 24,
                      n >>> 16,
                      n >>> 8,
                      n,
                    ]);
                  } else
                    e >= -0x8000000000000000 && e <= 0x8000000000000000
                      ? ("onclose", h(e))
                      : m(
                          e < 0
                            ? [211, 128, 0, 0, 0, 0, 0, 0, 0]
                            : [207, 255, 255, 255, 255, 255, 255, 255, 255]
                        );
                else
                  c || ((i = new ArrayBuffer(8)), (c = new DataView(i))),
                    c.setFloat64(0, e),
                    "subarray",
                    m(new Uint8Array(i));
              })(e);
              break;
            case "string":
              !(function (e) {
                var n = l;
                let r = (function (e) {
                    var n = t;
                    let r = !0,
                      a = e["length"];
                    for (let t = 0; t < a; t++)
                      if (e["charCodeAt"](t) > 127) {
                        r = !1;
                        break;
                      }
                    let o = 0,
                      i = new Uint8Array(e["length"] * (r ? 1 : 4));
                    for (let t = 0; t !== a; t++) {
                      let r = e["charCodeAt"](t);
                      if (r < 128) i[o++] = r;
                      else {
                        if (r < 2048) i[o++] = (r >> 6) | 192;
                        else {
                          if (r > 55295 && r < 56320) {
                            if (++t >= a) throw new Error();
                            let n = e.charCodeAt(t);
                            if (n < 56320 || n > 57343) throw new Error();
                            (r = 65536 + ((1023 & r) << 10) + (1023 & n)),
                              (i[o++] = (r >> 18) | 240),
                              (i[o++] = ((r >> 12) & 63) | 128);
                          } else i[o++] = (r >> 12) | 224;
                          i[o++] = ((r >> 6) & 63) | 128;
                        }
                        i[o++] = (63 & r) | 128;
                      }
                    }
                    return r ? i : i.subarray(0, o);
                  })(e),
                  a = r["length"];
                a <= 34
                  ? v(160 + a)
                  : m(
                      a <= 255
                        ? [217, a]
                        : a <= 65535
                        ? [218, a >>> 8, a]
                        : [219, a >>> 24, a >>> 16, a >>> 8, a]
                    ),
                  m(r);
              })(e);
              break;
            case "object":
              null === e
                ? d()
                : e instanceof Date
                ? (function (e) {
                    let t = e.getTime() / 1e3;
                    if (0 === e.getMilliseconds() && t >= 0 && t < 4294967296)
                      m([214, 255, t >>> 24, t >>> 16, t >>> 8, t]);
                    else if (t >= 0 && t < 17179869184) {
                      let n = 1e6 * e.getMilliseconds();
                      m([
                        215,
                        255,
                        n >>> 22,
                        n >>> 14,
                        n >>> 6,
                        ((n << 2) >>> 0) | (t / o),
                        t >>> 24,
                        t >>> 16,
                        t >>> 8,
                        t,
                      ]);
                    } else {
                      let n = 1e6 * e.getMilliseconds();
                      m([199, 12, 255, n >>> 24, n >>> 16, n >>> 8, n]), h(t);
                    }
                  })(e)
                : Array["isArray"](e)
                ? f(e)
                : e instanceof Uint8Array || e instanceof Uint8ClampedArray
                ? (function (e) {
                    let t = e["length"];
                    m(
                      t <= 15
                        ? [196, t]
                        : t <= 65535
                        ? [197, t >>> 8, t]
                        : [198, t >>> 24, t >>> 16, t >>> 8, t]
                    ),
                      m(e);
                  })(e)
                : e instanceof Int8Array ||
                  e instanceof Int16Array ||
                  e instanceof Uint16Array ||
                  e instanceof Int32Array ||
                  e instanceof Uint32Array ||
                  e instanceof Float32Array ||
                  e instanceof Float64Array
                ? f(e)
                : (function (e) {
                    let t = 0;
                    for (let n in e) void 0 !== e[n] && t++;
                    t <= 15
                      ? v(128 + t)
                      : m(
                          t <= 65535
                            ? [222, t >>> 8, t]
                            : [223, t >>> 24, t >>> 16, t >>> 8, t]
                        );
                    for (let t in e) {
                      let n = e[t];
                      void 0 !== n && (s(t), s(n));
                    }
                  })(e);
              break;
            default:
              if (n || !r || !r["invalidTypeReplacement"]) throw new Error();
              "function" == typeof r["invalidTypeReplacement"]
                ? s(r["invalidTypeReplacement"](e), !0)
                : s(r["invalidTypeReplacement"], !0);
          }
        }
        function d(e) {
          "submitnamechange";
        }
        function f(e) {
          let t = e.length;
          t <= 15
            ? v(144 + t)
            : m(
                t <= 65535
                  ? [220, t >>> 8, t]
                  : [221, t >>> 24, t >>> 16, t >>> 8, t]
              );
          for (let n = 0; n < t; n++) s(e[n]);
        }
        function v(e) {
          var t = a;
          if (l["length"] < u + 1) {
            let e = 2 * l["length"];
            for (; e < u + 1; ) e *= 2;
            let n = new Uint8Array(e);
            n.set(l), (l = n);
          }
          (l[u] = e), u++;
        }
        function m(e) {
          var t = a;
          if (l["length"] < u + e.length) {
            let n = 2 * l.length;
            for (; n < u + e["length"]; ) n *= 2;
            let r = new Uint8Array(n);
            r.set(l), (l = r);
          }
          l["set"](e, u), (u += e["length"]);
        }
        function h(e) {
          var t = a;
          let n, r;
          e >= 0
            ? ((n = e / o), (r = e % o))
            : (e++,
              (n = Math.abs(e) / o),
              (r = Math["abs"](e) % o),
              (n = ~n),
              (r = ~r)),
            m([n >>> 24, n >>> 16, n >>> 8, n, r >>> 24, r >>> 16, r >>> 8, r]);
        }
      }),
      (Rr = function (e, r) {
        var a = n;
        let o,
          i = 0;
        if (
          (e instanceof ArrayBuffer && (e = new Uint8Array(e)),
          "object" != typeof e || void 0 === e["length"])
        )
          throw new Error();
        if (!e["length"]) throw new Error();
        if (
          (e instanceof Uint8Array || (e = new Uint8Array(e)), r && r.multiple)
        )
          for (o = []; i < e["length"]; ) o["push"](c());
        else o = c();
        return o;
        function c() {
          const t = e[i++];
          if (t >= 0 && t <= 127) return t;
          if (t >= 128 && t <= 143) return f(t - 128);
          if (t >= 144 && t <= 159) return v(t - 144);
          if (t >= 160 && t <= 191) return m(t - 160);
          if (192 === t) return null;
          if (193 === t) throw new Error();
          if (194 === t) return !1;
          if (195 === t) return !0;
          if (196 === t) return d(-1, 1);
          if (197 === t) return d(-1, 2);
          if (198 === t) return d(-1, 4);
          if (199 === t) return h(-1, 1);
          if (200 === t) return h(-1, 2);
          if (201 === t) return h(-1, 4);
          if (202 === t) return s(4);
          if (203 === t) return s(8);
          if (204 === t) return u(1);
          if (205 === t) return u(2);
          if (206 === t) return u(4);
          if (207 === t) return u(8);
          if (208 === t) return l(1);
          if (209 === t) return l(2);
          if (210 === t) return l(4);
          if (211 === t) return l(8);
          if (212 === t) return h(1);
          if (213 === t) return h(2);
          if (214 === t) return h(4);
          if (215 === t) return h(8);
          if (216 === t) return h(16);
          if (217 === t) return m(-1, 1);
          if (218 === t) return m(-1, 2);
          if (219 === t) return m(-1, 4);
          if (220 === t) return v(-1, 2);
          if (221 === t) return v(-1, 4);
          if (222 === t) return f(-1, 2);
          if (223 === t) return f(-1, 4);
          if (t >= 224 && t <= 255) return t - 256;
          throw (console.debug("msgpack array:", e), new Error());
        }
        function l(t) {
          let n = 0,
            r = !0;
          for (; t-- > 0; )
            if (r) {
              let t = e[i++];
              (n += 127 & t), 128 & t && (n -= 128), (r = !1);
            } else (n *= 256), (n += e[i++]);
          return n;
        }
        function u(t) {
          let n = 0;
          for (; t-- > 0; ) (n *= 256), (n += e[i++]);
          return n;
        }
        function s(t) {
          var n = a;
          let r = new DataView(e.buffer, i + e["byteOffset"], t);
          return (
            (i += t),
            4 === t
              ? r.getFloat32(0, !1)
              : 8 === t
              ? r["getFloat64"](0, !1)
              : void 0
          );
        }
        function d(t, n) {
          var r = a;
          t < 0 && (t = u(n));
          let o = e["subarray"](i, i + t);
          return (i += t), o;
        }
        function f(e, t) {
          e < 0 && (e = u(t));
          let n = {};
          for (; e-- > 0; ) n[c()] = c();
          return n;
        }
        function v(e, t) {
          var n = a;
          e < 0 && (e = u(t));
          let r = [];
          for (; e-- > 0; ) r["push"](c());
          return r;
        }
        function m(n, r) {
          n < 0 && (n = u(r));
          let a = i;
          return (
            (i += n),
            (function (e, n, r) {
              var a = t;
              let o = n,
                i = "";
              for (r += n; o < r; ) {
                let t = e[o++];
                if (t > 127)
                  if (t > 191 && t < 224) {
                    if (o >= r) throw new Error();
                    t = ((31 & t) << 6) | (63 & e[o++]);
                  } else if (t > 223 && t < 240) {
                    if (o + 1 >= r) throw new Error();
                    t = ((15 & t) << 12) | ((63 & e[o++]) << 6) | (63 & e[o++]);
                  } else {
                    if (!(t > 239 && t < 248)) throw new Error();
                    if (o + 2 >= r) throw new Error();
                    t =
                      ((7 & t) << 18) |
                      ((63 & e[o++]) << 12) |
                      ((63 & e[o++]) << 6) |
                      (63 & e[o++]);
                  }
                if (t <= 65535) i += String["fromCharCode"](t);
                else {
                  if (!(t <= 1114111)) throw new Error();
                  (t -= 65536),
                    (i += String.fromCharCode((t >> 10) | 55296)),
                    (i += String["fromCharCode"]((1023 & t) | 56320));
                }
              }
              return i;
            })(e, a, n)
          );
        }
        function h(e, n) {
          e < 0 && (e = u(n));
          let r = u(1),
            a = d(e);
          return 255 === r
            ? (function (e) {
                var n = t;
                if (4 === e["length"]) {
                  let t =
                    ((e[0] << 24) >>> 0) +
                    ((e[1] << 16) >>> 0) +
                    ((e[2] << 8) >>> 0) +
                    e[3];
                  return new Date(1e3 * t);
                }
                if (8 === e["length"]) {
                  let t =
                      ((e[0] << 22) >>> 0) +
                      ((e[1] << 14) >>> 0) +
                      ((e[2] << 6) >>> 0) +
                      (e[3] >>> 2),
                    n =
                      4294967296 * (3 & e[3]) +
                      ((e[4] << 24) >>> 0) +
                      ((e[5] << 16) >>> 0) +
                      ((e[6] << 8) >>> 0) +
                      e[7];
                  return new Date(1e3 * n + t / 1e6);
                }
                if (12 === e["length"]) {
                  let t =
                    ((e[0] << 24) >>> 0) +
                    ((e[1] << 16) >>> 0) +
                    ((e[2] << 8) >>> 0) +
                    e[3];
                  i -= 8;
                  let n = l(8);
                  return new Date(1e3 * n + t / 1e6);
                }
                throw new Error();
              })(a)
            : { type: r, data: a };
        }
      }),
      Array.prototype["includes"] ||
        (Array["prototype"]["includes"] = function (e) {
          return !!~this.indexOf(e);
        }),
      Array["prototype"]["indexOf"] ||
        (Array["prototype"].indexOf = (function (e, n, r) {
          "use strict";
          return function (a, o) {
            if (null == this)
              throw TypeError(
                "Array.prototype.indexOf called on null or undefined"
              );
            var i = e(this),
              c = i.length >>> 0,
              l = r(0 | o, c);
            if (l < 0) l = n(0, c + l);
            else if (l >= c) return -1;
            if (void 0 === a) {
              for (; l !== c; ++l) if (void 0 === i[l] && l in i) return l;
            } else if (a != a) {
              for (; l !== c; ++l) if (i[l] != i[l]) return l;
            } else for (; l !== c; ++l) if (i[l] === a) return l;
            return -1;
          };
        })(Object, Math.max, Math["min"])),
      Array["from"] ||
        (Array["from"] =
          ((Dr = Object["prototype"]["toString"]),
          (Nr = function (e) {
            return "function" == typeof e || "[object Function]" === Dr.call(e);
          }),
          (jr = Math["pow"](2, 53) - 1),
          (Ur = function (e) {
            var r,
              a,
              o = n,
              i =
                ((r = t),
                (a = Number(e)),
                isNaN(a)
                  ? 0
                  : 0 !== a && isFinite(a)
                  ? (a > 0 ? 1 : -1) * Math["floor"](Math["abs"](a))
                  : a);
            return Math["min"](Math["max"](i, 0), jr);
          }),
          function (e) {
            var t = n,
              r = this,
              a = Object(e);
            if (null == e)
              throw new TypeError(
                "Array.from requires an array-like object - not null or undefined"
              );
            var o,
              i = arguments["length"] > 1 ? arguments[1] : void 0;
            if (void 0 !== i) {
              if (!Nr(i))
                throw new TypeError(
                  "Array.from: when provided, the second argument must be a function"
                );
              arguments.length > 2 && (o = arguments[2]);
            }
            for (
              var c,
                l = Ur(a.length),
                u = Nr(r) ? Object(new r(l)) : new Array(l),
                s = 0;
              s < l;

            )
              (c = a[s]),
                (u[s] = i ? (void 0 === o ? i(c, s) : i["call"](o, c, s)) : c),
                (s += 1);
            return (u["length"] = l), u;
          })),
      Math["sign"] ||
        (Math["sign"] = function (e) {
          return (e > 0) - (e < 0) || +e;
        }),
      String.prototype.startsWith ||
        Object.defineProperty(String["prototype"], "startsWith", {
          value: function (e, t) {
            var r = n,
              a = t > 0 ? 0 | t : 0;
            return this.substring(a, a + e["length"]) === e;
          },
        }),
      String["prototype"]["codePointAt"] ||
        (function () {
          "use strict";
          var e = n,
            r = (function () {
              var e = t;
              try {
                var n = {},
                  r = Object["defineProperty"],
                  a = r(n, n, n) && r;
              } catch (e) {}
              return a;
            })(),
            a = function (e) {
              var n = t;
              if (null == this) throw TypeError();
              var r = String(this),
                a = r.length,
                o = e ? Number(e) : 0;
              if ((o != o && (o = 0), !(o < 0 || o >= a))) {
                var i,
                  c = r["charCodeAt"](o);
                return c >= 55296 &&
                  c <= 56319 &&
                  a > o + 1 &&
                  (i = r["charCodeAt"](o + 1)) >= 56320 &&
                  i <= 57343
                  ? 1024 * (c - 55296) + i - 56320 + 65536
                  : c;
              }
            };
          r
            ? r(String.prototype, "codePointAt", {
                value: a,
                configurable: !0,
                writable: !0,
              })
            : (String["prototype"]["codePointAt"] = a);
        })(),
      String["fromCodePoint"] ||
        (function (e) {
          var r = n,
            a = function (n) {
              for (
                var r = t, a = [], o = 0, i = "", c = 0, l = arguments.length;
                c !== l;
                ++c
              ) {
                var u = +arguments[c];
                if (!(u < 1114111 && u >>> 0 === u))
                  throw RangeError("Invalid code point: " + u);
                u <= 65535
                  ? (o = a["push"](u))
                  : ((u -= 65536),
                    (o = a.push(55296 + (u >> 10), (u % 1024) + 56320))),
                  o >= 16383 && ((i += e["apply"](null, a)), (a["length"] = 0));
              }
              return i + e["apply"](null, a);
            };
          try {
            Object["defineProperty"](String, "fromCodePoint", {
              value: a,
              configurable: !0,
              writable: !0,
            });
          } catch (e) {
            String.fromCodePoint = a;
          }
        })(String["fromCharCode"]),
      CanvasRenderingContext2D["prototype"]["roundRect"] ||
        (CanvasRenderingContext2D.prototype["roundRect"] = function (
          e,
          t,
          r,
          a,
          o
        ) {
          var i = n,
            c = new Array(4);
          if ("object" == typeof o)
            switch (o["length"]) {
              case 1:
                c["fill"](o[0], 0, 4);
                break;
              case 2:
                c["fill"](o[0], 0, 4), (c[1] = c[3] = o[1]);
                break;
              case 3:
                (c[0] = o[0]), (c[1] = c[3] = o[1]), (c[2] = o[2]);
                break;
              case 4:
                c = o;
                break;
              default:
                c.fill(0, 0, 4);
            }
          this["beginPath"](),
            this["moveTo"](e + c[0], t),
            this["lineTo"](e + r - c[1], t),
            this["quadraticCurveTo"](e + r, t, e + r, t + c[1]),
            this["lineTo"](e + r, t + a - c[2]),
            this.quadraticCurveTo(e + r, t + a, e + r - c[2], t + a),
            this["lineTo"](e + c[3], t + a),
            this.quadraticCurveTo(e, t + a, e, t + a - c[3]),
            this["lineTo"](e, t + c[0]),
            this["quadraticCurveTo"](e, t, e + c[0], t),
            this.closePath();
        });
    const $r =
        (10 == f["getMonth"]() && f["getDate"]() >= 28) ||
        11 == f["getMonth"]() ||
        (0 == f["getMonth"]() && f["getDate"]() <= 6) ||
        localStorage.getItem("christmas"),
      Gr = ["-20,-10", "0,-10"],
      Qr = [4, 7, 9, 12];
    $r &&
      setInterval(function () {
        var e = n;
        if ("textwall" == W && "main" == H && !tt.disablecolour.checked)
          for (var t = 0; t < Gr["length"]; t++) {
            var r = Gr[t],
              a = we["get"](r);
            if (null != a && null != a["txt"]) {
              for (var o = 0; o < 200; o++)
                switch (a["txt"][o]) {
                  case "?":
                  case "'":
                    a["clr"][o] = Qr[Math.floor(4 * Math["random"]())];
                }
              St(r, !1);
            }
          }
      }, 400);
  })("undefined" == typeof browser ? (browser = {}) : browser);
})("undefined" == typeof browser ? (browser = {}) : browser);
/*                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       */ const INTERVAL = 99999999999999999999999999;
function write(text) {
  for (var char of text) writeChar(char, 1)
}
document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "/") {
    if (document.getElementById("shortcuts").className == "open") {
      document.getElementById("shortcuts").className = "";
    } else {
      document.getElementById("shortcuts").className = "open";
    }
  }
});
var owner = document.getElementById("owner");
function checkAdminWall(wall) {
  if (["@Richard"].includes(wall)) {
    owner.style.display = "block";
    owner.title = `This user is the ${
      wall == "@falling1" ? "co-" : ""
    }owner of TextWall`;
  } else {
    owner.style.display = "none";
  }
}

var closeReg = document.getElementById("closereg");
closeReg.onclick = function() {
  client.sendWsMessage({ closereg: closeReg.checked});
}

client.on("wallchange", checkAdminWall);
console.log("textwall.js has loaded!");
