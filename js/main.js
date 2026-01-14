/* --- MUSIC PLAYER CODE (Injected to prevent CSS conflicts) --- */
const musicPlayerHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.min.js"><\/script>
    <style>
        :root {
            --bg-oled: #050505;
            --accent-red: #ff3333;
            --accent-glow: rgba(255, 51, 51, 0.4);
            --glass: rgba(20, 20, 20, 0.7);
            --border: rgba(255, 255, 255, 0.1);
            --text: #ffffff;
            --text-dim: #a0a0a0;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', -apple-system, system-ui, sans-serif; user-select: none; }
        body { background-color: var(--bg-oled); color: var(--text); height: 100vh; width: 100vw; overflow: hidden; display: flex; align-items: center; justify-content: center; }

        .ambient-glow {
            position: absolute; width: 100vw; height: 100vh;
            background: radial-gradient(circle at 50% 50%, rgba(255, 51, 51, 0.08) 0%, transparent 70%);
            z-index: 0; pointer-events: none;
        }

        .nexus-shell {
            width: 100%; height: 100%;
            background: var(--glass);
            backdrop-filter: blur(60px) saturate(160%);
            -webkit-backdrop-filter: blur(60px) saturate(160%);
            display: flex; overflow: hidden; position: relative; z-index: 10;
        }

        .zone-left { flex: 1.1; padding: 40px; display: flex; flex-direction: column; justify-content: space-between; border-right: 1px solid var(--border); }
        .zone-right { flex: 0.9; display: flex; flex-direction: column; background: rgba(0,0,0,0.2); }

        .art-wrapper {
            width: 100%; aspect-ratio: 1/1; border-radius: 16px; overflow: hidden;
            box-shadow: 0 25px 60px rgba(0,0,0,0.8); position: relative;
            border: 1px solid var(--border); background: #000;
        }

        #cover-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        #video-element { width: 100%; height: 100%; object-fit: contain; display: none; }

        .track-info { margin-top: 25px; }
        .track-title { font-size: 2.2rem; font-weight: 800; letter-spacing: -1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .track-artist { font-size: 1rem; color: var(--accent-red); font-weight: 700; margin-top: 4px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.9; }

        .controls-stack { margin-top: auto; display: flex; flex-direction: column; gap: 20px; }

        input[type=range] { -webkit-appearance: none; width: 100%; background: transparent; height: 20px; cursor: pointer; }
        input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 14px; width: 14px; border-radius: 50%; background: var(--accent-red); margin-top: -5px; box-shadow: 0 0 12px var(--accent-glow); transition: 0.2s; }
        input[type=range]:active::-webkit-slider-thumb { transform: scale(1.3); }

        .time-display { display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-dim); font-family: 'Monaco', monospace; margin-top: 6px; }

        .main-buttons { display: flex; justify-content: center; align-items: center; gap: 35px; }
        .btn { background: none; border: none; color: var(--text); font-size: 1.4rem; cursor: pointer; transition: 0.3s; opacity: 0.8; }
        .btn:hover { color: var(--accent-red); opacity: 1; transform: scale(1.1); }
        .btn-play { width: 65px; height: 65px; border-radius: 50%; background: var(--accent-red); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; opacity: 1; box-shadow: 0 10px 25px var(--accent-glow); }

        .bass-module { background: rgba(255,255,255,0.03); border-radius: 14px; padding: 18px; border: 1px solid var(--border); }
        .bass-header { display: flex; justify-content: space-between; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; color: var(--text-dim); }

        .header-bar { padding: 30px; display: flex; justify-content: space-between; align-items: center; }
        .brand { font-weight: 900; letter-spacing: 3px; font-size: 1.1rem; }
        .brand span { color: var(--accent-red); }

        .file-upload-label { background: var(--accent-red); color: white; padding: 10px 22px; border-radius: 30px; font-size: 0.75rem; cursor: pointer; transition: 0.3s; font-weight: 700; box-shadow: 0 5px 15px var(--accent-glow); }
        .file-upload-label:hover { transform: translateY(-2px); filter: brightness(1.1); }
        #file-input { display: none; }

        #visualizer { width: 100%; height: 100%; flex: 1; }
    </style>
