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

    async function sendLyrics(uri) {
        if (!uri || uri === lastUri) return;
        lastUri = uri;
        const id = uri.split(":")[2];
        if (!id) return;

        try {
            const baseURL = "https://spclient.wg.spotify.com/color-lyrics/v2/track/";
            const resp = await Spicetify.CosmosAsync.get(`${baseURL + id}?format=json&vocalRemoval=false&market=from_token`);
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
            fetch("http://127.0.0.1:8974/lyrics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uri: uri, id: id, syncType: "NONE", lines: [] })
            }).catch(() => {});
        }
    }

    function onSongChange() {
        if (disposed) return;
        const item = Spicetify.Player.data?.item;
        if (item?.uri) {
            void sendLyrics(item.uri);
        }
    }

    function init() {
        if (!globalThis.Spicetify?.Player?.addEventListener || !globalThis.Spicetify?.CosmosAsync) {
            setTimeout(init, 500);
            return;
        }

        Spicetify.Player.addEventListener("songchange", onSongChange);
        checkInterval = setInterval(() => {
            const item = Spicetify.Player.data?.item;
            if (item?.uri && item.uri !== lastUri) {
                void sendLyrics(item.uri);
            }
        }, 1500);

        onSongChange();
    }

    globalThis.__polybarLyricsBridge = {
        dispose() {
            disposed = true;
            if (checkInterval) clearInterval(checkInterval);
            globalThis.Spicetify?.Player?.removeEventListener?.("songchange", onSongChange);
        }
    };

    init();
})();
