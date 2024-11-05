<template>
  <v-app theme="light">
    <v-toolbar>
      <v-btn class="pa-3 ma-3 drawer-button" tile icon="$menu" @click="drawer = !drawer"></v-btn>
      <v-toolbar-title>Print Jobs</v-toolbar-title>
    </v-toolbar>

    <!-- Sidebar -->
    <v-navigation-drawer temporary v-model="drawer" theme="light">
      <v-row class="pa-4">
          <v-btn block tile color="blue" @click="routeTo('/')">Dashboard</v-btn>
      </v-row>
      <v-row>
          <v-btn block tile @click="routeTo('/PrintJobs')">Print Jobs</v-btn>
      </v-row>
      <v-row>
          <v-btn block tile @click="routeTo('/Workflows')">Workflows</v-btn>
      </v-row>
      <v-row>
          <v-btn block tile>Simulation Reports</v-btn>
      </v-row>
    </v-navigation-drawer>
    <v-main>
      <v-card class="ma-3 pa-3" style="width:85vw; height:600px; border-width:2px;">
        <v-card-title>Create New Print Job Settings</v-card-title>
        <v-form ref="printSettingsForm" fast-fail @submit.prevent="createPrintSettings">
          <v-text-field :rules="titleValidation" label="Title" v-model="printSettings.title" />
          <v-text-field :rules="pageCountValidation" label="Page Count" type="number"
            v-model="printSettings.pageCount" />
          <v-select v-model="printSettings.rasterizationProfile" :rules="rasterizationProfileValidation"
            :items="printSettings.rasterizationProfiles" label="Rasterization Profile" item-title="text"
            item-value="value" outlined>
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :subtitle="item.raw.profile"></v-list-item>
            </template>
          </v-select>

          <v-btn type="submit" class="mb-2">Create Print Settings</v-btn>
        </v-form>
        <v-alert class="mt-2" style="background-color:white;">{{ message }}</v-alert>
      </v-card>
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

const printSettings = ref(
  {
    title: '',
    pageCount: '',
    rasterizationProfile: '',
    rasterizationProfiles: [
      { text: 'Black', value: 'Black', profile: 'Standard Color Profile'},
      { text: 'CMY (Cyan, Magenta, Yellow)', value: 'CMY', profile: 'Standard Color Profile'},
      { text: 'CMYK (Cyan, Magenta, Yellow, Black)', value: 'CMYK', profile: 'Standard Color Profile'},
      { text: 'RGB (Red, Green, Blue)', value: 'RGB', profile: 'Standard Color Profile'},
  ]});


//// METHODS ////
const titleValidation = [
  x => { if (x) return true; return 'Title can not be left empty'; }
];


const pageCountValidation = [
  x => { if (x) return true; return 'Page count must be non-zero.'; }
];

const rasterizationProfileValidation = [
  x => { if (x) return true; return 'Rasterization Profile can not be left empty.'; }
];

const validateCreatePrintSettings = () => {
  const errors = [];

  titleValidation.forEach(rule => {
    const result = rule(printSettings.value.title);
    if (typeof result === "string") {
      errors.push(result);
    }
  });

  pageCountValidation.forEach(rule => {
    const result = rule(printSettings.value.pageCount);
    if (typeof result === "string") {
      errors.push(result);
    }

  });

  rasterizationProfileValidation.forEach(rule => {
    const result = rule(printSettings.value.rasterizationProfile);
    if (typeof result === "string") {
      errors.push(result);
    }
  });

  if (errors.length > 0) {
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
