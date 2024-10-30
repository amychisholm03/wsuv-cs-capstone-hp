<script setup>
import { ref, onMounted } from "vue";
const message = ref('')
const jobTitle = ref('')
const pageCount = ref('')
const rasterizationProfile = ref('')
const selectedWorkflow = ref(null)
const workflows = ref([
      { id: 1, name: 'Default Workflow' }
    ]);


const createJob = async () => {
  if (jobTitle.value.trim() !== '' && pageCount.value.trim() !== '' && rasterizationProfile.value.trim() !== ''){
    const url = "http://54.200.253.84:80/createJob"
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
    })
    if (!response.ok) {
      console.log("Error fetching data")
      console.log("Response from server: " + response)
    } else {
      message.value = jobTitle.value + " has been created"
      setTimeout(() => {
        message.value = ''
        jobTitle.value = ''
        pageCount.value = ''
        rasterizationProfile.value = ''
        }, 3000);
    }
  } else {
    message.value = "Job title, page count, and rasterization profile cannot be left blank"
  }
}

const selectWorkflow = async () => {
  // once API is made for getting default workflow this will send workflow to backend
  if (selectedWorkflow.value){
    message.value = "Workflow: " + selectedWorkflow.value.name + " has been selected"
  } else {
    message.value = "Please select a workflow"
  }
}

</script>

<template>
  <h1>Create New Print Job</h1>
  <form @submit.prevent="createJob">
        <label for="jobTitle">Job Title </label>
        <input type="text" id="jobTitle" name="jobTitle" v-model="jobTitle" />

        <label for="pageCount">  Page Count </label>
        <input type="text" id="pageCount" name="pageCount" v-model="pageCount" />

        <label for="rasterizationProfile">  Rasterization Profile </label>
        <select id="rasterizationProfile" name="rasterizationProfile" v-model="rasterizationProfile">
          <optgroup label="Standard Color Profiles">
            <option value="Black">Black</option>
            <option value="CMY">CMY (Cyan, Magenta, Yellow)</option>
            <option value="CMYK">CMYK (Cyan, Magenta, Yellow, Black)</option>
            <option value="RGB">RGB (Red, Green, Blue)</option>
          </optgroup>

          <optgroup label="Extended Color Profiles">
            <option value="CMYKOV">CMYK + Orange + Violet</option>
            <option value="CMYKOVM1">CMYK + Orange + Violet + Extra Colorant 1</option>
          </optgroup>

          <optgroup label="Specialized Profiles">
            <option value="HighQuality">High Quality (Best Detail)</option>
            <option value="Draft">Draft (Fast, Low-Quality)</option>
            <option value="Photographic">Photographic (Rich Color, High Detail)</option>
            <option value="LineArt">Line Art (Crisp Lines, No Gradients)</option>
          </optgroup>
        </select>
        <button type="submit">Submit Job</button>
  </form>

  <h1>Select A Workflow</h1>
  <form @submit.prevent="selectWorkflow">
    <label for="selectedWorkflow">Previous Workflows </label>
    <select id="selectedWorkflow" v-model="selectedWorkflow">
      <option v-for="option in workflows" :key="option.id" :value="option">
          {{ option.name }}
        </option>
    </select>
    <button type="submit">Submit Workflow</button>
  </form>

  <p>{{ message }}</p>

</template>


<!-- 
  Once getting a list of previous workflows is available i will include this instead of the hard coded workflow for now
onMounted(async () =>{
  try {
    GET WORKFLOWS LIST FROM API
  } catch (error) {
    console.log('Error fetching previous workflows');
  }
})
-->