<template>
    <v-app theme="light">
        <v-dialog scrollable persistent class="create-report" max-width="700px" style="max-height:600px; margin:0px;" v-model="newSimulationReportDialogue">
            <create-simulation-report @exit="newSimulationReportDialogue=false"></create-simulation-report>
        </v-dialog>
        <v-toolbar class="toolbar">
            <v-toolbar-title class="header">Simulation</v-toolbar-title>
        </v-toolbar> 
        <v-main class="pa-3">
		
	  <v-card class="module pa-3 mb-3" style="width:85vw; height:350px; border-width:2px;">
            <v-card-title class="module-title mb-5">New Simulation Report</v-card-title> 
				<v-form 
					class="pa-2"
					fast-fail
					ref="selectPreviousWorkflowForm"
					@submit.prevent="generateSimulationReport">
				<v-select
					v-model="selectedPrintJob"
					:rules="printJobTitleValidation"
					label="Select Print Job"
					:items="printJobs"
					item-title="Title"
					item-value="_id"
					outlined
				>
				</v-select>
				<v-select
					v-model="selectedWorkflow"
					:rules="selectedWorkflowValidation"
					:items="workflows"
					label="Select Workflow"
					item-title="Title"
					item-value="WorkflowID"
					outlined
				>
					<template v-slot:item="{ props, item }">
						<v-list-item v-bind="props" ></v-list-item>
					</template>
				</v-select>
						<v-btn 
							type="submit"
							class="mb-2"
							color="light-blue-darken-4"
						>
						Generate Simulation report
					</v-btn>
					<v-alert
					class="mt-2"
					style="background-color:white;"
					>
						{{ messageSimulation }}
					</v-alert>
				</v-form>     
            </v-card>
            <v-card 
				class="module pa-3 mb-3" 
				style="border-width:2px;
				max-width:800px;
				height:600px;"
			>
				<v-row class="mb-1">
					<v-col 
					class="mt-5 ml-5pa-0 d-flex justify-start align-center"
				>
					<v-card-title
						class="module-title mb-5"
					>
					Simulation Report History
					</v-card-title>
				</v-col>
				<v-col 
				class="mt-1 mr-3 pa-0 d-flex justify-end align-center"
				>
					<v-text-field 
						v-model="searchValue"
						@update:modelValue="filterSimulationReportsBySearch"
						label="Search Reports" 
						prepend-icon="mdi-magnify" 
						density="compact" 
						class="simulation-report-search-box"
					/>
				</v-col>
					</v-row>
						<div class="report-history-list">
								<v-list style="margin:0; padding:0;">
									<v-list-item 
										v-for="(report, index) in simulationReportsDisplay"
									style="margin:0; padding:0;"
									:key="index"
									>
										<v-card class="report-history-item" @click="selectSimulationReport(report._id)">
											<!--Workflow has defined printjob title-->
											<div v-if="report.PrintJobTitle">
												<v-row>
													<v-col>
														<v-chip class="ml-2 mt-2" color="primary" >	
															Nov 14
														</v-chip>
														<v-chip class="mt-2" color="secondary" >	
															11:59PM
														</v-chip>
													</v-col>
												</v-row>
												<v-row class="pa-0 ml-0">
													<v-col cols="3" class="pa-0 ma-0">
														<v-card-text class="ml-5 mb-1 pa-0 item-desc">Print Job:</v-card-text>
														<v-card-text class="ml-5 pa-0 item-desc">Workflow:</v-card-text>
													</v-col>
													<v-col cols="3" class="pa-0 mb-2">
														<v-card-text class="ml-0 mb-1 pa-0 item-val">{{report.PrintJobTitle}}</v-card-text>
														<v-card-text class="ml-0 ma-0 pa-0 item-val">{{report.WorkflowTitle}}</v-card-text>
													</v-col>

													<v-col cols="3" class="pa-0 ma-0">
														<v-card-text class="ml-5 mb-1 pa-0 item-desc">Total Time:</v-card-text>
														<v-card-text class="ml-5 pa-0 item-desc">Raster Time:</v-card-text>
													</v-col>
													<v-col cols="3" class="pa-0 mb-2">
														<v-card-text class="ml-0 mb-1 pa-0 item-val">{{report.TotalTimeTaken}} min.</v-card-text>
														<v-card-text class="ml-0 ma-0 pa-0 item-val">{{report.RasterizationTimeTaken}} min. </v-card-text>
													</v-col>
												</v-row>
											</div>
											<!--Workflow has undefined printjob title-->
											<div v-else>
												<v-row class="pa-0 ma-0">
													<v-col class="pa-0 ma-0">
														<v-chip class="ml-2 mt-2" color="primary" >	
															Nov 14
														</v-chip>
														<v-chip class="mt-2" color="secondary" >	
															11:59PM
														</v-chip>
													</v-col>
												</v-row>
												<v-row class="pa-0 ml-0">
													<v-col cols="3" class="pa-0 ma-0">
														<v-card-text class="ml-5 mb-1 pa-0 item-desc">Print Job:</v-card-text>
														<v-card-text class="ml-5 pa-0 item-desc">Workflow:</v-card-text>
													</v-col>
													<v-col cols="3" style="overflow-x:hide;" class="pa-0 mb-2">
														<v-card-text class="ml-0 mb-1 pa-0 item-val">Print Job 1</v-card-text>
														<v-card-text class="ml-0 ma-0 pa-0 item-val">Workflow 1</v-card-text>
													</v-col>
													<v-col cols="3" class="pa-0 ma-0">
														<v-card-text class="ml-5 mb-1 pa-0 item-desc">Total Time:</v-card-text>
														<v-card-text class="ml-5 pa-0 item-desc">Raster Time:</v-card-text>
													</v-col>
													<v-col cols="3" class="pa-0 mb-2">
														<v-card-text class="ml-0 ma-0 pa-0 item-val">{{ report.TotalTimeTaken }} min.</v-card-text>
														<v-card-text class="ml-0 mb-1 pa-0 item-val">{{ report.RasterizationTimeTaken }} min.</v-card-text>
													</v-col>
												</v-row>
												<span style="color:red; margin-left:60px;">Missing Printjob & Workflow Titles, Date, and Time. Using Hardcoded Values. </span>
											</div>
										</v-card>
									</v-list-item>
								</v-list>
							</div>
            </v-card>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import CreateSimulationReport from './SimulationReport/createSimulationReport.vue';