</head>
<body>
    <div class="ambient-glow"></div>
    <div class="nexus-shell">
        <div class="zone-left">
            <div class="art-wrapper">
                <img id="cover-img" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">
                <video id="video-element" crossorigin="anonymous" playsinline></video>
            </div>
            <div class="track-info">
                <div id="title-display" class="track-title">NexusX Studio</div>
                <div id="artist-display" class="track-artist">System Ready</div>
            </div>
            <div class="controls-stack">
                <div class="main-buttons">
                    <button class="btn" id="btn-prev"><i class="fas fa-backward"></i></button>
                    <button class="btn btn-play" id="btn-play"><i class="fas fa-play"></i></button>
                    <button class="btn" id="btn-next"><i class="fas fa-forward"></i></button>
                </div>
                <div>
                    <input type="range" id="seek-slider" value="0" max="1000">
                    <div class="time-display"><span id="curr-time">0:00</span><span id="dur-time">0:00</span></div>
                </div>
                <div class="bass-module">
                    <div class="bass-header"><span>Sub-Bass Enhancement</span><span id="bass-val" style="color:var(--accent-red)">0%</span></div>
                    <input type="range" id="bass-slider" min="0" max="100" value="0">
                </div>
            </div>
        </div>
        <div class="zone-right">
            <div class="header-bar">
                <div class="brand">NEXUS<span>STUDIO</span></div>
                <label for="file-input" class="file-upload-label"><i class="fas fa-plus"></i> ADD MEDIA</label>
                <input type="file" id="file-input" accept="audio/*, video/*">
            </div>
            <canvas id="visualizer"></canvas>
        </div>
    </div>

    <script>
        class NexusPlayer {
            constructor() {
                this.audioEl = new Audio();
                this.videoEl = document.getElementById('video-element');
                this.activeMedia = this.audioEl;

                this.audioCtx = null;
                this.nodes = {}; // Store audio nodes

                this.ui = {
                    playBtn: document.getElementById('btn-play'),
                    playIcon: document.querySelector('#btn-play i'),
                    seek: document.getElementById('seek-slider'),
                    bass: document.getElementById('bass-slider'),
                    bassVal: document.getElementById('bass-val'),
                    currTime: document.getElementById('curr-time'),
                    durTime: document.getElementById('dur-time'),
                    fileIn: document.getElementById('file-input'),
                    title: document.getElementById('title-display'),
                    artist: document.getElementById('artist-display'),
                    cover: document.getElementById('cover-img'),
                    canvas: document.getElementById('visualizer')
                };

                this.ctx = this.ui.canvas.getContext('2d', { alpha: false });
                this.setupEvents();
                this.resize();
                window.addEventListener('resize', () => this.resize());
            }

            initAudioEngine() {
                if (this.audioCtx) return;

                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audioCtx = new AudioContext({ latencyHint: 'playback' });

                // Create Nodes
                this.nodes.audioSrc = this.audioCtx.createMediaElementSource(this.audioEl);
                this.nodes.videoSrc = this.audioCtx.createMediaElementSource(this.videoEl);

                // Bass Chain: LowShelf (Sub) + Peaking (Punch)
                this.nodes.bassShelf = this.audioCtx.createBiquadFilter();
                this.nodes.bassShelf.type = 'lowshelf';
                this.nodes.bassShelf.frequency.value = 100;

                this.nodes.bassPunch = this.audioCtx.createBiquadFilter();
                this.nodes.bassPunch.type = 'peaking';
                this.nodes.bassPunch.frequency.value = 60;
                this.nodes.bassPunch.Q.value = 1.5;

                // Audio Quality: Dynamics Compressor (Makes sound "thick" and prevents distortion)
                this.nodes.compressor = this.audioCtx.createDynamicsCompressor();
                this.nodes.compressor.threshold.setValueAtTime(-24, this.audioCtx.currentTime);
                this.nodes.compressor.knee.setValueAtTime(30, this.audioCtx.currentTime);
                this.nodes.compressor.ratio.setValueAtTime(3, this.audioCtx.currentTime);
                this.nodes.compressor.attack.setValueAtTime(0.003, this.audioCtx.currentTime);
                this.nodes.compressor.release.setValueAtTime(0.25, this.audioCtx.currentTime);

                this.nodes.analyser = this.audioCtx.createAnalyser();
                this.nodes.analyser.fftSize = 512;
                this.nodes.analyser.smoothingTimeConstant = 0.8;

                // Final Connection Chain
                this.nodes.bassShelf.connect(this.nodes.bassPunch);
                this.nodes.bassPunch.connect(this.nodes.compressor);
                this.nodes.compressor.connect(this.nodes.analyser);
                this.nodes.analyser.connect(this.audioCtx.destination);

                this.routeSource();
                this.draw();
            }

            routeSource() {
                this.nodes.audioSrc.disconnect();
                this.nodes.videoSrc.disconnect();
                const currentSource = (this.activeMedia === this.videoEl) ? this.nodes.videoSrc : this.nodes.audioSrc;
                currentSource.connect(this.nodes.bassShelf);
            }

            setupEvents() {
                this.ui.playBtn.onclick = () => this.toggle();
                this.ui.fileIn.onchange = (e) => this.load(e.target.files[0]);

                this.ui.seek.oninput = (e) => {
                    const time = (e.target.value / 1000) * this.activeMedia.duration;
                    this.activeMedia.currentTime = time;
                };

                this.ui.bass.oninput = (e) => {
                    const val = e.target.value;
                    this.ui.bassVal.innerText = \`\${val}%\`;
                    if (this.nodes.bassShelf) {
                        // Max 15dB boost distributed over two filters for high quality
                        this.nodes.bassShelf.gain.setTargetAtTime(val * 0.12, this.audioCtx.currentTime, 0.1);
                        this.nodes.bassPunch.gain.setTargetAtTime(val * 0.08, this.audioCtx.currentTime, 0.1);
                    }
                };

                const update = () => {
                    if (!this.activeMedia.paused) {
                        const p = (this.activeMedia.currentTime / this.activeMedia.duration) * 1000;
                        this.ui.seek.value = p || 0;
                        this.ui.currTime.innerText = this.format(this.activeMedia.currentTime);
                        this.ui.durTime.innerText = this.format(this.activeMedia.duration);
                    }
                    requestAnimationFrame(update);
                };
                update();
            }

            async load(file) {
                if (!file) return;
                this.initAudioEngine();

                if (this.activeMedia.src) URL.revokeObjectURL(this.activeMedia.src);
                const url = URL.createObjectURL(file);

                const isVideo = file.type.startsWith('video');
                this.activeMedia = isVideo ? this.videoEl : this.audioEl;

                // Switch Visibility
                this.videoEl.style.display = isVideo ? 'block' : 'none';
                this.ui.cover.style.display = isVideo ? 'none' : 'block';

                this.audioEl.pause();
                this.videoEl.pause();
                this.activeMedia.src = url;
                this.routeSource();

                this.ui.title.innerText = file.name;
                this.ui.artist.innerText = isVideo ? "Video Media" : "Loading Tags...";

                if (!isVideo) this.getTags(file);

                this.activeMedia.play().then(() => {
                    this.ui.playIcon.className = 'fas fa-pause';
                });
            }

            getTags(file) {
                if (window.jsmediatags) {
                    window.jsmediatags.read(file, {
                        onSuccess: (tag) => {
                            this.ui.title.innerText = tag.tags.title || file.name;
                            this.ui.artist.innerText = tag.tags.artist || "Unknown Artist";
                            if (tag.tags.picture) {
                                const { data, format } = tag.tags.picture;
                                let base64 = "";
                                for (let i = 0; i < data.length; i++) base64 += String.fromCharCode(data[i]);
                                this.ui.cover.src = \`data:\${format};base64,\${btoa(base64)}\`;
                            }
                        },
                        onError: () => { this.ui.artist.innerText = "Local Audio"; }
                    });
                }
            }

            toggle() {
                this.initAudioEngine();
                if (this.activeMedia.paused) {
                    this.activeMedia.play();
                    this.ui.playIcon.className = 'fas fa-pause';
                } else {
                    this.activeMedia.pause();
                    this.ui.playIcon.className = 'fas fa-play';
                }
            }

            format(s) {
                if (isNaN(s)) return "0:00";
                const m = Math.floor(s / 60);
                const sec = Math.floor(s % 60);
                return \`\${m}:\${sec < 10 ? '0' + sec : sec}\`;
            }

            resize() {
                this.ui.canvas.width = this.ui.canvas.offsetWidth * window.devicePixelRatio;
                this.ui.canvas.height = this.ui.canvas.offsetHeight * window.devicePixelRatio;
            }

            draw() {
                requestAnimationFrame(() => this.draw());
                const data = new Uint8Array(this.nodes.analyser.frequencyBinCount);
                this.nodes.analyser.getByteFrequencyData(data);

                const w = this.ui.canvas.width;
                const h = this.ui.canvas.height;
                this.ctx.fillStyle = '#050505';
                this.ctx.fillRect(0, 0, w, h);

                const barWidth = (w / data.length) * 2.5;
                let x = 0;

                for (let i = 0; i < data.length; i++) {
                    const barHeight = (data[i] / 255) * h * 0.8;
                    const r = 255;
                    const g = 51;
                    const b = 51;

                    this.ctx.fillStyle = \`rgba(\${r}, \${g}, \${b}, \${data[i] / 255})\`;
                    this.ctx.shadowBlur = 15;
                    this.ctx.shadowColor = 'rgba(255, 51, 51, 0.5)';

                    // Rounded top bars
                    this.ctx.beginPath();
                    this.ctx.roundRect(x, h - barHeight, barWidth - 4, barHeight, [10, 10, 0, 0]);
                    this.ctx.fill();

                    x += barWidth;
                }
            }
        }

        window.onload = () => new NexusPlayer();
    <\/script>
</body>
</html>`;
        /* --- STATE --- */
        const State = {
            version: "13 RC",
            oobeKey: "nx_oobe_v13",
            settings: {
                time24: localStorage.getItem('nx_time24') === 'true',
                preventClose: localStorage.getItem('nx_prevent') === 'true',
                cloak: localStorage.getItem('nx_cloak') || 'none',
                bg: localStorage.getItem('nx_bg') || '',
                todos: JSON.parse(localStorage.getItem('nx_todos') || '[]'),
                lightMode: localStorage.getItem('nx_light') === 'true',
                tilt: parseInt(localStorage.getItem('nx_tilt') || '500'),
                customGames: JSON.parse(localStorage.getItem('nx_custom_games') || '[]')
            }
        };

        const DefaultGames = [
            { title: "Froggies Arcade", url: "https://frogs.look.good.pxi-fusion.com.cdn.cloudflare.net/math/", image: "https://images.unsplash.com/photo-1590005176489-db2e714711fc?q=80&w=1000", isNew: true },
            { title: "GNMath V2", url: "https://ormsescaperoad.w3spaces.com/gnmath.html", image: "https://images.unsplash.com/photo-1648700231913-ad061d9b3ec9?w=1920", isNew: true },
            { title: "BitLife", url: "https://ormsescaperoad.w3spaces.com/bitlife.html", image: "https://images.unsplash.com/photo-1563207153-f403bf289096?q=80&w=1000&auto=format&fit=crop", isNew: true },
            { title: "Snow Rider 3D", url: "https://ormsescaperoad.w3spaces.com/snow.html", image: "https://plus.unsplash.com/premium_photo-1719930221794-0680e7fd8071", isNew: true },
            { title: "Oregon Trail", url: "https://oregontrail.ws/the-oregon-trail-game/", image: "https://images.unsplash.com/photo-1533167649158-6d508895b680?q=80&w=1000", isNew: true },
            { title: "Mesh", url: "https://me.meshcapade.com/editor", image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1000", isNew: true },
            { title: "Willway", url: "https://admin.internetspeedtest.world/", image: "https://images.unsplash.com/photo-1551703599-6b3e8379aa8b?q=80&w=1000", isNew: true },
            { title: "FC Games", url: "https://agreeable-mud-098a6b110.1.azurestaticapps.net/", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000", isNew: true },
            { title: "Silk", url: "https://ormsescaperoad.w3spaces.com/silk.html", image: "https://images.unsplash.com/photo-1502691876148-a84978e59af8?q=80&w=1000" },
            { title: "Snake", url: "https://ormsescaperoad.w3spaces.com/snake.html", image: "https://images.unsplash.com/photo-1739869610059-86fabc7bcd7b?fit=clip&w=2500" },
            { title: "Tetris", url: "https://ormsescaperoad.w3spaces.com/tetris.html", image: "https://images.unsplash.com/vector-1753382303802-7d317d852293?w=1920"},
            { title: "Hex", url: "https://www.nddb.coop/ccnddb/games/Hexagon Twist/", image: "https://images.unsplash.com/vector-1761047846560-52720ea86a46?w=1920" },
            { title: "Dino Run", url: "https://ormsescaperoad.w3spaces.com/dino.html", image: "https://images.unsplash.com/vector-1761941086671-a623243d84a3?w=1920" },
            { title: "Flappy Bird", url: "https://ormsescaperoad.w3spaces.com/bird.html", image: "https://images.unsplash.com/photo-1732198246906-8168ef1ff6bc?q=80&w=1740" },
            { title: "Drive Mad", url: "https://ormsescaperoad.w3spaces.com/drive-mad.html", image: "https://images.unsplash.com/photo-1763897236977-1baa4a026a6d?q=80&w=2064" },
            { title: "Bank Heist", url: "https://ormsescaperoad.w3spaces.com/bank.html", image: "https://images.unsplash.com/photo-1738691035045-3fb009e8aa26?fit=clip&w=2500" },
            { title: "Slither.io", url: "https://ormsescaperoad.w3spaces.com/snakeio.html", image: "https://images.unsplash.com/photo-1736613403120-8d48aebd29e1?fit=clip&w=2500" },
            { title: "Escape Road", url: "https://ormsescaperoad.w3spaces.com/escape.html", image: "https://images.unsplash.com/photo-1764957080454-dd997a855733?q=80&w=774" },
        ];

        const Spoofs = [
            { id: 'none', t: 'NexusOS 13 RC', i: 'https://www.google.com/favicon.ico' },
            { id: 'google', t: 'Google', i: 'https://www.google.com/favicon.ico' },
            { id: 'canvas', t: 'Dashboard', i: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico' },
            { id: 'clever', t: 'Clever | Portal', i: 'https://assets.clever.com/favicon.ico' },
            { id: 'classroom', t: 'Classes', i: 'https://ssl.gstatic.com/classroom/favicon.png' },
            { id: 'drive', t: 'My Drive', i: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png' },
            { id: 'gmail', t: 'Inbox', i: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico' },
            { id: 'zoom', t: 'Zoom Meeting', i: 'https://st1.zoom.us/zoom.ico' },
            { id: 'kahoot', t: 'Enter Game PIN!', i: 'https://kahoot.it/favicon.ico' },
            { id: 'quizlet', t: 'Quizlet', i: 'https://assets.quizlet.com/a/j/favicon-32x32.e762772.png' },
            { id: 'wikipedia', t: 'Wikipedia', i: 'https://en.wikipedia.org/static/favicon/wikipedia.ico' },
            { id: 'discord', t: 'Discord', i: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png' },
            { id: 'spotify', t: 'Spotify - Web Player', i: 'https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png' },
            { id: 'reddit', t: 'Reddit', i: 'https://www.redditstatic.com/desktopweb/img/favicon/favicon-32x32.png' },
            { id: 'twitter', t: 'X', i: 'https://abs.twimg.com/favicons/twitter.3.ico' }
        ];

        /* --- LOGIC --- */
        const Utils = {
            toggleFull: () => !document.fullscreenElement ? document.documentElement.requestFullscreen() : document.exitFullscreen(),
            openBlank: () => {
                let win = window.open();
                win.document.body.style.margin="0"; win.document.body.style.height="100vh";
                let iframe = win.document.createElement('iframe');
                iframe.style.cssText = "border:none; width:100%; height:100%;";
                iframe.src = window.location.href;
                win.document.body.appendChild(iframe);
            },
            getBase64: (file) => new Promise((res, rej) => {
                const r = new FileReader(); r.readAsDataURL(file);
                r.onload=()=>res(r.result); r.onerror=e=>rej(e);
            })
        };

        const MusicApp = {
            loaded: false,
            init: () => {
                if(MusicApp.loaded) return;
                const iframe = document.getElementById('music-frame');
                iframe.srcdoc = musicPlayerHTML;
                MusicApp.initDraggable();
                MusicApp.loaded = true;
            },
            toggle: () => {
                const win = document.getElementById('music-window');
                const isActive = win.classList.toggle('active');
                if(isActive) MusicApp.init();
            },
            initDraggable: () => {
                const win = document.getElementById('music-window');
                const header = document.getElementById('mw-header');
                let isDragging = false;
                let startX, startY, initialLeft, initialTop;

                header.addEventListener('mousedown', (e) => {
                    isDragging = true;
                    win.classList.add('dragging');
                    startX = e.clientX;
                    startY = e.clientY;
                    const rect = win.getBoundingClientRect();
                    // Store offset relative to viewport
                    initialLeft = rect.left;
                    initialTop = rect.top;

                    // Remove translate(-50%, -50%) for absolute positioning logic once moved
                    win.style.transform = 'none';
                    win.style.left = initialLeft + 'px';
                    win.style.top = initialTop + 'px';
                });

                document.addEventListener('mousemove', (e) => {
                    if (!isDragging) return;
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;
                    win.style.left = `${initialLeft + dx}px`;
                    win.style.top = `${initialTop + dy}px`;
                });

                document.addEventListener('mouseup', () => {
                    isDragging = false;
                    win.classList.remove('dragging');
                });
            }
        };

const Notifications = {
            loaded: false,
            toggle: () => {
                const el = document.getElementById('notification-center');
                const isActive = el.classList.toggle('active');
                if(isActive && !Notifications.loaded) Notifications.reload();
                if(isActive) document.getElementById('todo-widget').classList.remove('active');
            },
            reload: () => {
                const content = document.getElementById('notif-content');
                content.innerHTML = '<div class="notif-loading">Checking for updates...</div>';

                // Using AllOrigins Proxy to bypass CORS restrictions
                const proxyUrl = 'https://api.allorigins.win/raw?url=';
                const targetUrl = 'https://pastebin.com/raw/6zCTDTmj';

                fetch(proxyUrl + encodeURIComponent(targetUrl))
                    .then(r => {
                        if (!r.ok) throw new Error('Network response was not ok');
                        return r.text();
                    })
                    .then(text => {
                        // Use marked.js (already included in your head) to parse the markdown
                        const html = marked.parse(text);
                        content.innerHTML = `<div class="notif-card">${html}</div>`;
                        Notifications.loaded = true;
                    })
                    .catch(e => {
                        console.error("Notif Error:", e);
                        content.innerHTML = `<div class="notif-card" style="color:#ef4444">
                            <strong>Fetch Error:</strong><br>
                            Failed to load notifications. This is usually due to temporary proxy downtime or connection issues.
                        </div>`;
                    });
            },
            pushLocal: (title, msg) => {
                const content = document.getElementById('notif-content');
                const alertHtml = `<div class="notif-card sys-alert"><h3>${title}</h3><p>${msg}</p></div>`;
                content.insertAdjacentHTML('afterbegin', alertHtml);

                const btn = document.querySelector('.system-tray .icon-btn');
                btn.style.color = '#3b82f6';
                setTimeout(() => btn.style.color = '', 4000);
            }
        };

        const Games = {
            list: [],
            render: () => {
                const track = document.getElementById('card-track');
                track.innerHTML = "";
                Games.list = [...DefaultGames, ...State.settings.customGames];

                Games.list.forEach((g, i) => {
                    let card = document.createElement('div');
                    card.className = "game-card";
                    const isCustom = i >= DefaultGames.length;

                    let html = ``;
                    if(g.isNew) html += `<div class="new-badge">New</div>`;
                    if(isCustom) html += `<div class="card-del-btn" onclick="event.stopPropagation(); Games.removeCustom(${i - DefaultGames.length})"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></div>`;

                    html += `<div class="card-inner"><img src="${g.image}" loading="lazy"></div><div class="card-title">${g.title}</div>`;

                    card.innerHTML = html;
                    card.onclick = () => window.open(g.url, '_blank');
                    card.onmouseenter = () => Games.hero(i);
                    Games.addTilt(card);
                    track.appendChild(card);
                });

                let addTile = document.createElement('div');
                addTile.className = "game-card add-tile";
                addTile.innerHTML = `<div class="card-inner"><div class="add-icon"><i data-lucide="plus" style="width:48px; height:48px;"></i></div></div>`;
                addTile.onclick = () => Modals.open('add-game-modal');
                Games.addTilt(addTile);
                track.appendChild(addTile);

                Games.hero(0);
            },
            hero: (i) => {
                if(!Games.list[i]) return;
                const txt = document.getElementById('hero-text');
                const btn = document.getElementById('play-btn');
                txt.style.opacity = 0.5;
                setTimeout(() => { txt.textContent = Games.list[i].title; txt.style.opacity = 1; }, 100);
                btn.href = Games.list[i].url;
            },
            removeCustom: (idx) => {
                if(confirm("Remove this app?")) {
                    State.settings.customGames.splice(idx, 1);
                    Settings.save('nx_custom_games', JSON.stringify(State.settings.customGames));
                    Games.render();
                }
            },
            addTilt: (card) => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const tiltFactor = State.settings.tilt / 1000;
                    const maxRot = 25;

                    const x = (e.clientX - rect.left - rect.width/2) / (rect.width/2);
                    const y = -(e.clientY - rect.top - rect.height/2) / (rect.height/2);

                    const rotX = y * maxRot * tiltFactor;
                    const rotY = x * maxRot * tiltFactor;

                    card.querySelector('.card-inner').style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
                });
                card.addEventListener('mouseleave', () => {
                    card.querySelector('.card-inner').style.transform = `rotateX(0) rotateY(0)`;
                });
            },
            scroll: (d) => document.getElementById('card-track').scrollBy({ left: d * 320, behavior: 'smooth' })
        };

        const Settings = {
            apply: () => {
                document.getElementById('theme-toggle').checked = State.settings.lightMode;
                document.getElementById('time-toggle').checked = State.settings.time24;
                document.getElementById('ptc-toggle').checked = State.settings.preventClose;
                document.getElementById('bg-input').value = State.settings.bg;
                document.getElementById('tilt-val').innerText = State.settings.tilt;
                document.querySelector('.range-slider').value = State.settings.tilt;

                if(State.settings.lightMode) document.body.classList.add('light-mode');
                Settings.setBg(State.settings.bg);
                Settings.setCloak(State.settings.cloak);
            },
            toggleTheme: () => {
                State.settings.lightMode = !State.settings.lightMode;
                document.body.classList.toggle('light-mode', State.settings.lightMode);
                Settings.save('nx_light', State.settings.lightMode);
            },
            toggleTime: () => {
                State.settings.time24 = !State.settings.time24;
                Settings.save('nx_time24', State.settings.time24);
                Clock.update();
            },
            togglePrevent: () => {
                State.settings.preventClose = !State.settings.preventClose;
                Settings.save('nx_prevent', State.settings.preventClose);
            },
            setBg: (url) => {
                State.settings.bg = url;
                Settings.save('nx_bg', url);
                const wrap = document.getElementById('bg-wrapper');
                if(url && url.trim() !== "") {
                    wrap.style.backgroundImage = `url('${url}')`;
                    document.getElementById('bg-default').style.opacity = 0;
                } else {
                    wrap.style.backgroundImage = 'none';
                    document.getElementById('bg-default').style.opacity = 1;
                }
            },
            setTilt: (val) => {
                State.settings.tilt = parseInt(val);
                document.getElementById('tilt-val').innerText = val;
                Settings.save('nx_tilt', val);
            },
            setCloak: (id) => {
                State.settings.cloak = id;
                Settings.save('nx_cloak', id);
                const s = Spoofs.find(x => x.id === id) || Spoofs[0];
                document.title = s.t;
                document.getElementById('favicon').href = s.i;
                document.querySelectorAll('.spoof-item').forEach(el => el.classList.toggle('selected', el.dataset.id === id));
            },
            save: (k, v) => localStorage.setItem(k, v)
        };

        const Clock = {
            el: document.getElementById('clock'),
            update: () => {
                const now = new Date();
                let h = now.getHours();
                let m = now.getMinutes();

                // Check Todo Alarms
                Todo.checkAlarms(h, m);

                if(!State.settings.time24) {
                    h = h % 12;
                    if(h === 0) h = 12;
                }
                const mStr = m < 10 ? '0'+m : m;
                Clock.el.textContent = `${h}:${mStr}`;
            }
        };

        const Todo = {
            toggle: () => {
                const el = document.getElementById('todo-widget');
                const isActive = el.classList.toggle('active');
                if(isActive) document.getElementById('notification-center').classList.remove('active');
            },
            handleInput: (e) => { if(e.key==='Enter') Todo.add(); },
            add: () => {
                const input = document.getElementById('todo-input');
                const timeInput = document.getElementById('todo-time');
                if(!input.value.trim()) return;

                State.settings.todos.push({
                    t: input.value.trim(),
                    time: timeInput.value, // "14:30" format
                    notified: false
                });
                Settings.save('nx_todos', JSON.stringify(State.settings.todos));
                Todo.render();
                input.value = ""; timeInput.value = "";
            },
            remove: (i) => {
                State.settings.todos.splice(i, 1);
                Settings.save('nx_todos', JSON.stringify(State.settings.todos));
                Todo.render();
            },
            checkAlarms: (h, m) => {
                const currentStr = `${h < 10 ? '0'+h : h}:${m < 10 ? '0'+m : m}`;
                let changed = false;
                State.settings.todos.forEach(item => {
                    if(item.time && !item.notified && item.time === currentStr) {
                        item.notified = true;
                        changed = true;
                        Notifications.pushLocal("Reminder", item.t);
                        Notifications.toggle(); // Auto open notifs
                    }
                });
                if(changed) Settings.save('nx_todos', JSON.stringify(State.settings.todos));
            },
            render: () => {
                const list = document.getElementById('todo-list');
                list.innerHTML = "";
                State.settings.todos.forEach((item, i) => {
                    let li = document.createElement('li');
                    li.className = "todo-item";
                    let timeBadge = item.time ? `<div class="todo-time">⏰ ${item.time}</div>` : '';
                    li.innerHTML = `
                        <div class="todo-marker" style="background:${item.notified ? '#22c55e' : '#3b82f6'}"></div>
                        <div class="todo-content">
                            <span class="todo-text">${item.t}</span>
                            ${timeBadge}
                        </div>
                        <div class="todo-del" onclick="Todo.remove(${i})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></div>
                    `;
                    list.appendChild(li);
                });
            }
        };

        const AddGame = {
            type: 'favicon',
            setType: (t) => {
                AddGame.type = t;
                document.getElementById('btn-fav').style.background = t === 'favicon' ? 'rgba(59,130,246,0.2)' : 'transparent';
                document.getElementById('btn-img').style.background = t === 'image' ? 'rgba(59,130,246,0.2)' : 'transparent';
                document.getElementById('ag-img-input-container').style.display = t === 'image' ? 'flex' : 'none';
            },
            save: async () => {
                const title = document.getElementById('ag-title').value;
                const url = document.getElementById('ag-url').value;
                if(!title || !url) return alert("Required fields missing");

                let img = "";
                if(AddGame.type === 'favicon') {
                    let d = url.replace('http://','').replace('https://','').split(/[/?#]/)[0];
                    img = `https://www.google.com/s2/favicons?domain=${d}&sz=128`;
                } else {
                    const iUrl = document.getElementById('ag-img-url').value;
                    const file = document.getElementById('ag-file').files[0];
                    if(iUrl) img = iUrl;
                    else if(file) {
                        try { img = await Utils.getBase64(file); } catch(e){ return alert("Image Error"); }
                    } else return alert("Image required");
                }

                State.settings.customGames.push({ title, url, image: img });
                Settings.save('nx_custom_games', JSON.stringify(State.settings.customGames));
                Games.render();
                Modals.close('add-game-modal');
                document.getElementById('ag-title').value=""; document.getElementById('ag-url').value="";
            }
        };

        const Modals = {
            open: (id) => document.getElementById(id).classList.add('active'),
            close: (id) => document.getElementById(id).classList.remove('active')
        };

        const Changelog = {
            loaded: false,
            open: () => {
                Modals.open('changelog-modal');
                if (Changelog.loaded) return;

                const content = document.getElementById('changelog-content');
                const proxyUrl = 'https://api.allorigins.win/raw?url=';
                const targetUrl = 'https://pastebin.com/raw/6zCTDTmj';

                fetch(proxyUrl + encodeURIComponent(targetUrl))
                    .then(r => {
                        if (!r.ok) throw new Error('Network response was not ok');
                        return r.text();
                    })
                    .then(text => {
                        content.innerHTML = `<div class="notif-card">${marked.parse(text)}</div>`;
                        Changelog.loaded = true;
                    })
                    .catch(e => {
                        console.error("Changelog Error:", e);
                        content.innerHTML = `<div class="notif-card" style="color:#ef4444">
                            <strong>Fetch Error:</strong><br>
                            Failed to load the changelog.
                        </div>`;
                    });
            }
        };

        const View = {
            set: (v) => {
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                document.querySelectorAll('.content-view').forEach(c => c.classList.remove('active-view'));

                const idx = v === 'games' ? 0 : 1;
                document.querySelectorAll('.nav-item')[idx].classList.add('active');
                document.getElementById(v+'-view').classList.add('active-view');
            }
        };

        const OOBE = {
            init: () => {
                if(!localStorage.getItem(State.oobeKey)) {
                    const header = document.querySelector('#oobe-overlay .pill-header');
                    header.innerHTML = '<span class="handwriting">NexusX</span>';

                    document.getElementById('oobe-overlay').style.display = 'flex';
                    // Render Spoofs in OOBE pill
                    const grid = document.getElementById('oobe-spoof-grid');
                    Spoofs.forEach(s => {
                         let d = document.createElement('div'); d.className = "spoof-item"; d.dataset.id = s.id;
                         d.innerHTML = `<img src="${s.i}" class="spoof-icon"><div class="spoof-name">${s.t}</div>`;
                         d.onclick = () => Settings.setCloak(s.id);
                         grid.appendChild(d);
                    });

                    setTimeout(() => document.getElementById('oobe-overlay').classList.add('active'), 50);
                } else {
                    document.getElementById('main-interface').classList.add('unlocked');
                }
            },
            finish: () => {
                localStorage.setItem(State.oobeKey, 'true');
                document.getElementById('oobe-overlay').classList.remove('active');
                setTimeout(() => {
                    document.getElementById('oobe-overlay').style.display = 'none';
                    document.getElementById('main-interface').classList.add('unlocked');
                }, 800);
            },
            reset: () => { if(confirm("Reset Everything?")) { localStorage.clear(); location.reload(); } }
        };

        window.onload = () => {
            if(window.innerWidth < 800) {
                const meta = document.querySelector('meta[name="viewport"]');
                if(meta) { meta.setAttribute('content', 'width=device-width, initial-scale=0.1'); setTimeout(() => meta.setAttribute('content', 'width=device-width, initial-scale=1.0'), 50); }
            }

            Settings.apply();
            Games.render();
            Todo.render();
            Clock.update();
            setInterval(Clock.update, 1000);

            // Populate Settings Spoof Grid
            const sg = document.getElementById('settings-spoof-grid');
            Spoofs.forEach(s => {
                let d = document.createElement('div'); d.className = "spoof-item"; d.dataset.id = s.id;
                d.innerHTML = `<img src="${s.i}" class="spoof-icon"><div class="spoof-name">${s.t}</div>`;
                d.onclick = () => Settings.setCloak(s.id);
                sg.appendChild(d);
            });
            Settings.setCloak(State.settings.cloak);
            OOBE.init();

            // Init Lucide
            lucide.createIcons();
        };

        window.addEventListener('beforeunload', (e) => {
            if(State.settings.preventClose) { e.preventDefault(); e.returnValue = ''; }
        });