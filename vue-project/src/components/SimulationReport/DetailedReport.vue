<template>
    <v-app>
        <v-banner max-height="200px" style="font-size:large; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-weight: bold;">
            Detailed Simulation Report
        </v-banner>
        <v-row class="mt-1 pl-6 pr-6">
            <v-col>
                <v-card>
                    <v-text-field density="compact" disabled label="Date Created" v-model="dateTime"></v-text-field>
                    <v-text-field density="compact" disabled label="Print Job Title" v-model="printJob.Title"></v-text-field>
                    <v-text-field density="compact" disabled label="Page Count" v-model="printJob.PageCount"></v-text-field>
                    <v-text-field density="compact" disabled label="Rasterization Profile" v-model="printJob.RasterizationProfile"></v-text-field>
                    <v-text-field density="compact" disabled label="Total Time Taken (secs)" v-model="report.TotalTimeTaken"></v-text-field>
                    <v-text-field density="compact" disabled label="Rasterization Time Taken (secs)" v-model="report.RasterizationTimeTaken"></v-text-field>


                </v-card>
            </v-col>
            <v-col>
                <v-card>
                    <v-text-field density="compact" disabled label="Workflow Title" v-model="workflow.Title"></v-text-field>
                    <v-text-field density="compact" disabled label="Number of Steps" v-model="workflow.WorkflowSteps.length"></v-text-field>
                    <v-list class="faded-list">
                        <v-text-field density="compact" label="Workflow Steps"></v-text-field>
                        <v-list-item v-for="step in steps" :key="step.Title">
                        <v-list-item-content>
                            <v-list-item-title> <light>Step: </light>{{ step.Title }}</v-list-item-title>
                            <v-list-item-subtitle> <light>Setup Time:</light> {{ step.SetupTime }}</v-list-item-subtitle>
                            <v-list-item-subtitle> <light>Time per Page:</light> {{ step.TimePerPage }}</v-list-item-subtitle>
                        </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="pl-3 pr-3" justify="center">
            <v-col cols="2" align="right">
                <v-btn color="black" @click="$emit('exit')">Close</v-btn>
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
const steps = ref([]);
const dateTime = ref("");

onMounted(async () => {
    dateTime.value = props.report.Date + "  " + props.report.Time
    const stepsList = ref([]);
    try {
        const url = "http://api.wsuv-hp-capstone.com:80/getWorkflowStepList";
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            }
        );
        if (response.ok){ 
            stepsList.value = await response.json();
        } else {
            console.log("Error fetching data. Response from server: " + String(response.status))
        }
    } catch (error) {
        console.log('Error fetching list of workflow steps');     
    }


    for (let i = 0; i < props.workflow.WorkflowSteps.length; i++){
        const id = props.workflow.WorkflowSteps[i]
        const step = stepsList.value.find(item => item._id === id)
        steps.value.push(step)
    }

});
</script>

<style>
.faded-list {
  color: rgba(0, 0, 0, 0.38);
}

.faded-list v-list-item-title,
.faded-list v-list-item-subtitle {
  color: inherit;
}
</style>