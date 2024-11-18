<template>
    <v-app theme="light">
        <v-banner max-height="60px" style="font-size:large; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-weight: bold;">New Simulation Report</v-banner>
        <v-row class="mt-1 pl-6 pr-6">
            <v-col>
                <v-autocomplete :items="printJobs" label="Select Print Job"></v-autocomplete>
                <v-card>
                    <v-text-field density="compact" disabled label="Date Created"></v-text-field>
                    <v-text-field density="compact" disabled label="Page Count"></v-text-field>
                    <v-text-field density="compact" disabled label="Rasterization Profile"></v-text-field>
                </v-card>
            </v-col>
            <v-col>
                <v-autocomplete label="Select Workflow"></v-autocomplete>
                <v-card>
                    <v-text-field density="compact" disabled label="Title"></v-text-field>
                    <v-text-field density="compact" disabled label="Number of steps"></v-text-field>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="pl-3 pr-3" justify="center">
            <v-col cols="2" align="center">
                <v-btn color="error" @click="$emit('exit')">Cancel</v-btn>
            </v-col>
            <v-col cols="2" align="center">
                <v-btn color="success">Submit</v-btn>
            </v-col>
        </v-row>
    </v-app>
</template>

<script setup>
import { onMounted, ref } from "vue";

// Component refs
const message = ref('');
const printJobTitle = ref('');
const workflowTitle = ref('');
const printJobs = ref([]);
const workflows = ref([]);

/**
 * Get an array of the current print jobs
 */
const getPrintJobs = async () => {
    return [];
    // try {
    //     const url = "http://api.wsuv-hp-capstone.com:80/getPrintJobList";
    //     const response = await fetch(url, {
    //         method: 'GET',
    //         mode: 'cors',
    //         }
    //     );
    //     if (response.ok){
    //         return await response.data;
    //     } else {
    //         console.log("Error fetching data")
    //         console.log("Response from server: " + response)
    //     }
    // } catch (error) {
    //     console.log('Error fetching list of workflows');     
    // }
}

/**
 * Get an array of the current workflows
 */
const getWorkflows = async () => {
    return [];
}

/**
 * Submit a new simulation report to the server.
 * Server will process and return the id of the simulation report.
 * @param title
 * @param workflow
 */
const createSimulationReport = (title, workflow) => {

}

const titleValidation = [
    x => { if (x) return true; return false; }
];

onMounted( async () => {
    printJobs.value = await getPrintJobs();
    workflows.value = await getWorkflows();
});


</script>

<style>
</style>
