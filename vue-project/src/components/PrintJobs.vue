<template>
  <v-app theme="light">
    <v-toolbar class="toolbar">
        <v-toolbar-title class="header">Create Print Job</v-toolbar-title>
    </v-toolbar> 
    <v-main>
      <v-card class="ma-3 pa-3" style="width: 800px; height:400px; border-width:2px;">
        <v-card-title>Create New Print Job</v-card-title>
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

          <v-btn type="submit" class="mb" color="primary" :disabled="failure || success">
            Create Print Job
          </v-btn>
          <v-btn size="x-small" icon type="submit" class="mb-2" v-if="success && !failure" color="success">
            <v-icon size="medium">
              mdi-check
            </v-icon>
          </v-btn>
          <v-btn size="x-small" icon type="submit" class="mb-2" v-if="!success && failure" color="error">
            <v-icon size="medium">
              mdi-close
            </v-icon>
          </v-btn>
        </v-form>
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

const success = ref(false);
const failure = ref(false);

const printSettings = ref(
  {
    title: '',
    pageCount: '',
    rasterizationProfile: '',
    rasterizationProfiles: [
      { text: 'Black', value: 'Black', profile: 'Standard Color Profile' },
      { text: 'CMY (Cyan, Magenta, Yellow)', value: 'CMY', profile: 'Standard Color Profile' },
      { text: 'CMYK (Cyan, Magenta, Yellow, Black)', value: 'CMYK', profile: 'Standard Color Profile' },
      { text: 'RGB (Red, Green, Blue)', value: 'RGB', profile: 'Standard Color Profile' },
      { text: 'CMYK + Orange + Violet', value: 'CMYKOV', profile: 'Extended Color Profile' },
      { text: 'CMYK + Orange + Violet + Extra Colorant 1', value: 'CMYKOVM1', profile: 'Extended Color Profile' },
      { text: 'High Quality (Best Detail)', value: 'HighQuality', profile: 'Specialized Profile' },
      { text: 'Draft (Fast, Low-Quality)', value: 'Draft', profile: 'Specialized Profile' },
      { text: 'Photographic (Rich Color, High Detail)', value: 'Photographic', profile: 'Specialized Profile' },
      { text: 'Line Art (Crisp Lines, No Gradients)', value: 'LineArt', profile: 'Specialized Profile' },
    ],
  });


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
      failure.value=true;
      success.value=false;
      setTimeout(() => {
        failure.value=false;
      }, 2000);
      return false;
  }
  return true;
}

  //// API CALLS ////
  const createPrintSettings = async () => {
    if (!validateCreatePrintSettings()){
      return false;
    }   

    const url = "http://api.wsuv-hp-capstone.com:80/createJob";
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
      console.log("Error creating print job. Response from server: " + String(response.status))
      failure.value=true;
      setTimeout(() => {
        failure.value=false;
      }, 2000);
      return;
    } else {
      failure.value=false;
      success.value=true;
      setTimeout(() => {
        success.value=false;
      }, 2000);
    }
  }
</script>

<style>

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
