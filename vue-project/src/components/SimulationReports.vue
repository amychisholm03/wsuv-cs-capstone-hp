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
            <v-card class="ma-3 pa-3" style="width:85vw; border-width:2px;">
                <v-card-title>Get a Simulation Report from a Print Job</v-card-title>
                <v-form ref="simulationReportForm" fast-fail @submit.prevent="getSimulationReport">
                    <v-text-field :rules="titleValidation" label="Print Job Title/Name" v-model="printJobTitle" />
                    <v-btn type="submit" class="mb-2">Generate Report</v-btn>
                </v-form>
                <v-alert class="mt-2" style="background-color:white;">{{ message }}</v-alert>
            </v-card>
            <v-card class="ma-3 pa-3" style="width:85vw; height:400px; border-width:2px;">
                <v-card-title>Previous Simulation Reports</v-card-title>
            </v-card>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();
const routeTo = (where) => {
    router.push(where);
};

const message = ref('');
const drawer = ref(false);
const printJobTitle = ref('');

const titleValidation = [
    x => { if (x) return true; return false; }
];

const getSimulationReport = async () => {
    if (!titleValidation[0](printJobTitle.value)) {
        message.value = 'Title cannot be left empty';
        return;
    }

    //TODO: make title and workflow not hardcoded
    const title = "PrintJob 1"; //printJobTitle.value.toString(); 
    const workflow = "Workflow 1";
    const apiUrl = `http://api.wsuv-hp-capstone.com/getSimulationReport?title=${encodeURIComponent(title)}&workflow=${encodeURIComponent(workflow)}`;

    await fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            message.value = JSON.stringify(data, null, 2); // For displaying raw JSON as a string
        })
        .catch(error => {
            message.value = 'Failed to generate report: ' + error;
        });
}
</script>

<style>
.drawer-button {
    text-align: left;
}
</style>
