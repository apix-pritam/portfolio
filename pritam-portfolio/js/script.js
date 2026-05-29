// --- 3D CANVAS CODE ---
const container = document.getElementById('canvas-container');
if (container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(2, 0);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x00f3ff, 
        wireframe: true,
        transparent: true,
        opacity: 0.8      
    });
    
    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);
    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        shape.rotation.x += 0.002;
        shape.rotation.y += 0.002;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        // Re-align the nav slider dynamically (Desktop)
        if (window.innerWidth > 768) {
            const activeTab = document.querySelector('.tab-link.active');
            const slider = document.querySelector('.nav-slider');
            if (activeTab && slider) {
                slider.style.width = activeTab.offsetWidth + 'px';
                slider.style.left = activeTab.offsetLeft + 'px';
            }
        }
    });
}

// --- SMOOTH NAVIGATION & MOBILE MENU LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll('.tab-link');
    const views = document.querySelectorAll('.view');
    const slider = document.querySelector('.nav-slider');
    
    // Mobile Menu Elements
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    // 1. Toggle Mobile Menu
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('open');
        });
    }

    // 2. Desktop Slider Function
    function moveSlider(tab) {
        if (window.innerWidth > 768 && slider) {
            slider.style.width = tab.offsetWidth + 'px';
            slider.style.left = tab.offsetLeft + 'px';
        }
    }

    // Initialize the slider on the first active tab
    const initialTab = document.querySelector('.tab-link.active');
    if (initialTab) {
        setTimeout(() => moveSlider(initialTab), 100); 
    }

    // 3. Tab Click Logic (WITH BACKGROUND SWAPPING)
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            // Move desktop slider
            moveSlider(e.target);

            // Update active link styles
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');

            // Fade out old view, fade in new view
            const targetId = e.target.getAttribute('href').substring(1); 
            views.forEach(view => {
                view.classList.remove('active');
                if (view.id === targetId) {
                    view.classList.add('active');
                }
            });

            // --- NEW: Background Swapping Logic ---
            const bgVideo = document.getElementById('bg-video');
            if (targetId === 'home') {
                // Show 3D Canvas, Hide Video
                if (container) container.classList.remove('hidden');
                if (bgVideo) bgVideo.classList.remove('active');
            } else {
                // Hide 3D Canvas, Show Video (About & Work tabs)
                if (container) container.classList.add('hidden');
                if (bgVideo) bgVideo.classList.add('active');
            }

            // If on mobile, close the menu smoothly after clicking a tab
            if (window.innerWidth <= 768) {
                if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
                if (navMenu) navMenu.classList.remove('open');
            }
        });
    });
});