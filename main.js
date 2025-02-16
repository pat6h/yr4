// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Add point light for the sun
const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
pointLight.position.set(0, 0, 0); // Position at the center (sun's position)
scene.add(pointLight);

// Add directional light to improve illumination
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Create an instance of OrbitControls for camera control
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = true; // Enable zooming
controls.enablePan = true; // Enable panning
controls.enableRotate = true; // Enable rotation
controls.enableDamping = true; // Enable damping for smooth movement
controls.dampingFactor = 0.25; // Set damping factor
controls.autoRotate = false; // Disable auto rotation

// Texture loader
const textureLoader = new THREE.TextureLoader();

// Add the Sun (Central Star)
const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
const sunTexture = textureLoader.load('images/sun.jpg'); // Ensure the texture file is in the same directory
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.name = "Sun";
scene.add(sun);

// Define planets and their properties (name, size, distance, speed, texture)
const planets = [
    { name: 'Mercury', size: 0.5, distance: 10, speed: 0.005, texture: 'images/mercury.jpg' },
    { name: 'Venus', size: 1.5, distance: 15, speed: 0.004, texture: 'images/venus.jpg' },
    { name: 'Earth', size: 2, distance: 20, speed: 0.003, texture: 'images/earth.jpg' },
    { name: 'Mars', size: 1.8, distance: 25, speed: 0.002, texture: 'images/mars.jpg' },
    { name: 'Jupiter', size: 5, distance: 40, speed: 0.001, texture: 'images/jupiter.jpg' },
    { name: 'Saturn', size: 4.5, distance: 60, speed: 0.0009, texture: 'images/saturn.jpg' },
    { name: 'Uranus', size: 3, distance: 80, speed: 0.0008, texture: 'images/uranus.jpg' },
    { name: 'Neptune', size: 3, distance: 100, speed: 0.0007, texture: 'images/neptune.jpg' }
];

// Create planet meshes and add them to the scene
const planetMeshes = [];
planets.forEach(planet => {
    const geometry = new THREE.SphereGeometry(planet.size, 64, 64);
    const texture = textureLoader.load(planet.texture); // Load the texture
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const planetMesh = new THREE.Mesh(geometry, material);
    planetMesh.name = planet.name;
    planetMeshes.push({ mesh: planetMesh, distance: planet.distance, speed: planet.speed });
    scene.add(planetMesh);
});

// Define moons (orbit around specific planets)
const moons = [
    { name: 'Moon', planet: 'Earth', size: 0.5, distance: 3, speed: 0.01, texture: 'images/moon.jpg', inclination: 0.1 },
    { name: 'Phobos', planet: 'Mars', size: 0.3, distance: 1.5, speed: 0.015, texture: 'images/phobos.jpg', inclination: 0.2 },
    { name: 'Deimos', planet: 'Mars', size: 0.2, distance: 2, speed: 0.02, texture: 'images/deimos.jpg', inclination: 0.3 },
    { name: 'Io', planet: 'Jupiter', size: 1, distance: 5, speed: 0.005, texture: 'images/io.jpg', inclination: 0.1 },
    { name: 'Europa', planet: 'Jupiter', size: 0.8, distance: 7, speed: 0.004, texture: 'images/europa.jpg', inclination: 0.2 }
];

// Create moon meshes and add them to the scene
const moonMeshes = [];
moons.forEach(moon => {
    const geometry = new THREE.SphereGeometry(moon.size, 32, 32);
    const texture = textureLoader.load(moon.texture); // Load the texture
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const moonMesh = new THREE.Mesh(geometry, material);
    moonMesh.name = moon.name;
    moonMeshes.push({ mesh: moonMesh, planet: moon.planet, distance: moon.distance, speed: moon.speed, inclination: moon.inclination });
    scene.add(moonMesh);
});

