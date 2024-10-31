<template>
  <v-app theme="light">

    <v-toolbar>
        <v-btn class="pa-3 ma-3 drawer-button" tile icon="$menu" @click="drawer=!drawer"></v-btn>
        <v-toolbar-title>Print Jobs</v-toolbar-title>
    </v-toolbar> 

    
    <v-navigation-drawer temporary v-model="drawer" theme="light">
      
      <v-row class="pa-4">
          <v-btn block tile color="blue" @click="routeTo('/')">Dashboard</v-btn>
      </v-row>

      <v-row>
          <v-btn block tile @click="routeTo('/PrintJobs')">Print Jobs</v-btn>
      </v-row>

      <v-row>
          <v-btn block tile>Workflows</v-btn>
      </v-row>


      <v-row>
          <v-btn block tile>Simulation Reports</v-btn>
      </v-row>

    </v-navigation-drawer>

    <v-main>

      <v-card class="ma-3 pa-3" style="width:85vw; height:400px; border-width:2px;">
        <v-card-title>Create New Print Job Settings</v-card-title> 
        <v-form ref="printSettingsForm" fast-fail @submit.prevent="createPrintSettings">
          <v-text-field :rules="titleValidation" label="Title" v-model="printSettings.title" />
          <v-text-field :rules="pageCountValidation" label="Page Count" type="number" v-model="printSettings.pageCount" />
          <v-autocomplete 
            label="Rasterization Profile"
            :rules="rasterizationProfileValidation" 
            v-model="printSettings.rasterizationProfile"
            :items="['Black','CMY','CMYK']"
          >
          </v-autocomplete>
          <v-btn type="submit" class="mb-2">Create Print Settings</v-btn>
      </v-form>
      <v-alert class="mt-2" style="background-color:white;">{{ message }}</v-alert>
    </v-card>
 
    <v-card class="ma-3 pa-3" style="width:85vw; height:400px; border-width:2px;">
      <v-card-title>Print Job History</v-card-title>


    </v-card>

  <!-- <v-banner>Select a Workflow</v-banner>
  <form @submit.prevent="selectWorkflow">
    <label for="selectedWorkflow">Previous Workflows </label>
    <select id="selectedWorkflow" v-model="selectedWorkflow">
      <option v-for="option in workflows" :key="option.id" :value="option">
          {{ option.name }}
        </option>
    </select>
    <button type="submit">Submit Workflow</button>
  </form>
 -->
    </v-main>

  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();
const routeTo = (where) => {
  router.push(where);
};

const message = ref('');
const drawer = ref(false);

// const selectedWorkflow = ref(null);
// const workflows = ref([
//       { id: 1, name: 'Default Workflow' }
//     ]);

const printSettings = ref(
  {
    title: '',
    pageCount: '',
    rasterizationProfile: '',
  }
);

//// METHODS ////
const titleValidation = [
  x => { if (x) return true; return 'Title can not be left empty';}
];


const pageCountValidation = [
  x => { if (x) return true; return 'Page count must be non-zero.';}
];

const rasterizationProfileValidation = [
  x => { if (x) return true; return 'Rasterization Profile can not be left empty.';}
];

const validateCreatePrintSettings = () => {
  const errors = [];

  titleValidation.forEach(rule => {
    const result = rule(printSettings.value.title);
    if (typeof result === "string"){
      errors.push(result);
    }
  });

  pageCountValidation.forEach(rule => {
    const result = rule(printSettings.value.pageCount);
    if (typeof result === "string"){
      errors.push(result);
    }

  });

  rasterizationProfileValidation.forEach(rule => {
    const result = rule(printSettings.value.rasterizationProfile);
    if (typeof result === "string"){
      errors.push(result);
    }
  });

  if (errors.length > 0){
    return false;
  }
  return true;
}

//// API CALLS ////
const createPrintSettings = async () => {
  if (!validateCreatePrintSettings()){
    return false;
  }   
  
  const url = "http://54.200.253.84:80/createJob";
    const data = {
      Title: printSettings.value.title.toString(),
      PageCount: printSettings.value.pageCount.toString(),
      RasterizationProfile: printSettings.value.rasterizationProfile.toString()
    }

    const response = await fetch(url, {
          method: 'POST',
          mode: 'cors',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
    });

    if (!response.ok) {
      console.log("Error fetching data")
      console.log("Response from server: " + response)
    } else {
      message.value = printSettings.value.title + " has been created"
      setTimeout(() => {
        message.value = '';
        }, 3000);
    }
}

//// OTHER FUNCTIONS ////
// const selectWorkflow = async () => {
//   // once API is made for getting default workflow this will send workflow to backend
//   if (selectedWorkflow.value){
//     message.value = "Workflow: " + selectedWorkflow.value.name + " has been selected";
//   } else {
//     message.value = "Please select a workflow";
//   }
// }

</script>

<style>

.drawer-button{
  text-align: left;
}

.exit-button{
  border:none;
  padding:0;
  box-shadow: none;
  background: transparent;
}


.dashboard-component{
  border:1px;
  width: 400px;
  height: 400px;
}

.dashboard-container{
  max-width: 400px;
}

</style>
