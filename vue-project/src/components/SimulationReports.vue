<template>
    <v-app theme="light">
        <v-dialog scrollable persistent class="create-report" max-width="700px" style="max-height:600px; margin:0px;" v-model="newSimulationReportDialogue">
            <create-simulation-report @exit="newSimulationReportDialogue=false"></create-simulation-report>
        </v-dialog>
        <v-toolbar class="toolbar">
            <v-toolbar-title class="header">Simulation Reports</v-toolbar-title>
        </v-toolbar> 
        <v-main class="ma-3 pa-3">
            <v-btn color="success mb-2" @click="newSimulationReportDialogue=true">New Simulation Report</v-btn>
            <v-card style="border-width:2px;">
                <v-card-title>Report History</v-card-title>
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

// Router
const router = useRouter();
const routeTo = (where) => {
    router.push(where);
};

// Component refs
const message = ref('');
const printJobTitle = ref('');
const workflowTitle = ref('');
const simulationReports = ref([]);
const newSimulationReportDialogue = ref(false);
const viewSimulationReportDialogue = ref(false);

const titleValidation = [
    x => { if (x) return true; return false; }
];

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
</script>

<style>
</style>
