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
                <v-card-title class="mb-5">New Simulation</v-card-title> 
                <v-form class="pa-2"ref="selectPreviousWorkflowForm" fast-fail @submit.prevent="submitPrintJob">
                    <v-text-field :rules="printJobTitleValidation" label="Print Job Title" v-model="printJobTitle" />
                    <v-select
                        v-model="selectedWorkflow"
                        :rules="selectedWorkflowValidation"
                        :items="previousWorkflows"
                        label="Select Workflow"
                        item-title="Title"
                        item-value="WorkflowID"
                        outlined
                    >
                        <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props" ></v-list-item>
                        </template>
                    </v-select>
                    <v-btn type="submit" class="mb-2" color="light-blue-darken-4">Generate Simulation Report</v-btn>
                    <v-alert class="mt-2" style="background-color:white;">{{ message1 }}</v-alert>
                </v-form>     
            </v-card>

            <v-card class="module pa-3 mb-3" style="border-width:2px;">
                <v-card-title>Simulation Report History</v-card-title>
                <v-list>
                    <v-list-item v-for="(report, index) in simulationReports" :key="index">
                        <!-- <v-list-item-content>
                            <v-list-item-title>{{ report.title }}</v-list-item-title>
                            <v-list-item-subtitle>{{ report.details }}</v-list-item-subtitle>
                        </v-list-item-content> -->
                    </v-list-item>
                </v-list>
            </v-card>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import CreateSimulationReport from './SimulationReport/createSimulationReport.vue';

const router = useRouter();
const routeTo = (where) => {
    router.push(where);
};

const message = ref('');
const printJobTitle = ref('');
const workflowTitle = ref('');
const simulationReports = ref([]);
const newSimulationReportDialogue = ref(false);
const viewSimulationReportDialogue = ref(false);

////////////////////////////
///// INPUT VALIDATION /////
////////////////////////////

const titleValidation = [
    x => { if (x) return true; return false; }
];

const printJobTitleValidation = [
	x => { if (x) return true; return 'Print job title cannot not be left empty'}
];

const selectedWorkflowValidation = [
	x => { if (x) return true; return 'Workflow must be selected';}
];

const validateSubmitJob = () => {
	const errors = []; 
	printJobTitleValidation.forEach(rule => {
	    const result = rule(printJobTitle.value);
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

///////////////////
//// API CALLS ////
///////////////////

/**
* Get a simulation report
* @returns A single simulation report object.
*/
const getSimulationReport = async () => {
    if (!titleValidation[0](printJobTitle.value)) {
        message.value = 'Print job cannot be left empty';
        return;
    }
    if (!titleValidation[0](workflowTitle.value)) {
        message.value = 'Workflow cannot be left empty';
        return;
    }

    //TODO: make title and workflow not hardcoded
    const job = "PrintJob 1"; //printJobTitle.value.toString(); 
    const workflow = "Workflow 1";
    const apiUrl = `http://api.wsuv-hp-capstone.com/getSimulationReport?title=${encodeURIComponent(job)}&workflow=${encodeURIComponent(workflow)}`;

    await fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Remove fields with "id" in them
            const cleanData = JSON.parse(JSON.stringify(data), (key, value) => {
                return key.toLowerCase().includes("id") ? undefined : value;
            });
            const report = JSON.stringify(cleanData["SimulationReport"], null, 2);
            message.value = "Getting Simulation Report for '" + job + "'";
            simulationReports.value.push({ title: `${job} with ${workflow}`, details: report });
        })
        .catch(error => {
            message.value = 'Failed to generate report: ' + error;
        }).finally(() => {
            setTimeout(() => {
                message.value = '';
            }, 3000);
        });
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
		previousWorkflows.value = await response.json();
	    } else {
		console.log("Error fetching data")
		console.log("Response from server: " + response)
	    }
	} catch (error) {
	    console.log('Error fetching list of workflows');     
	}
}

/**
* Submit a print job for simulation.
*/
const submitPrintJob = async () => {
	if (!validateSubmitJob()){
	    return;
	} 
	const workflow = previousWorkflows.value.find(workflow => workflow.WorkflowID === selectedWorkflow.value);
	message1.value = printJobTitle.value + " has been submitted using the workflow: " + workflow.Title;
	setTimeout(() => {
	  message1.value = '';
	}, 3000);
    }
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
	max-width: 600px;
    }
</style>