const router = useRouter();
const routeTo = (where) => {
    router.push(where);
};

const message = ref('');
const messageSimulation = ref('');

const workflows = ref([]);
const workflowTitle = ref('');
const selectedWorkflow = ref(null);

const printJobs = ref([]);
const selectedPrintJob = ref(null);

const simulationReportsRaw = ref([]);
const simulationReportsDisplay = ref([]);
const newSimulationReportDialogue = ref(false);
const viewSimulationReportDialogue = ref(false);

const searchValue = ref('');

////////////////////////////
///// INPUT VALIDATION /////
////////////////////////////
const titleValidation = [x => { if (x) return true; return false; }];
const printJobTitleValidation = [x => { if (x) return true; return 'Print job title cannot not be left empty'}];
const selectedWorkflowValidation = [x => { if (x) return true; return 'Workflow must be selected';}];

/**
 * Validate: User inputted a Print Job and  Workflow
 */
const validateGenerateSimulationReport = () => {
	const errors = []; 
	printJobTitleValidation.forEach(rule => {
	   const result = rule(selectedPrintJob.value);
	   if (typeof result === "string"){
		errors.push(result);
	   }
	});

	selectedWorkflowValidation.forEach(rule => {
	    const result = rule(selectedWorkflow.value);
	    if (typeof result === "string"){
		errors.push(result);
	    }     
	});
	if (errors.length > 0){
	    return false;
	}
	return true;  
}

///////////////////////////////
///// Filters and Searching
///////////////////////////////

/**
* Search Print Job and Workflow Titles
*/
const filterSimulationReportsBySearch = () => {
	if (searchValue.value === ''){
		simulationReportsDisplay.value = simulationReportsRaw.value;
		return;
	}
	simulationReportsDisplay.value = simulationReportsRaw.value.filter( (report) => {
		if ((!report.PrintJobTitle) || (!report.WorkflowTitle)){
			return false;
		}
		console.log(report);
		return (report.PrintJobTitle.toLowerCase().includes(searchValue.value.toLowerCase()) || report.WorkflowTitle.toLowerCase().includes(searchValue.value.toLowerCase()));
	});
}

//////////////////////
//// User Actions
//////////////////////

/**
* TODO: IMPLEMENT THIS
* activated when you select a simulation report
*/
const selectSimulationReport = ( id ) => {
	alert("Viewing: " + id);
}

///////////////////
//// API CALLS ////
///////////////////

/**
* Get a simulation report
*/

//const getSimulationReport = async () => {
//    if (!titleValidation[0](printJobTitle.value)) {
//        message.value = 'Print job cannot be left empty';
//        return;
//    }
//    if (!titleValidation[0](workflowTitle.value)) {
//        message.value = 'Workflow cannot be left empty';
//        return;
//    }
//
//    //TODO: make title and workflow not hardcoded
//    const job = "PrintJob 1"; //printJobTitle.value.toString(); 
//    const workflow = "Workflow 1";
//    const apiUrl = `http://api.wsuv-hp-capstone.com/getSimulationReport?title=${encodeURIComponent(job)}&workflow=${encodeURIComponent(workflow)}`;
//
//    await fetch(apiUrl)
//        .then(response => response.json())
//        .then(data => {
//            // Remove fields with "id" in them
//            const cleanData = JSON.parse(JSON.stringify(data), (key, value) => {
//                return key.toLowerCase().includes("id") ? undefined : value;
//            });
//            const report = JSON.stringify(cleanData["SimulationReport"], null, 2);
//            message.value = "Getting Simulation Report for '" + job + "'";
//            simulationReportsRaw.value.push({ title: `${job} with ${workflow}`, details: report });
//        })
//        .catch(error => {
//            message.value = 'Failed to generate report: ' + error;
//        }).finally(() => {
//            setTimeout(() => {
//                message.value = '';
//            }, 3000);
//        });
//}


