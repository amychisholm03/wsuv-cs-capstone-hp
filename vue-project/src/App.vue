<script setup>
import { ref, onMounted } from "vue";
const message = ref('')
const jobTitle = ref('')
const pageCount = ref('')
const rasterizationProfile = ref('')


const createJob = async () => {
  if (jobTitle.value.trim() !== '' && pageCount.value.trim() !== '' && rasterizationProfile.value.trim() !== ''){
    const url = "http://wsuv-hp-capstone.com:80/createJob"
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
</script>

<template>
  <h1>Create New Print Job</h1>
  <form @submit.prevent="createJob">
        <label for="jobTitle">Job Title </label>
        <input type="text" id="jobTitle" name="jobTitle" v-model="jobTitle" />
        <label for="pageCount">  Page Count </label>
        <input type="text" id="pageCount" name="pageCount" v-model="pageCount" />
        <label for="rasterizationProfile">  Rasterization Profile </label>
        <input type="text" id="rasterizationProfile" name="rasterizationProfile" v-model="rasterizationProfile" />
        <button type="submit">Submit</button>
  </form>
  <p>{{ message }}</p>
</template>

