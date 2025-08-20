import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration
export const options = {
	stages: [
		{ duration: '30s', target: 10 },  // Ramp up to 10 users over 30s
		{ duration: '1m', target: 10 },   // Stay at 10 users for 1 minute
		{ duration: '30s', target: 0 },   // Ramp down to 0 users
	],
	// Configuración para InfluxDB
	ext: {
		loadimpact: {
			distribution: {
				'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 },
			},
		},
	},
};

const BASE_URL = 'http://localhost:3000';

export default function () {
	// Test 1: Health check
	let healthResponse = http.get(`${BASE_URL}/health`);
	check(healthResponse, {
		'health check status is 200': (r) => r.status === 200,
		'health check has OK status': (r) => JSON.parse(r.body).status === 'OK',
	});

	// Test 2: Get all users
	let usersResponse = http.get(`${BASE_URL}/api/users`);
	check(usersResponse, {
		'users endpoint status is 200': (r) => r.status === 200,
		'users response has success field': (r) => JSON.parse(r.body).success === true,
	});

	// Test 3: Get all projects
	let projectsResponse = http.get(`${BASE_URL}/api/projects`);
	check(projectsResponse, {
		'projects endpoint status is 200': (r) => r.status === 200,
		'projects response has data field': (r) => JSON.parse(r.body).hasOwnProperty('data'),
	});

	// Test 4: Get all tasks
	let tasksResponse = http.get(`${BASE_URL}/api/tasks`);
	check(tasksResponse, {
		'tasks endpoint status is 200': (r) => r.status === 200,
		'tasks response time < 500ms': (r) => r.timings.duration < 500,
	});

	// Wait 1 second between iterations
	sleep(1);
}