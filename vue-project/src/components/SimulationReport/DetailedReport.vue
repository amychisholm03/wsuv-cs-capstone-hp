<template>
    <v-app>
        <v-banner max-height="75px" style="border-width: 0px; font-size:large; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-weight: bold;">
            <v-row>
                <v-col
                    class="d-flex align-center justify-start"
                >
                Detailed Simulation Report
                </v-col>
                <v-col 
                    cols="2"
                    class="d-flex align-center justify-end"
                    align="right"
                >
                    <v-btn 
                        class="close-button d-flex align-center"
                        @click="$emit('exit')"
                        icon 
                        tile
                    >
                        <v-icon>
                        mdi-window-close
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-banner>
        <v-row class="mt-1 pl-6 pr-6">
            <v-col>
                <v-text-field :readonly="true" density="compact" label="Date Created" v-model="dateTime"></v-text-field>
                <v-text-field :readonly="true" density="compact" label="Print Job Title" v-model="printJob.Title"></v-text-field>
                <v-text-field :readonly="true" density="compact" label="Page Count" v-model="printJob.PageCount"></v-text-field>
                <v-text-field :readonly="true" density="compact" label="Rasterization Profile" v-model="printJob.RasterizationProfile"></v-text-field>
                <v-text-field :readonly="true" density="compact" label="Total Time Taken (secs)" v-model="report.TotalTimeTaken"></v-text-field>
            </v-col>
            <v-col>
                <v-text-field :readonly="true" density="compact" label="Workflow Title" v-model="workflow.Title"></v-text-field>
                <v-text-field :readonly="true" density="compact" label="Number of Steps" v-model="workflow.WorkflowSteps.length"></v-text-field>
                <v-list>
                    <v-text-field :readonly="true" density="compact" label="Workflow Steps"></v-text-field>
                    <v-list-item v-for="(time, step) in report.StepTimes" :key="step">
                    <span>
                        <v-list-item-title> <strong>Step: </strong>{{ step }}</v-list-item-title>
                        <v-list-item-subtitle> <strong>Time Taken:</strong> {{ time }} secs</v-list-item-subtitle>
                    </span>
                    </v-list-item>
                </v-list>
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

const dateTime = ref("");

onMounted(async () => {
    dateTime.value = props.report.Date + "  " + props.report.Time
});
</script>

<style scoped>
.close-button:hover {
    color: red;
}
</style>