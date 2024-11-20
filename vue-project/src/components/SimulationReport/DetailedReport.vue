<template>
    <v-app>
        <v-banner max-height="60px" style="font-size:large; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-weight: bold;">
            Detailed Simulation Report
        </v-banner>
        <v-row class="mt-1 pl-6 pr-6">
            <v-col>
                <v-card>
                    <v-text-field density="compact" disabled label="Date Created" v-model="report.CreationTime"></v-text-field>
                    <v-text-field density="compact" disabled label="Print Job Title" v-model="printJob.Title"></v-text-field>
                    <v-text-field density="compact" disabled label="Page Count" v-model="printJob.PageCount"></v-text-field>
                    <v-text-field density="compact" disabled label="Rasterization Profile" v-model="printJob.RasterizationProfile"></v-text-field>
                </v-card>
            </v-col>
            <v-col>
                <v-card>
                    <v-text-field density="compact" disabled label="Workflow Title">  </v-text-field>
                    <v-text-field density="compact" disabled label="Number of Steps"> </v-text-field>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="pl-3 pr-3" justify="center">
            <v-col cols="2" align="right">
                <v-btn color="error" @click="$emit('exit')">Exit</v-btn>
            </v-col>
        </v-row>
    </v-app>
</template>

<script setup>
import { onMounted, ref } from "vue";

// Component refs
const SimulationReportDialogue = ref(false);
const props = defineProps({
    report: Object,
    workflow: Object,
    printJob: Object,
});
</script>

<style>
</style>