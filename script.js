document.addEventListener('DOMContentLoaded', function() {
    const stage = document.getElementById('stage');
    if (!stage) {
        console.error('Stage element #stage not found for ASCII spiral.');
        return;
    }

    stage.style.opacity = '0.4';

    const cols = Math.floor(window.innerWidth / 6);
    const rows = Math.floor(window.innerHeight / 12);
    
    const glyphs = " .:-=+*#%@";

    
    const logoText = [
        "░▒▓████████▓▒░▒▓██████▓▒░ ░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓███████▓▒░      ░▒▓████████▓▒░▒▓█▓▒░      ░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░ ",
        "░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░             ░▒▓█▓▒░      ░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░ ",
        "░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░             ░▒▓█▓▒░      ░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░ ",
        "░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░░▒▓██████▓▒░       ░▒▓██████▓▒░ ░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░ ",
        "░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░ ",
        "░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░ ",
        "░▒▓█▓▒░      ░▒▓██████▓▒░ ░▒▓██████▓▒░ ░▒▓██████▓▒░░▒▓███████▓▒░       ░▒▓█▓▒░      ░▒▓████████▓▒░▒▓██████▓▒░ ░▒▓█████████████▓▒░  ",
        "                                                                                                                                    ",
        "                                                                                                                                    "
    ];

    const scrambleChars = "▁▂▃▄▅▆▇█▉▊▋▌▍▎▏▐░▒▓▔▕▖▗▘▙▚▛▜▝▞▟■□▢▣▤▥▦▧▨▩▪▫▬▭▮▯";
    const logoTextScrambled = [];

    for (let scrambleLevel = 17; scrambleLevel >= 0; scrambleLevel--) {
        const currentScramble = [];
        for (let i = 0; i < logoText.length; i++) {
            let newRow = "";
            for (let j = 0; j < logoText[i].length; j++) {
                const originalChar = logoText[i][j];
                if (originalChar === " ") {
                    newRow += " ";
                } else {
                    const randomFactor = scrambleLevel / 17;
                    if (Math.random() < randomFactor) {
                        newRow += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                    } else {
                        newRow += originalChar;
                    }
                }
            }
            currentScramble.push(newRow);
        }
        logoTextScrambled.push(currentScramble);
    }

    logoTextScrambled.push(logoText);

    const logoHeight = logoText.length;
    const logoWidth = logoText[0].length;
    const logoStartRow = Math.floor(rows / 2 - logoHeight / 2);
    const logoStartCol = Math.floor(cols / 2 - logoWidth / 2);

    let animationFrameId = null;

    function frame(time) {
        const e = time * 0.0009 + 0.8;
        const out = [];
        const k = glyphs.length / 2;
        const revealPhase = Math.PI / 2.5;
        const unscrambleDuration = 1.0;
        const unscrambleStartTime = revealPhase + 0.1;
        const unscrambleEndTime = unscrambleStartTime + unscrambleDuration;

        let currentLogoVersion = logoText;
        if (e > unscrambleStartTime && e < unscrambleEndTime) {
            const progress = (e - unscrambleStartTime) / unscrambleDuration;
            const scrambleIndex = Math.min(
                logoTextScrambled.length - 1,
                Math.floor(progress * logoTextScrambled.length)
            );
            currentLogoVersion = logoTextScrambled[scrambleIndex];
        } else if (e >= unscrambleEndTime) {
            currentLogoVersion = logoText;
        }

        for (let y = 0; y < rows; y++) {
            let rowString = "";
            const Y = y / rows * 2 - 1;
            for (let x = 0; x < cols; x++) {
                const X = x / cols * 2 - 1;
                const l = Math.hypot(X, Y);
                let a = Math.atan2(Y, X);
                let char_idx = 0;
                let ch = glyphs[0];

                if (l < 1.0) {
                    a += e;
                    a += l * Math.PI;
                    char_idx = Math.floor(
                        (Math.cos(a * 3 + l * 2 + e * 2) + Math.sin(a * 2 - l * 3 + e * 3)) / 2 * k + k
                    );
                    char_idx = Math.max(0, Math.min(glyphs.length - 1, char_idx));
                    ch = glyphs[char_idx];
                }

                const logorow_idx = y - logoStartRow;
                const logocol_idx = x - logoStartCol;

                if (e > revealPhase &&
                    logorow_idx >= 0 && logorow_idx < logoHeight &&
                    logocol_idx >= 0 && logocol_idx < logoWidth &&
                    currentLogoVersion[logorow_idx][logocol_idx] !== undefined &&
                    currentLogoVersion[logorow_idx][logocol_idx] !== " ") {

                    const pct = Math.min(1, (e - revealPhase) / 0.2);
                    if (pct > 0.5) {
                        const logoChar = currentLogoVersion[logorow_idx][logocol_idx];
                        if (e >= unscrambleEndTime) {
                            ch = `<span style="color: white; text-shadow: 0 0 5px rgba(255,255,255,0.7);">${logoChar}</span>`;
                        } else {
                            ch = logoChar;
                        }
                    } else {
                        const idx = Math.min(glyphs.length - 1, char_idx + Math.floor(pct * 10));
                        ch = glyphs[idx];
                    }
                }
                rowString += ch;
            }
            out.push(rowString);
        }

        stage.innerHTML = out.map(row => `<pre>${row}</pre>`).join('');
        animationFrameId = requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);

    // ✅ Redirect after 10 seconds
    setTimeout(() => {
        window.location.href = '/Home';
    }, 6543);
});
