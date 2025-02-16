// asteroidData.js
import * as axiosModule from './axios.min.js';
const axios = axiosModule.default;

// Fetch asteroid trajectory data from NASA JPL Small Body Database API
export async function fetchAsteroidTrajectory() {
    try {
        const response = await axios.get('https://ssd-api.jpl.nasa.gov/horizons.api', {
            params: {
                command: '2024 YR4',
                format: 'json',
                make_ephem: 'YES',
                table_type: 'OBSERVER',
                start_time: '2023-01-01',
                stop_time: '2032-12-31',
                step_size: '1d'
            }
        });

        const ephem = response.data.ephem;
        const trajectory = [];

        ephem.forEach(entry => {
            const date = new Date(entry.date);
            const x = parseFloat(entry['x']) * 1000; // Scale down the coordinates for visualization
            const y = parseFloat(entry['y']) * 1000; // Scale down the coordinates for visualization
            const z = parseFloat(entry['z']) * 1000; // Scale down the coordinates for visualization
            trajectory.push(new THREE.Vector3(x, y, z));
        });

        return trajectory;
    } catch (error) {
        console.error('Error fetching asteroid trajectory:', error);
        return [];
    }
}

// Periodically fetch and update asteroid trajectory
export async function updateAsteroidTrajectory(asteroidData) {
    while (true) {
        const trajectory = await fetchAsteroidTrajectory();
        if (trajectory.length > 0) {
            asteroidData.trajectory = trajectory;
            drawAsteroidTrajectory(asteroidData);
        }
        await new Promise(resolve => setTimeout(resolve, 60000)); // Fetch every minute
    }
}

// Draw asteroid trajectory
function drawAsteroidTrajectory(asteroidData) {
    if (asteroidData.trajectory.length === 0) return;

    // Remove previous trajectory line if exists
    const existingLine = scene.getObjectByName('asteroidTrajectory');
    if (existingLine) {
        scene.remove(existingLine);
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(asteroidData.trajectory);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1 }); // Thinner line
    const line = new THREE.Line(geometry, material);
    line.name = 'asteroidTrajectory';
    line.receiveShadow = true; // Enable shadow receiving
    scene.add(line);
    console.log('Asteroid trajectory drawn:', line);
}
