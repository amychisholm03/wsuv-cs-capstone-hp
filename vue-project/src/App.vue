<template>
  <v-app>
    <v-btn label="Open drawer" @click="drawer = !drawer">Open drawer</v-btn>

    <v-navigation-drawer :v-model="drawer" theme="light">
      <v-row class="pa-3">
        <v-btn icon="$menu"></v-btn>
      </v-row>

      <v-row>
        <v-btn block style="text-align:left;">Print Jobs</v-btn>
      </v-row>

      <v-row>
        <v-btn block>Workflows</v-btn>

      </v-row>

    </v-navigation-drawer>

    <v-main>
      <v-banner>Create New Print Job</v-banner>
      
      <v-form @submit.prevent="createJob">
        <v-text-field label="Create Job" v-model="jobTitle" />

        <v-text-field label="Page Count" v-model="pageCount" />

        <v-autocomplete 
          label="Rasterization Profile" 
          v-model="rasterizationProfile"
          :items="['Black','CMY','CMYK','RGB']"
        >
        </v-autocomplete>
        <v-btn label="submit" @click='createJob()'>Submit Job</v-btn>
  </v-form>

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
  <v-alert :v-if="message !== ''">{{ message }}</v-alert>

    
    
    
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
const message = ref('');
const drawer = ref(false);
const jobTitle = ref('');
const pageCount = ref('');
const rasterizationProfile = ref('');
const selectedWorkflow = ref(null);
const workflows = ref([
      { id: 1, name: 'Default Workflow' }
    ]);


drawer.value = false;


//// API CALLS ////

const createJob = async () => {
  if (jobTitle.value.trim() !== '' && pageCount.value.trim() !== '' && rasterizationProfile.value.trim() !== ''){
    const url = "http://54.200.253.84:80/createJob";
    const data = {
      Title: jobTitle.value.toString(),
      PageCount: pageCount.value.toString(),
      RasterizationProfile: rasterizationProfile.value.toString()
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
      message.value = jobTitle.value + " has been created"
      setTimeout(() => {
        message.value = '';
        jobTitle.value = '';
        pageCount.value = '';
        rasterizationProfile.value = '';
        }, 3000);
    }
  } else {
    message.value = "Job title, page count, and rasterization profile cannot be left blank";
  }
}


//// OTHER FUNCTIONS ////
const selectWorkflow = async () => {
  // once API is made for getting default workflow this will send workflow to backend
  if (selectedWorkflow.value){
    message.value = "Workflow: " + selectedWorkflow.value.name + " has been selected";
  } else {
    message.value = "Please select a workflow";
  }
}

</script>

