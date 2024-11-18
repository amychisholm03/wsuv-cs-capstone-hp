<template>
  <v-app>
    <v-row class="mb-2 ml-1">
      <v-col class="d-flex align-center justify-start" style="font-size:x-large;">
        <span class="module-title" style="font-size:larger;">Simulation Report History</span>
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
          <v-card width="600px" height="300px" class="pa-5">
            <v-col>
              <v-row>
                <v-text-field
                  v-model="searchValue"
                  @update:modelValue="filter"
                  label="Search Reports"
                />
              </v-row>
              <v-row class="">
                <v-col class="ma-0 pa-0">
                  <v-text-field outlined label="From" type="datetime-local">
                  </v-text-field>
                </v-col>
                <v-col class="ma-0 ml-2 pa-0">
                  <v-text-field outlined label="To" type="datetime-local">
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row class="">
                <v-col class="ma-0 pa-0">
                  <v-autocomplete @update:modelValue="filter" multiple v-model="selectedPrintJobs" :items="printJobs" item-title="Title" item-value="Title" label="Filter by Print Job">
                  </v-autocomplete>
                </v-col>
                <v-col class="ma-0 ml-2 pa-0">
                  <v-autocomplete @update:modelValue="filter" multiple v-model="selectedWorkflows" :items="workflows" item-title="Title" item-value="Title" label="Filter by Workflow">
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
        <v-card class="report-history-item" @click="$emit('selectreport', report._id)">
          <!--Workflow has defined printjob title-->
          <div v-if="report.PrintJobTitle">
            <v-row>
              <v-col>
                <v-chip class="ml-2 mt-2" color="primary">
                  Nov 14
                </v-chip>
                <v-chip class="mt-2" color="secondary">
                  11:59PM
                </v-chip>
              </v-col>
            </v-row>
            <v-row class="pa-0 ml-0">
              <v-col cols="3" class="pa-0 ma-0">
                <v-card-text class="ml-5 mb-1 pa-0 item-desc">Print Job:</v-card-text>
                <v-card-text class="ml-5 pa-0 item-desc">Workflow:</v-card-text>
              </v-col>
              <v-col cols="3" class="pa-0 mb-2">
                <v-card-text
                  class="ml-0 mb-1 pa-0 item-val">{{ report.PrintJobTitle }}</v-card-text>
                <v-card-text
                  class="ml-0 ma-0 pa-0 item-val">{{ report.WorkflowTitle }}</v-card-text>
              </v-col>

              <v-col cols="3" class="pa-0 ma-0">
                <v-card-text class="ml-5 mb-1 pa-0 item-desc">Total Time:</v-card-text>
                <v-card-text class="ml-5 pa-0 item-desc">Raster Time:</v-card-text>
              </v-col>
              <v-col cols="3" class="pa-0 mb-2">
                <v-card-text class="ml-0 mb-1 pa-0 item-val">{{ report.TotalTimeTaken }}
                  min.</v-card-text>
                <v-card-text
                  class="ml-0 ma-0 pa-0 item-val">{{ report.RasterizationTimeTaken }} min.
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
  const {simulationReports, workflows, printJobs} = defineProps({
      simulationReports: Array,
      workflows : Array,
      printJobs: Array,
    });

  const emit = defineEmits(['selectreport']);

  const simulationReportsDisplay = ref([]);
  const searchValue = ref('');
  const drawer = ref(false);

  const selectedPrintJobs = ref([]);
  const selectedWorkflows = ref([]);

  const selectReport = (report) => {
    emit('selectreport', report);
  };


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
  height:150px;
  border-width:1px;
  border-left-width:0px;
  border-right-width:0px;
  border-top-width:0px;
}

.report-history-table {
  height:98vh;
  overflow-y:scroll;
}

.report-history-item:hover {
	opacity: 0.5;
	cursor: pointer;
}


</style>

