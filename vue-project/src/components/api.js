import { API_URL, API_PORT } from "../consts.js";


export async function getEntireCollection(coll){
	try {
		const response = await fetch(`${API_URL}:${API_PORT}/${coll}`, 
			{ method: 'GET', mode: 'cors' });
		if (response.ok) return await response.json();
		else throw new Error(String(response.status));
	} catch (error) {
		console.log(`Error fetching list of ${coll}s: ${error}`);
	}
}