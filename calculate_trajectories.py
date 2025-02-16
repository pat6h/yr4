from skyfield.api import load, Topos
import numpy as np
import json

# Load the ephemeris data
ephemeris = load('de432s.bsp')

# Define the observer (Earth center)
observer = Topos('0 N', '0 E')

# Define the time range
ts = load.timescale()
start_time = ts.utc(2023, 1, 1)
end_time = ts.utc(2023, 12, 31)
time_difference = (end_time.ut1 - start_time.ut1) * 24  # Total hours
hours = int(time_difference)  # Convert to integer

# Generate time array with hourly intervals
times = ts.utc(2023, 1, 1, range(hours))

# Define the planets and moons
bodies = {
    'Sun': ephemeris['sun'],
    'Mercury': ephemeris['mercury'],
    'Venus': ephemeris['venus'],
    'Earth': ephemeris['earth'],
    'Mars': ephemeris['mars barycenter'],
    'Jupiter': ephemeris['jupiter barycenter'],
    'Saturn': ephemeris['saturn barycenter'],
    'Uranus': ephemeris['uranus barycenter'],
    'Neptune': ephemeris['neptune barycenter'],
    'Moon': ephemeris['moon'],
    'Phobos': ephemeris['mars barycenter'],
    'Deimos': ephemeris['mars barycenter'],
    'Io': ephemeris['jupiter barycenter'],
    'Europa': ephemeris['jupiter barycenter']
}

# Calculate positions
positions = {}
for name, body in bodies.items():
    pos = body.at(times).position.km
    positions[name] = pos.tolist()

# Save to JSON file
with open('trajectories.json', 'w') as f:
    json.dump(positions, f)

print("Trajectories saved to trajectories.json")