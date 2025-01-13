export const API_URL = "http://localhost"
export const API_PORT = "5040"

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


async function postNewDocument(coll, doc){
	return await fetch(`${API_URL}:${API_PORT}/${coll}`, {
      method: 'POST',
      mode: 'cors',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(doc)
    });
}


export async function postPrintJob(Title, PageCount, RasterizationProfile){
	return await postNewDocument("PrintJob", {
		Title: Title,
		PageCount: PageCount,
		RasterizationProfile: RasterizationProfile
	});
}


export async function postWorkflow(Title, WorkflowSteps){
	return await postNewDocument("Workflow", {
        Title: Title,
        WorkflowSteps: WorkflowSteps
    });
}


export function formatLinearSteps(steps){
	let output = [];
	for(let i = 0; i < steps.length; i++){
		output.push({
			id: steps[i],
			Prev: (i > 0) ? [i-1] : [],
			Next: (i < steps.length-1) ? [i+1] : []
		});
	}
	return output
}


export async function postSimulationReport(PrintJobID, WorkFlowID){
	return await postNewDocument("SimulationReport", {
		PrintJobID: PrintJobID,
        WorkflowID: WorkFlowID
	});
}