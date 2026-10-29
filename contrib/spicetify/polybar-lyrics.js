// Polybar Music Spotify Lyrics Bridge
// Fetches official Spotify color-lyrics inside Spotify client and forwards to Polybar music bridge
(() => {
    "use strict";
    if (globalThis.__polybarLyricsBridge) {
        try { globalThis.__polybarLyricsBridge.dispose(); } catch (_) {}
    }

    let disposed = false;
    let lastUri = "";
    let checkInterval = null;
    let inFlightId = "";

    async function sendLyrics(uri) {
        if (!uri || uri === lastUri) return;
        lastUri = uri;
        const id = uri.split(":")[2];
        if (!id) return;
        inFlightId = id;

        try {
            const baseURL = "https://spclient.wg.spotify.com/color-lyrics/v2/track/";
            const resp = await Spicetify.CosmosAsync.get(`${baseURL + id}?format=json&vocalRemoval=false&market=from_token`);
            if (disposed || inFlightId !== id) return;

            if (resp && resp.lyrics && resp.lyrics.lines) {
                const lines = resp.lyrics.lines.map(l => ({
                    time: (l.startTimeMs || 0) / 1000,
                    words: l.words || ""
                }));
                fetch("http://127.0.0.1:8974/lyrics", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        uri: uri,
                        id: id,
                        syncType: resp.lyrics.syncType || "LINE_SYNCED",
                        lines: lines
                    })
                }).catch(() => {});
            } else {
                fetch("http://127.0.0.1:8974/lyrics", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ uri: uri, id: id, syncType: "NONE", lines: [] })
                }).catch(() => {});
            }
        } catch (e) {
            if (disposed || inFlightId !== id) return;
            fetch("http://127.0.0.1:8974/lyrics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uri: uri, id: id, syncType: "NONE", lines: [] })
            }).catch(() => {});
        }
    }

    function checkAndSend(immediateUri) {
        if (disposed) return;
        const uri = immediateUri || Spicetify.Player.data?.item?.uri;
        if (uri && uri !== lastUri) {
            void sendLyrics(uri);
        }
    }

    function onSongChange(event) {
        if (disposed) return;
        const uri = event?.data?.item?.uri || event?.data?.track?.uri || Spicetify.Player.data?.item?.uri;
        checkAndSend(uri);
        setTimeout(() => checkAndSend(), 50);
        setTimeout(() => checkAndSend(), 150);
        setTimeout(() => checkAndSend(), 350);
    }

    function init() {
        if (!globalThis.Spicetify?.Player?.addEventListener || !globalThis.Spicetify?.CosmosAsync) {
            setTimeout(init, 200);
            return;
        }

        Spicetify.Player.addEventListener("songchange", onSongChange);
        Spicetify.Player.addEventListener("playerstatechange", onSongChange);
        Spicetify.Player.addEventListener("onplaypause", onSongChange);

        checkInterval = setInterval(() => {
            checkAndSend();
        }, 250);

        onSongChange();
    }

    globalThis.__polybarLyricsBridge = {
        dispose() {
            disposed = true;
            if (checkInterval) clearInterval(checkInterval);
            globalThis.Spicetify?.Player?.removeEventListener?.("songchange", onSongChange);
            globalThis.Spicetify?.Player?.removeEventListener?.("playerstatechange", onSongChange);
            globalThis.Spicetify?.Player?.removeEventListener?.("onplaypause", onSongChange);
        }
    };

    init();
})();
