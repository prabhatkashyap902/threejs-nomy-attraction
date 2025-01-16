import * as THREE from 'three';
import './src/index.css'

// Initialize Three.js scene, camera, and renderer
const canvas=document.querySelector('canvas.webgl')

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Particle system setup
const particles = []; // Store particle data
const particleGeometry = new THREE.BufferGeometry();
const particleMaterial = new THREE.PointsMaterial({
  size: 0.1,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true, // Enable per-particle color
});
const particlesMesh = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particlesMesh);

// Camera position
camera.position.z = 5;

// Function to spawn a new particle
function spawnParticle() {
  const position = new THREE.Vector3(
    (Math.random() - 0.5) * 10, // Random x
    (Math.random() - 0.5) * 10, // Random y
    1
  );
  const velocity = new THREE.Vector3(
    (Math.random() - 0.5) * 0.2, // Random x velocity
    (Math.random() - 0.5) * 0.2, // Random y velocity
    (Math.random() - 0.5) * 0.2  // Random z velocity
  );
  const lifetime = 2 + Math.random(); // Random lifetime between 2-3 seconds
  const color = new THREE.Color(Math.random(), Math.random(), Math.random()); // Random color

  particles.push({ position, velocity, lifetime, age: 0, color });
}

// Function to update particles
function updateParticles(deltaTime) {
  const positions = [];
  const colors = [];
  const opacities = [];

  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];

    // Update position
    particle.position.addScaledVector(particle.velocity, deltaTime);

    // Update age and calculate opacity
    particle.age += deltaTime;
    const opacity = 1 - particle.age / particle.lifetime; // Fades as age increases

    // Remove particle if it exceeds its lifetime
    if (particle.age >= particle.lifetime) {
      particles.splice(i, 1);
      continue;
    }

    // Store particle data for rendering
    positions.push(particle.position.x, particle.position.y, particle.position.z);
    colors.push(particle.color.r, particle.color.g, particle.color.b);
    opacities.push(opacity);
  }

  // Update the particle geometry
  particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  particleGeometry.setAttribute('opacity', new THREE.Float32BufferAttribute(opacities, 1));
  particleGeometry.needsUpdate = true;
}

// Animation loop
let lastTime = 0;
function animate(time) {
  const deltaTime = (time - lastTime) / 1000; // Convert time to seconds
  lastTime = time;

  particlesMesh.position.y=-Math.sin(Math.PI*time/10000)

  // Spawn new particles
  if (Math.random() < 1) spawnParticle(); // Spawn approximately 10 particles per second

  // Update particles
  updateParticles(deltaTime);

  // Render the scene
  renderer.render(scene, camera);

  // Loop
  requestAnimationFrame(animate);
}
animate(0);

// Handle window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
