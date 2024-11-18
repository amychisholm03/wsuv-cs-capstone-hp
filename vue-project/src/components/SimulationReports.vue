<template>
	<v-app theme="light">
		<v-dialog scrollable persistent class="create-report" max-width="700px" style="max-height:600px; margin:0px;"
			v-model="newSimulationReportDialogue">
			<create-simulation-report @exit="newSimulationReportDialogue = false"></create-simulation-report>
		</v-dialog>
		<v-toolbar class="toolbar">
			<v-toolbar-title class="header">Simulation</v-toolbar-title>
		</v-toolbar>
		<v-main class="pa-3">
			<v-card
        class="large-module pa-3 mb-3"
      >
        <simulation-report-history style="width:100%;" :printJobs="printJobs" :workflows="workflows" :simulationReports="simulationReports"></simulation-report-history>
      </v-card>
			<v-card
        class="module pa-3 mb-3"
      >
		      <simulation-report-generate style="height:300px; width:800px;" @create="getSimulationReports" :printJobs="printJobs" :workflows="workflows"></simulation-report-generate>
      </v-card>
		</v-main>
	</v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import CreateSimulationReport from './SimulationReport/createSimulationReport.vue';
import SimulationReportHistory from './SimulationReport/simulation-report-history.vue';
import SimulationReportGenerate from './SimulationReport/simulation-report-generate.vue';

const workflows = ref([]);
const printJobs = ref([]);
const simulationReports = ref([]);
const newSimulationReportDialogue = ref(false);

//////////////////////
//// User Actions
//////////////////////

/**
* TODO: IMPLEMENT THIS
* activated when you select a simulation report
*/
const selectSimulationReport = (id) => {
	alert("Viewing: " + id);
}

///////////////////
//// API CALLS ////
///////////////////

/**
* Get all print jobs
*/
const getPrintJobs = async () => {
	try {
		const url = "http://api.wsuv-hp-capstone.com/query?CollectionName=PrintJob&Query={}";
		const response = await fetch(url, {
			method: 'GET',
			mode: 'cors',
		});
		if (response.ok) {
			printJobs.value = await response.json();
		} else {
			console.log("Error fetching data");
			console.log("Response from server: " + response);
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
		});
		if (response.ok) {
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
		});
		if (response.ok) {
			simulationReports.value = await response.json();
    } else {
			console.log("Error fetching data");
			console.log("Response from server: " + String(response.status));
		}
	} catch (error) {
		console.log('Error fetching list of workflows');
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
	font-size: large;
}

.item-val {
	font-size: large;
}
</style>
