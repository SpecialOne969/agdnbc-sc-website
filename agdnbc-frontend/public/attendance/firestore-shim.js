/*
 * Firestore-compatible shim for the self-hosted Bible School Attendance app.
 * Replaces Firebase (Firestore + Auth) with calls to the AGDNBC NestJS backend,
 * so the original attendance app runs unchanged against our own Postgres database.
 *
 * Exposes globals: window.db, window.auth, window.firebase
 */
(function () {
  'use strict';

  // ── Config ────────────────────────────────────────────────────────────────
  // API base is passed by the React wrapper as ?api=... ; falls back to localhost.
  var params = new URLSearchParams(window.location.search);
  var API_BASE =
    params.get('api') ||
    window.ATTENDANCE_API_BASE ||
    (location.hostname === 'localhost' || location.hostname === '127.0.0.1'
      ? 'http://localhost:3000/api'
      : '/api');

  function readAuth() {
    try {
      return JSON.parse(localStorage.getItem('agdnbc-auth') || 'null');
    } catch (e) {
      return null;
    }
  }
  function getToken() {
    var a = readAuth();
    return (a && a.state && a.state.token) || null;
  }
  function getAdminEmail() {
    var a = readAuth();
    return (a && a.state && a.state.user && (a.state.user.name || a.state.user.email)) || 'admin';
  }

  function req(method, path, body) {
    var headers = { 'Content-Type': 'application/json' };
    var t = getToken();
    if (t) headers['Authorization'] = 'Bearer ' + t;
    return fetch(API_BASE + '/attendance-data' + path, {
      method: method,
      headers: headers,
      body: body != null ? JSON.stringify(body) : undefined,
    }).then(function (r) {
      if (!r.ok) {
        return r.text().then(function (txt) {
          throw new Error('HTTP ' + r.status + ' ' + txt);
        });
      }
      if (r.status === 204) return null;
      return r.text().then(function (t) { return t ? JSON.parse(t) : null; });
    });
  }

  // ── Sentinel helpers (serverTimestamp / arrayUnion) ─────────────────────────
  function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); }

  function resolveForWrite(data, existing) {
    existing = existing || {};
    var out = {};
    Object.keys(data || {}).forEach(function (k) {
      var v = data[k];
      if (isObj(v) && v.__op === 'serverTimestamp') {
        out[k] = { __ts: new Date().toISOString() };
      } else if (isObj(v) && v.__op === 'arrayUnion') {
        var cur = Array.isArray(existing[k]) ? existing[k].slice() : [];
        v.elements.forEach(function (el) {
          var dup = cur.some(function (c) { return JSON.stringify(c) === JSON.stringify(el); });
          if (!dup) cur.push(el);
        });
        out[k] = cur;
      } else {
        out[k] = v;
      }
    });
    return out;
  }
  function hasArrayUnion(data) {
    return Object.keys(data || {}).some(function (k) {
      return isObj(data[k]) && data[k].__op === 'arrayUnion';
    });
  }

  // Revive stored { __ts } markers into Firestore-like Timestamp objects on read.
  function revive(value) {
    if (Array.isArray(value)) return value.map(revive);
    if (isObj(value)) {
      if (typeof value.__ts === 'string') {
        var d = new Date(value.__ts);
        return {
          toDate: function () { return d; },
          toMillis: function () { return d.getTime(); },
          seconds: Math.floor(d.getTime() / 1000),
        };
      }
      var o = {};
      Object.keys(value).forEach(function (k) { o[k] = revive(value[k]); });
      return o;
    }
    return value;
  }

  // ── Query object (Firestore-like, client-side filtering) ────────────────────
  function makeQuery(collection, filters, orders, lim) {
    filters = filters || [];
    orders = orders || [];
    return {
      where: function (field, op, val) {
        return makeQuery(collection, filters.concat([[field, op, val]]), orders, lim);
      },
      orderBy: function (field, dir) {
        return makeQuery(collection, filters, orders.concat([[field, dir || 'asc']]), lim);
      },
      limit: function (n) { return makeQuery(collection, filters, orders, n); },
      doc: function (id) { return makeDoc(collection, id); },
      add: function (data) {
        return req('POST', '/' + collection, resolveForWrite(data, {})).then(function (res) {
          return makeDoc(collection, res.id);
        });
      },
      get: function () {
        return req('GET', '/' + collection).then(function (docs) {
          var rows = (docs || []).map(function (d) { return { id: d.id, raw: d.data || {} }; });
          filters.forEach(function (f) {
            var field = f[0], op = f[1], val = f[2];
            rows = rows.filter(function (row) {
              var cell = row.raw[field];
              switch (op) {
                case '==': return cell === val;
                case '!=': return cell !== val;
                case 'in': return Array.isArray(val) && val.indexOf(cell) !== -1;
                case '>': return cell > val;
                case '>=': return cell >= val;
                case '<': return cell < val;
                case '<=': return cell <= val;
                default: return true;
              }
            });
          });
          orders.forEach(function (o) {
            var field = o[0], dir = o[1];
            rows.sort(function (a, b) {
              var av = a.raw[field], bv = b.raw[field];
              if (av === bv) return 0;
              var cmp = av > bv ? 1 : -1;
              return dir === 'desc' ? -cmp : cmp;
            });
          });
          if (lim != null) rows = rows.slice(0, lim);
          var snap = rows.map(function (row) {
            var data = revive(row.raw);
            return {
              id: row.id,
              exists: true,
              data: function () { return data; },
              ref: makeDoc(collection, row.id),
            };
          });
          return {
            size: snap.length,
            empty: snap.length === 0,
            docs: snap,
            forEach: function (cb) { snap.forEach(cb); },
          };
        });
      },
    };
  }

  function makeDoc(collection, id) {
    return {
      id: id,
      get: function () {
        return req('GET', '/' + collection + '/' + id)
          .then(function (res) {
            if (!res) return { exists: false, id: id, data: function () { return undefined; } };
            var data = revive(res.data);
            return { exists: true, id: res.id, data: function () { return data; } };
          })
          .catch(function () {
            return { exists: false, id: id, data: function () { return undefined; } };
          });
      },
      set: function (data) {
        return req('PUT', '/' + collection + '/' + id, resolveForWrite(data, {}));
      },
      update: function (data) {
        if (hasArrayUnion(data)) {
          return req('GET', '/' + collection + '/' + id).then(function (res) {
            var existing = (res && res.data) || {};
            return req('PATCH', '/' + collection + '/' + id, resolveForWrite(data, existing));
          });
        }
        return req('PATCH', '/' + collection + '/' + id, resolveForWrite(data, {}));
      },
      delete: function () {
        return req('DELETE', '/' + collection + '/' + id);
      },
    };
  }

  var db = {
    collection: function (name) { return makeQuery(name, [], [], null); },
  };

  // ── Auth shim (mirrors the React admin session) ─────────────────────────────
  var auth = {
    onAuthStateChanged: function (cb) {
      setTimeout(function () {
        var t = getToken();
        cb(t ? { email: getAdminEmail() } : null);
      }, 0);
      return function () {};
    },
    signInWithEmailAndPassword: function (email, password) {
      return fetch(API_BASE + '/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password }),
      })
        .then(function (r) {
          if (!r.ok) {
            var e = new Error('login failed');
            e.code = r.status === 401 ? 'auth/wrong-password' : 'auth/internal-error';
            throw e;
          }
          return r.json();
        })
        .then(function (res) {
          localStorage.setItem(
            'agdnbc-auth',
            JSON.stringify({ state: { user: res.user, token: res.token }, version: 0 })
          );
          return { user: { email: email } };
        });
    },
    signOut: function () {
      // Do NOT clear the shared admin session; just return to the attendance landing.
      return Promise.resolve().then(function () { window.location.href = 'index.html'; });
    },
  };

  // ── firebase namespace (only what the app touches) ──────────────────────────
  var firebase = {
    apps: [{}],
    firestore: function () { return db; },
  };
  firebase.firestore.FieldValue = {
    serverTimestamp: function () { return { __op: 'serverTimestamp' }; },
    arrayUnion: function () {
      return { __op: 'arrayUnion', elements: Array.prototype.slice.call(arguments) };
    },
  };

  window.db = db;
  window.auth = auth;
  window.firebase = firebase;
})();
