<script setup>
import { ref, onMounted } from "vue";
const message = ref('')
const jobTitle = ref('')
const pageCount = ref('')
const rasterizationProfile = ref('')


const createJob = () => {
  const url = "http://54.200.253.84:80/createJob"
  //console.log(jobTitle, pageCount, rasterizationProfile)
  console.log(jobTitle.value.toString(), pageCount.value.toString(), rasterizationProfile.value.toString())
  const data = {
    Title: jobTitle.value.toString(),
    PageCount: pageCount.value.toString(),
    RasterizationProfile: rasterizationProfile.value.toString()
  }
  const r = fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
  if (!r.ok){
    console.log(r)
  }
  
    
  if (jobTitle.value.trim() !== '' && pageCount.value.trim() !== '' && rasterizationProfile.value.trim() !== ''){
    message.value = jobTitle.value + " has been created"
    setTimeout(() => {
      message.value = ''
      jobTitle.value = ''
      pageCount.value = ''
      rasterizationProfile.value = ''
      }, 3000);
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



<!-- 
  const url = "http://54.200.253.84:80/createJob"
  const data = {
    Title: jobTitle.value,
    PageCount: pageCount.value,
    RasterizationProfile: [rasterizationProfile.value]
  }
  fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      })
-->