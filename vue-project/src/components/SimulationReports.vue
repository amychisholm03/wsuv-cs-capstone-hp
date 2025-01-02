<template>
	<v-app>
		<v-dialog scrollable persistent class="detailed-report" max-width="500px" v-model="SimulationReportDialogue" content-class="overflow-y-auto">
			<div style="max-height: 60vh; overflow-y: hidden; overflow-x:hidden;">
				<detailed-report @exit="SimulationReportDialogue = false" :report="selectedReport" :printJob="selectedPrintJob" :workflow="selectedWorkflow"></detailed-report>
			</div>
		</v-dialog>
		<v-main class="pa-3">
			<v-card style="width:700px" class="large-module pa-3 mb-3">
        		<simulation-report-history style="width:100%;" :printJobs="printJobs" @selectreport="selectSimulationReport" :workflows="workflows" :simulationReports="simulationReports"></simulation-report-history>
      		</v-card>
			<v-card class="module pa-3 mb-3">
		      <simulation-report-generate style="height:300px; width:800px;"  @create="getSimulationReports" :printJobs="printJobs" :workflows="workflows"></simulation-report-generate>
      		</v-card>
		</v-main>
	</v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import DetailedReport from './SimulationReport/DetailedReport.vue';
import SimulationReportHistory from './SimulationReport/simulation-report-history.vue';
import SimulationReportGenerate from './SimulationReport/simulation-report-generate.vue';
import { API_URL, API_PORT } from "../consts.js";

const workflows = ref([]);
const printJobs = ref([]);
const simulationReports = ref([]);
const SimulationReportDialogue = ref(false);

const selectedReport = ref(null)
const selectedPrintJob = ref(null)
const selectedWorkflow = ref(null)

//////////////////////
//// User Actions
//////////////////////

/**
* TODO: IMPLEMENT THIS
* activated when you select a simulation report
*/
const selectSimulationReport = (id) => {
	selectedReport.value = simulationReports.value.find(item => item._id === id)
	selectedPrintJob.value = printJobs.value.find(item => item._id === selectedReport.value.PrintJobID)
	selectedWorkflow.value = workflows.value.find(item => item._id === selectedReport.value.WorkflowID)
	SimulationReportDialogue.value = true
}

///////////////////
//// API CALLS ////
///////////////////

/**
* Get all print jobs
*/
const getPrintJobs = async () => {
	try {
		const url = `${API_URL}:${API_PORT}/query?CollectionName=PrintJob&Query={}`;
		const response = await fetch(url, {
			method: 'GET',
			mode: 'cors',
		});
		if (response.ok) {
			printJobs.value = await response.json();
		} else {
			console.log("Error fetching data. Response from server: " + String(response.status));
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
		const url = `${API_URL}:${API_PORT}/getWorkflowList`;
		const response = await fetch(url, {
			method: 'GET',
			mode: 'cors',
		});
		if (response.ok) {
			workflows.value = await response.json();
		} else {
			console.log("Error fetching data. Response from server: " + String(response.status))
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
		const url = `${API_URL}:${API_PORT}/getSimulationReportList`;
		const response = await fetch(url, {
			method: 'GET',
			mode: 'cors',
		});
		if (response.ok) {
			simulationReports.value = await response.json();
      		simulationReports.value.forEach( (report) => {
        	const dateObj = new Date(report.CreationTime);
        	report.Date= dateObj.getMonth()+1  + "/" + dateObj.getDate() + "/" + dateObj.getFullYear();
			let hours = dateObj.getHours().toString();
			let minutes = dateObj.getMinutes().toString();
			if (hours.length == 1){
				hours = '0' + hours;
			}
			if (minutes.length == 1){
				minutes = '0' + minutes;
			}

        	report.Time = hours + ":" + minutes;
      });
    } else {
			console.log("Error fetching data. Response from server: " + String(response.status));
		}
	} catch (error) {
		console.log('Error fetching list of simulation reports.');
	}
}

onMounted(async () => {
	getWorkflows();
	getPrintJobs();
	await getSimulationReports();
});
</script>

<style>
.exit-button {
	border: none;
	padding: 0;
	box-shadow: none;
	background: transparent;
}

.dashboard-component {
	border: 1px;
	width: 400px;
	height: 400px;
}

.dashboard-container {
	max-width: 400px;
}

.v-btn {
	margin: 0 5px;
}

.module {
  max-width:800px;
  border-width:2px;
  border-color:dark-grey;
  padding:16px;
}

.large-module{
  max-width:1300px;
  border-width:2px;
  border-color:dark-grey;
}

.report-history-list {
	height: 90vh;
	width: 100%;
	overflow-y: scroll;
}


.simulation-report-search-box {
	max-width: 400px;
	max-height: 100px;
}

.item-desc {
	font-weight: bold;
	font-size: x-small;
}

.item-val {
	font-size: x-small;
}

</style>