// Create faint circular trajectories for planets
const trajectoryMeshes = [];
planetMeshes.forEach(planet => {
    const trajectoryGeometry = new THREE.RingGeometry(planet.distance - 0.5, planet.distance + 0.5, 100);
    const trajectoryMaterial = new THREE.MeshBasicMaterial({ color: 0x999999, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    const trajectoryMesh = new THREE.Mesh(trajectoryGeometry, trajectoryMaterial);
    trajectoryMesh.rotation.x = Math.PI / 2; // Align trajectory to the XZ plane
    trajectoryMeshes.push(trajectoryMesh);
    scene.add(trajectoryMesh);
});

// Create faint circular trajectories for moons
const moonTrajectoryMeshes = [];
moonMeshes.forEach(moon => {
    const trajectoryGeometry = new THREE.RingGeometry(moon.distance - 0.1, moon.distance + 0.1, 100);
    const trajectoryMaterial = new THREE.MeshBasicMaterial({ color: 0x999999, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    const trajectoryMesh = new THREE.Mesh(trajectoryGeometry, trajectoryMaterial);
    trajectoryMesh.rotation.x = Math.PI / 2; // Align trajectory to the XZ plane
    moonTrajectoryMeshes.push(trajectoryMesh);
    scene.add(trajectoryMesh);
});

// Add atmospheres to Earth and Jupiter
function addAtmosphere(planetMesh, size, color) {
    const atmosphereGeometry = new THREE.SphereGeometry(size, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.3 });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atmosphereMesh.scale.set(1.02, 1.02, 1.02); // Slightly larger than the planet
    planetMesh.add(atmosphereMesh);
}

addAtmosphere(planetMeshes.find(p => p.mesh.name === 'Earth').mesh, 2, 0x00f0ff);
addAtmosphere(planetMeshes.find(p => p.mesh.name === 'Jupiter').mesh, 5, 0xffa500);

// Set up camera position
camera.position.z = 50;

// Handle mouse hover over planets and moons to show their names
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const nameDisplay = document.createElement('div');
nameDisplay.style.position = 'absolute';
nameDisplay.style.color = 'white';
nameDisplay.style.fontSize = '20px';
nameDisplay.style.pointerEvents = 'none'; // Make sure the div doesn't interfere with mouse events
document.body.appendChild(nameDisplay);

// Listen for mouse movements
window.addEventListener('mousemove', onMouseMove, false);
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function getIntersectedObject() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([sun, ...planetMeshes.map(p => p.mesh), ...moonMeshes.map(m => m.mesh)]);
    return intersects[0];
}

// Countdown timer
const countdownDisplay = document.getElementById('countdown');
let countdown = 10;
countdownDisplay.innerHTML = `Countdown: ${countdown}s`;
const countdownInterval = setInterval(() => {
    countdown--;
    countdownDisplay.innerHTML = `Countdown: ${countdown}s`;
    if (countdown <= 0) {
        clearInterval(countdownInterval);
        countdownDisplay.style.display = 'none';
    }
}, 1000);

// Add stars to the background
function addStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        vertices.push(x, y, z);
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}
addStars();

// Load trajectories from JSON
async function loadTrajectories() {
    try {
        const response = await fetch('trajectories.json');
        const trajectories = await response.json();

        // Create trajectory lines for planets and moons
        Object.keys(trajectories).forEach((name) => {
            if (name === 'Sun') return; // Skip the Sun

            const positions = trajectories[name];
            const geometry = new THREE.BufferGeometry().setFromPoints(
                positions.map(pos => new THREE.Vector3(...pos))
            );
            const material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 });
            const line = new THREE.Line(geometry, material);
            line.name = `${name} Trajectory`;
            scene.add(line);
        });
    } catch (error) {
        console.error('Error loading trajectories:', error);
    }
}

// Handle animation of planets, moons, and trajectories
function animate() {
    requestAnimationFrame(animate);

    // Update planets' orbits
    planetMeshes.forEach((planet, index) => {
        planet.mesh.position.x = planet.distance * Math.cos(planet.speed * Date.now() * 0.001);
        planet.mesh.position.z = planet.distance * Math.sin(planet.speed * Date.now() * 0.001);
        trajectoryMeshes[index].rotation.z += 0.001; // Keep the trajectory ring rotating for visual effect
    });

    // Update moons' orbits around their respective planets
    moonMeshes.forEach((moon, index) => {
        const planet = planetMeshes.find(p => p.mesh.name === moon.planet);
        moon.mesh.position.x = planet.mesh.position.x + moon.distance * Math.cos(moon.speed * Date.now() * 0.001) * Math.cos(moon.inclination);
        moon.mesh.position.z = planet.mesh.position.z + moon.distance * Math.sin(moon.speed * Date.now() * 0.001) * Math.cos(moon.inclination);
        moon.mesh.position.y = moon.distance * Math.sin(moon.inclination);
        moonTrajectoryMeshes[index].position.copy(planet.mesh.position);
        moonTrajectoryMeshes[index].rotation.z += 0.001; // Keep the trajectory ring rotating for visual effect
    });

    // Display planet/moon names when hovered
    const intersected = getIntersectedObject();
    if (intersected) {
        const vector = new THREE.Vector3();
        vector.setFromMatrixPosition(intersected.object.matrixWorld);
        vector.project(camera);

        const x = (vector.x * window.innerWidth) / 2 + window.innerWidth / 2;
        const y = -(vector.y * window.innerHeight) / 2 + window.innerHeight / 2;

        nameDisplay.style.left = `${x}px`;
        nameDisplay.style.top = `${y - 20}px`; // Adjust position slightly above the object
        nameDisplay.style.display = 'block';
        nameDisplay.innerHTML = intersected.object.name;
    } else {
        nameDisplay.style.display = 'none';
    }

    // Update controls and render scene
    controls.update();
    renderer.render(scene, camera);
}

// Load trajectories and start the animation
loadTrajectories().then(() => {
    animate();
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});