document.addEventListener("DOMContentLoaded", () => {
    
    const bob = document.getElementById('nametag-bob');
    const line = document.getElementById('string-line');
    const container = document.querySelector('.nametag-wrapper');

    const anchorX = 175; const anchorY = 0;   
    let x = 175; let y = 200; let vx = 0; let vy = 0;
    const k = 0.05; const damp = 0.88; const restLength = 120; const mass = 1.5; const gravity = 0.8;
    let isDragging = false; let mouseX = x; let mouseY = y;

    function startDrag(e) {
        isDragging = true; updateMousePos(e);
        if(bob) bob.style.transition = 'none'; 
    }

    function updateMousePos(e) {
        if (isDragging && container) {
            const rect = container.getBoundingClientRect();
            let clientX = e.touches ? e.touches[0].clientX : e.clientX;
            let clientY = e.touches ? e.touches[0].clientY : e.clientY;
            mouseX = clientX - rect.left;
            mouseY = clientY - rect.top;
        }
    }

    function stopDrag() { isDragging = false; }

    if(bob) {
        bob.addEventListener('mousedown', startDrag);
        bob.addEventListener('touchstart', startDrag, {passive: false});
        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('touchend', stopDrag);
    }

    function animateNametag() {
        if (isDragging) {
            x = mouseX; y = mouseY; vx = 0; vy = 0;
        } else {
            let dx = x - anchorX; let dy = y - anchorY;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let force = -k * (distance - restLength);
            let fx = (dx / distance) * force; let fy = (dy / distance) * force;
            fy += gravity * mass;
            let ax = fx / mass; let ay = fy / mass;
            vx = (vx + ax) * damp; vy = (vy + ay) * damp;
            x += vx; y += vy;
        }
        if(line) {
            line.setAttribute('x1', anchorX); line.setAttribute('y1', anchorY);
            line.setAttribute('x2', x); line.setAttribute('y2', y);
        }
        if(bob) {
            let angleRad = Math.atan2(anchorX - x, y - anchorY);
            let angleDeg = angleRad * (180 / Math.PI);
            bob.style.left = `${x - bob.offsetWidth / 2}px`;
            bob.style.top = `${y}px`;
            bob.style.transform = `rotate(${-angleDeg}deg)`;
        }
        requestAnimationFrame(animateNametag);
    }
    animateNametag();

    const cursorGlow = document.querySelector('.cursor-glow');
    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');

    window.addEventListener('mousemove', (e) => {
        updateMousePos(e); 
        if(cursorGlow) {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        }
        let moveX = (e.clientX * -1 / 30); 
        let moveY = (e.clientY * -1 / 30);
        
        if(orb1) orb1.style.transform = `translate(${moveX}px, ${moveY}px)`;
        if(orb2) orb2.style.transform = `translate(${moveX * -1}px, ${moveY * -1}px)`; 
    });

    window.addEventListener('mousedown', () => { if(cursorGlow) { cursorGlow.style.width = '300px'; cursorGlow.style.height = '300px'; } });
    window.addEventListener('mouseup', () => { if(cursorGlow) { cursorGlow.style.width = '600px'; cursorGlow.style.height = '600px'; } });
});