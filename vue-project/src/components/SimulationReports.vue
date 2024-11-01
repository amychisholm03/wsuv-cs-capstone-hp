<template>
    <v-app theme="light">
        <v-toolbar>
            <v-btn class="pa-3 ma-3 drawer-button" tile icon="$menu" @click="drawer = !drawer"></v-btn>
            <v-toolbar-title>Simulation Reports</v-toolbar-title>
        </v-toolbar>

        <!-- Sidebar -->
        <v-navigation-drawer temporary v-model="drawer" theme="light">
            <v-row class="pa-4">
                <v-btn block tile color="light-blue-lighten-1" @click="routeTo('/')">Dashboard</v-btn>
            </v-row>

            <v-row>
                <v-btn block tile @click="routeTo('/PrintJobs')">Print Jobs</v-btn>
            </v-row>

            <v-row>
                <v-btn block tile @click="routeTo('/Workflows')">Workflows</v-btn>
            </v-row>

            <v-row>
                <v-btn block tile @click="routeTo('/SimulationReports')">Simulation Reports</v-btn>
            </v-row>
        </v-navigation-drawer>

        <v-main>
            <v-card class="ma-3 pa-3" style="border-width:2px;">
                <v-card-title>Generate a Simulation Report for a Print Job</v-card-title>
                <v-form ref="simulationReportForm" fast-fail @submit.prevent="getSimulationReport">
                    <v-row>
                        <v-col cols="5">
                            <v-text-field :rules="titleValidation" label="Print Job Title/Name"
                                v-model="printJobTitle" />
                        </v-col>
                        <v-col cols="5">
                            <v-text-field :rules="titleValidation" label="Workflow Title/Name"
                                v-model="workflowTitle" />
                        </v-col>
                        <v-col cols="2" class="d-flex justify-center align-center">
                            <v-btn type="submit" class="mb-2" color="primary">Generate Report</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
                <v-alert class="mt-2" style="background-color:white;">{{ message }}</v-alert>
            </v-card>
            <v-card class="ma-3 pa-3" style="border-width:2px;">
                <v-card-title>Previous Simulation Reports</v-card-title>
                <v-list>
                    <v-list-item v-for="(report, index) in simulationReports" :key="index">
                        <v-list-item-content>
                            <v-list-item-title>{{ report.title }}</v-list-item-title>
                            <v-list-item-subtitle>{{ report.details }}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';

// Router
const router = useRouter();
const routeTo = (where) => {
    router.push(where);
};

// Component refs
const message = ref('');
const drawer = ref(false);
const printJobTitle = ref('');
const workflowTitle = ref('');
const simulationReports = ref([]);

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
            message.value = "Simulation Report for '" + job + "' generated.";
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
.drawer-button {
    text-align: left;
}
</style>
