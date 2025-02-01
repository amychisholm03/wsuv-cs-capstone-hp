<template>
  <v-app>
    <v-banner
      max-height="75px"
      style="border-width: 0px; font-size:large; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-weight: bold;"
    >
      <v-row>
        <v-col
          class="align-center d-flex justify-start"
        >
          Detailed Simulation Report
        </v-col>
        <v-col
          cols="2"
          class="align-center d-flex justify-end"
          align="right"
        >
          <v-btn
            class="align-center close-button d-flex"
            icon
            tile
            @click="$emit('exit')"
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
        <v-text-field
          v-model="dateTime"
          :readonly="true"
          density="compact"
          label="Date Created"
        ></v-text-field>
        <v-text-field
          v-model="report.PrintJobTitle"
          :readonly="true"
          density="compact"
          label="Print Job Title"
        ></v-text-field>
        <v-text-field
          v-model="printJob.PageCount"
          :readonly="true"
          density="compact"
          label="Page Count"
        ></v-text-field>
        <v-text-field
          v-model="report.RasterizationProfile"
          :readonly="true"
          density="compact"
          label="Rasterization Profile"
        ></v-text-field>
        <v-text-field
          v-model="report.TotalTimeTaken"
          :readonly="true"
          density="compact"
          label="Total Time Taken (secs)"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="report.WorkflowTitle"
          :readonly="true"
          density="compact"
          label="Workflow Title"
        ></v-text-field>
        <v-text-field
          v-model="workflow.WorkflowSteps.length"
          :readonly="true"
          density="compact"
          label="Number of Steps"
        ></v-text-field>
        <v-list>
          <v-text-field
            :readonly="true"
            density="compact"
            label="Workflow Steps"
          ></v-text-field>
          <v-list-item
            v-for="(time, step) in report.StepTimes"
            :key="step"
          >
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
