<template>
  <v-app>
    <v-row class="mb-2 ml-1">
      <v-col class="d-flex align-center justify-start" style="font-size:x-large;">
        <span class="module-title">Simulation Report History</span>
      </v-col>
      <v-col class="d-flex justify-end">
        <v-menu location="start" :close-on-content-click="false" transition="slide-x-reverse-transition" v-model="drawer">
          <template v-slot:activator="{ props }">
            <v-btn
              @click="drawer=!drawer;"
              v-bind="props"
              icon
              class="mb-2 mt-1"
              tile
            >
              <v-icon>mdi-filter</v-icon>
            </v-btn>
          </template>
          <v-card width="300px" class="pa-5">
            <v-col>
              <v-row>
                <v-text-field
                  v-model="searchValue"
                  @update:modelValue="filter"
                  single-line
                  density="compac"
                  label="Search Reports"
                  append-icon="mdi-magnify"
                />
              </v-row>
              <v-divider></v-divider>
              <v-row class="mt-1 mb-2">
                <v-col class="ma-0 pa-0">
                  <v-text-field flat solo-filled hide-details outlined density="compac" single-line v-model="fromDate" label="From" type="datetime-local">
                  </v-text-field>
                </v-col>
                <v-col class="ma-0 ml-2 pa-0">
                  <v-text-field flat hide-details style="font-size:xx-small" outlined density="compac" single-line v-model="toDate" label="To" type="datetime-local">
                  </v-text-field>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="mt-3 mb-1">
                <v-col class="ma-0 pa-0">
                  <v-autocomplete density="compac" variant="solo-filled" single-line style="overflow-y:auto" @update:modelValue="filter" multiple v-model="selectedPrintJobs" :items="printJobs" item-title="Title" item-value="Title" label="Print Job">
                  </v-autocomplete>
                  <v-autocomplete density="compac" variant="solo-filled" single-line @update:modelValue="filter" multiple v-model="selectedWorkflows" :items="workflows" item-title="Title" item-value="Title" label="Workflow">
                  </v-autocomplete>
                </v-col>
              </v-row>
            </v-col>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
      <div style="width:98%;" class="report-history-table">
      <v-list style="margin:0; padding:0;">
      <v-list-item v-for="(report, index) in simulationReportsDisplay" style="margin:0; padding:0;"
        :key="index">
        <v-card class="report-history-item" @click="$emit('select-report', report.id)">
          <!--Workflow has defined printjob title-->
          <div >
            <v-row class="pa-0 ml-0 mt-2">
              <v-col cols="3" class="pa-0 ma-0">
                <v-card-text class="ml-5 mb-1 pa-0 item-desc">Print Job:</v-card-text>
                <v-card-text class="ml-5 pa-0 item-desc">Workflow:</v-card-text>
              </v-col>

              <v-col cols="3" class="pa-0 mb-2">
                <v-card-text
                  class="ml-0 mb-1 pa-0 item-val">{{ report.PrintJobTitle ? report.PrintJobTitle : 'N/A' }}</v-card-text>
                <v-card-text
                  class="ml-0 ma-0 pa-0 item-val">{{ report.WorkflowTitle ? report.WorkflowTitle : 'N/A' }}</v-card-text>
              </v-col>

              <v-col cols="3" class="pa-0 ma-0">
                <v-card-text class="ml-5 mb-1 pa-0 item-desc">Total Time:</v-card-text>
              </v-col>
              <v-col cols="3" class="pa-0 mb-2">
                <v-card-text class="ml-0 mb-1 pa-0 item-val">{{ report.TotalTimeTaken ? report.TotalTimeTaken : 'N/A' }}
                  secs.</v-card-text>
              </v-col>
            </v-row>
            <v-row class="pa-0 ml-0 mb-0 mt-2">
              <v-col cols="3" class="pa-0 ma-0">
                <v-card-text class="ml-5 mb-1 pa-0 item-desc">Created:</v-card-text>
              </v-col>
              <v-col cols="3" class="pa-0 ma-0">
                <v-card-text class="ml-0 ma-0 pa-0 item-val">
                    {{ report.Date }} @ {{ report.Time }}
                </v-card-text>
              </v-col>
            </v-row>
          </div>
         </v-card>
      </v-list-item>
    </v-list>
  </div>
  </v-app>
</template>

<script setup>
  import { nextTick, ref, onMounted, watch } from "vue";

  /*
    Props
  */
  const {simulationReports, workflows, printJobs} = defineProps({
      simulationReports: Array,
      workflows : Array,
      printJobs: Array,
    });

  /*
    Emits
  */
  const emit = defineEmits(['select-report']);

  /*
    Reactive Variables
  */
  const simulationReportsDisplay = ref([]);
  const searchValue = ref('');
  const drawer = ref(false);
  const selectedPrintJobs = ref([]);
  const selectedWorkflows = ref([]);
  const fromDate = ref(null);
  const toDate = ref(null);

  ///////////////////////////////
  ///// Filters and Searching
  ///////////////////////////////
  /**
  * Search Print Job and Workflow Titles
  */
  const filter = () => {

    nextTick(() => {
      const printJobLookup = {};
      const workflowLookup = {};

      selectedPrintJobs.value.forEach( (job) => {
        printJobLookup[job] = true;
      });

      selectedWorkflows.value.forEach( (flow) => {
        workflowLookup[flow] = true;
      });

      const filteringJobs = (selectedPrintJobs.value.length > 0);
      const filteringWorkflows = (selectedWorkflows.value.length > 0);

      simulationReportsDisplay.value = simulationReports.filter( (report) => {
        if (filteringWorkflows && workflowLookup[report.WorkflowTitle] === undefined){
          return false;
        }
        if (filteringJobs && printJobLookup[report.PrintJobTitle] === undefined){
          return false;
        }
        return true;
      });

      if (searchValue.value === '') {
        return;
      }

      simulationReportsDisplay.value = simulationReportsDisplay.value.filter((report) => {
        if ((!report.PrintJobTitle) || (!report.WorkflowTitle)) {
          return false;
        }
        return (report.PrintJobTitle.toLowerCase().includes(searchValue.value.toLowerCase()) || report.WorkflowTitle.toLowerCase().includes(searchValue.value.toLowerCase()));
      });
    });
  }

  watch(
    () => simulationReports,
    (newReports) => {
      simulationReportsDisplay.value = newReports;
      filter();
    },
    { immediate: true }
  );

  onMounted( async () => {
    simulationReportsDisplay.value = simulationReports;
  });

</script>


<style>
.report-history-item {
  height:125px;
  border-width:1px;
  border-left-width:0px;
  border-right-width:0px;
  border-top-width:1px;
  margin-bottom:0px;
}

.report-history-table {
  height:98vh;
  border-width:1px;
  border-style:solid;
  border-color:rgba(0, 0, 0, 0.1);
  margin:5px;
  overflow-y:auto;
}

.report-history-item:hover {
	opacity: 0.5;
	cursor: pointer;
}
</style>

