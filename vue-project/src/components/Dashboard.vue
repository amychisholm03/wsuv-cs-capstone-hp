<template>
  <v-app theme="light">
    <v-toolbar>
      <v-btn class="pa-3 ma-3 drawer-button" tile icon="$menu" @click="drawer = !drawer"></v-btn>
      <v-toolbar-title>Dashboard</v-toolbar-title>
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
      <v-container class="pa-3 ma-3">
        <v-row>
            <v-card class="ma-3 dashboard-component" style="width: 425px; height: 305px;">
              <v-img src="/src/assets/image1.png"></v-img>
            </v-card>

            <v-card class="ma-3 dashboard-component" style="width: 425px; height: 305px;">
              <v-img src="/src/assets/image2.png"></v-img>
            </v-card>
        </v-row>

        <v-row>
            <v-card class="ma-3 dashboard-component" style="width: 425px; height: 305px;">
              <v-img src="/src/assets/image4.png"></v-img>
            </v-card>

            <v-card class="ma-3 dashboard-component" style="width: 425px; height: 305px;" >
              <v-img src="/src/assets/image3.png"></v-img>
            </v-card>
        </v-row>




      </v-container>
    </v-main>

    <!-- 
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

  <v-banner>Select a Workflow</v-banner>
  <form @submit.prevent="selectWorkflow">
    <label for="selectedWorkflow">Previous Workflows </label>
    <select id="selectedWorkflow" v-model="selectedWorkflow">
      <option v-for="option in workflows" :key="option.id" :value="option">
          {{ option.name }}
        </option>
    </select>
    <button type="submit">Submit Workflow</button>
  </form>

  <v-alert :v-if="message !== ''">{{ message }}</v-alert>
    </v-main> -->

  </v-app>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from 'vue-router';

  const drawer = ref(false);
  const router = useRouter();

//// ROUTING ////
const routeTo = (where) => {
  router.push(where);
};


//// API CALLS ////

const createJob = async () => {
  if (jobTitle.value.trim() !== '' && pageCount.value.trim() !== '' && rasterizationProfile.value.trim() !== '') {
    const url = "http://54.200.253.84:80/createJob";
    const data = {
      Title: jobTitle.value.toString(),
      PageCount: pageCount.value.toString(),
      RasterizationProfile: rasterizationProfile.value.toString()
    }

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
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
  if (selectedWorkflow.value) {
    message.value = "Workflow: " + selectedWorkflow.value.name + " has been selected";
  } else {
    message.value = "Please select a workflow";
  }
}

</script>

<style>
.drawer-button {
  text-align: left;
}

.exit-button {
  border: none;
  padding: 0;
  box-shadow: none;
  background: transparent;
}


.dashboard-component {
  border: 1px;
  width: 400px;
  height: 400px;
}

.dashboard-container {
  max-width: 400px;
}
</style>