/**
* Get all print jobs
*/
const getPrintJobs = async () => {
	try {
	    const url = "http://api.wsuv-hp-capstone.com/query?CollectionName=PrintJob&Query={}";
	    const response = await fetch(url, {
		method: 'GET',
		mode: 'cors',
		}
	    );
	    if (response.ok){
		printJobs.value = await response.json();
	    } else {
		console.log("Error fetching data")
		console.log("Response from server: " + response)
	    }
	} catch (error) {
	    console.log('Error fetching list of print jobs');     
	    console.log(error);
	}
}

/**
* Get all workflows.
* @returns Array of workflow objects.
*/
const getWorkflows = async () => {
	try {
	    const url = "http://api.wsuv-hp-capstone.com:80/getWorkflowList";
	    const response = await fetch(url, {
		method: 'GET',
		mode: 'cors',
		}
	    );
	    if (response.ok){
		workflows.value = await response.json();
	    } else {
		console.log("Error fetching data")
		console.log("Response from server: " + response)
	    }
	} catch (error) {
	    console.log('Error fetching list of workflows');     
	}
}

/**
* Get a list of simulation reports
*/
const getSimulationReports = async () => {
	try {
	    const url = "http://api.wsuv-hp-capstone.com:80/getSimulationReportList";
	    const response = await fetch(url, {
		method: 'GET',
		mode: 'cors',
		}
	    );
	    if (response.ok){
		simulationReportsRaw.value = await response.json();
	    } else {
		console.log("Error fetching data");
		console.log("Response from server: " + String(response.status));
	    }
	} catch (error) {
	    console.log('Error fetching list of workflows');     
	}
}

/**
* Submit a print job for simulation.
*/
const generateSimulationReport = async() => {

	//TODO: Uncomment this when backend Simulation Code is done. This API call works but simulation generation isn't fully setup on the backend.
//	try{
//		if (!validateGenerateSimulationReport()){
//		    return;
//		} 
//		console.log(selectedPrintJob.value);
//		console.log(selectedWorkflow.value);
//		const url = "http://api.wsuv-hp-capstone.com/generateSimulationReport?jobID=" + selectedPrintJob.value + "&workflowID=" + selectedWorkflow.value;
//		const response = await fetch(url, {
//			method: 'GET',
//			mode: 'cors',
//			}
//		);
//
//		if (response.ok){
//			console.log(await response.json());
//		}else{
//			console.log("Error fetching data");
//			console.log("Response from server: " + String(response.status));
//		}
//		await getSimulationReports(); //fire off an update to refresh the simulation report list.
//   	}catch (error) {
//		console.log("An error occurred generating the simulation report.");
//	}


	//TODO: Remove this once the backend Simulation code is done.
	if (!validateGenerateSimulationReport()){
	    return;
	} 
	const simReport = { 
			_id: "6736cee539ffcb5b6dd274ad",
			PrintJobID: "694845f123456789abcdef",
			RasterizationTimeTaken: 4,
			TotalTimeTaken: 3,
			WorkflowID: "69818d4123456789abcdef",
			PrintJobTitle: "PrintJob 1",
			WorkflowTitle: "Workflow 1",
			CreationDate: "Nov 13", 
			CreationTime: "8:45PM" 
		};
	simulationReportsRaw.value.push(simReport);
	filterSimulationReportsBySearch();}
	
onMounted( async () => {
	getWorkflows();
	getPrintJobs();
	await getSimulationReports();
	simulationReportsDisplay.value = simulationReportsRaw.value;
});
</script>

<style>
   .exit-button{
			border:none;
			padding:0;
			box-shadow: none;
			background: transparent;
		}
 
    .dashboard-component{
			border:1px;
			width: 400px;
			height: 400px;
    }
 
    .dashboard-container{
    	max-width: 400px;
    }
 
    .v-btn{
      margin: 0 5px;
    }

    .module{
			max-width: 800px;
    }

    .report-history-list{
			height:80%;
			width:100%;
			overflow-y:scroll;
			border-style: groove;
			border-width: 2px;
			border-color:light-grey;
    }

    .report-history-item{
			height:125px;
			width:100%;
			border-style:solid;
			border-width:1px;
			border-color:black;
			border-radius:0px;
    }

    .report-history-item:hover{
    	opacity: 0.6;
	cursor: pointer;
    }

    .simulation-report-search-box{
	max-width: 400px;
	max-height:100px;
    }

    .item-desc{
	font-weight:bold;
	font-size:large;
    }

    .item-val{
	font-size:large;
    }

</style>

