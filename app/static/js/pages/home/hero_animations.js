
import { $id, on } from '../../core/dom.js';
import { throttle } from '../../core/utils.js';

const INCOTERM_LIST = ['EXW', 'FOB', 'CIF', 'CFR', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'];
const TARGET_FPS = 45;
const FRAME_DURATION = 1000 / TARGET_FPS;
const HERO_HEIGHT = 650;

let isPageVisible = true;
let lastFrameTime = 0;
let canvas, ctx, columns, depth;

function randomChar() {
    const pick = INCOTERM_LIST[Math.floor(Math.random() * INCOTERM_LIST.length)];
    const num = Math.floor(Math.random() * 99);
    return Math.random() > 0.5 ? pick : num;
}

function resizeCanvas() {
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = HERO_HEIGHT;
    
    const fontSize = 20;
    const newColumns = Math.floor((canvas.width / fontSize) * 0.6);
    
    if (newColumns !== columns) {
        const oldDepth = [...(depth || [])];
        depth = [];
        
        for (let i = 0; i < newColumns; i++) {
            if (oldDepth[i]) {
                depth.push(oldDepth[i]);
            } else {
                depth.push({
                    y: Math.random() * HERO_HEIGHT,
                    speed: 1.2 + Math.random() * 2.5,
                    blur: Math.random() * 2,
                    tilt: 7 * Math.PI / 180
                });
            }
        }
        columns = newColumns;
    }
}

function drawMatrix(currentTime) {
    if (!isPageVisible || !canvas || !ctx) {
        requestAnimationFrame(drawMatrix);
        return;
    }

    const elapsed = currentTime - lastFrameTime;
    if (elapsed < FRAME_DURATION) {
        requestAnimationFrame(drawMatrix);
        return;
    }
    lastFrameTime = currentTime;

    // Clear with fade
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const fontSize = 20;

    // Draw matrix rain
    if (depth) {
        for (let i = 0; i < depth.length; i++) {
            const d = depth[i];
            
            ctx.save();
            
            const gradient = ctx.createLinearGradient(0, 0, 0, HERO_HEIGHT);
            gradient.addColorStop(0, '#00ff8a');
            gradient.addColorStop(1, '#00c9ff');
            ctx.fillStyle = gradient;
            ctx.font = `${fontSize}px Inter`;
            ctx.filter = `blur(${d.blur}px)`;
            ctx.translate(i * fontSize, d.y);
            ctx.rotate(d.tilt);
            ctx.fillText(randomChar(), 0, 0);
            ctx.restore();

            d.y += d.speed * 0.85;
            
            if (d.y > HERO_HEIGHT + 200) {
                d.y = -200;
            }
        }
    }

    requestAnimationFrame(drawMatrix);
}

export function initHeroAnimations() {
    canvas = $id('matrixCanvas');
    if (!canvas) {
        return;
    }

    ctx = canvas.getContext('2d');
    
    // Initialize depth array
    const fontSize = 20;
    columns = Math.floor((window.innerWidth / fontSize) * 0.6);
    depth = [];
    
    for (let i = 0; i < columns; i++) {
        depth.push({
            y: Math.random() * HERO_HEIGHT,
            speed: 1.2 + Math.random() * 2.5,
            blur: Math.random() * 2,
            tilt: 7 * Math.PI / 180
        });
    }

    resizeCanvas();
    
    // Visibility API
    on(document, 'visibilitychange', () => {
        isPageVisible = !document.hidden;
    });
    
    // Resize handler
    on(window, 'resize', throttle(resizeCanvas, 250));
    
    // Start animation
    drawMatrix(0);
}

