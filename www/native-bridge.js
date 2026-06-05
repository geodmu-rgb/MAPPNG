// Capacitor (APK) дотор ажиллаж байвал төхөөрөмжийн жинхэнэ GPS-ийг ашиглана.
// Хөтөч дээр (PWA) бол энэ файл юу ч хийхгүй — navigator.geolocation хэвээрээ ажиллана.
(function () {
  if (!(window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform())) return;
  // Зөвшөөрлийг урьдчилан асууя
  try {
    var G0 = Capacitor.Plugins && Capacitor.Plugins.Geolocation;
    if (G0 && G0.requestPermissions) G0.requestPermissions().catch(function () {});
  } catch (e) {}
  // navigator.geolocation.getCurrentPosition-г Capacitor-ийн native plugin-аар орлуулна
  navigator.geolocation = navigator.geolocation || {};
  navigator.geolocation.getCurrentPosition = function (success, error, opts) {
    var G = Capacitor.Plugins && Capacitor.Plugins.Geolocation;
    if (!G) { if (error) error({ code: 2, message: 'Geolocation plugin олдсонгүй' }); return; }
    G.getCurrentPosition({ enableHighAccuracy: true, timeout: (opts && opts.timeout) || 15000 })
      .then(function (pos) { success({ coords: pos.coords, timestamp: pos.timestamp }); })
      .catch(function (e) { if (error) error({ code: 2, message: (e && e.message) || 'GPS алдаа' }); });
  };
})();
