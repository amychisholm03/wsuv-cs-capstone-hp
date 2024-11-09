<template>
  <v-app theme="light">
    <v-toolbar>
        <v-btn class="pa-3 ma-3 drawer-button" tile icon="$menu" @click="drawer=!drawer"></v-btn>
        <v-toolbar-title>Dashboard</v-toolbar-title>
    </v-toolbar> 
    
    <v-navigation-drawer temporary v-model="drawer" theme="light">
      <v-row class="pa-4">
        <v-btn block tile color="light-blue-lighten-1" @click="routeTo('/')">Dashboard</v-btn>
      </v-row>
      <v-row>
        <v-btn block tile @click="routeTo('/PrintJobs')">Define Print Jobs</v-btn>
      </v-row>
      <v-row>
          <v-btn block tile @click="routeTo('/Workflows')">Define Workflow</v-btn>
      </v-row>
      <v-row>
          <v-btn block tile @click="routeTo('/SubmitJobs')">Submit Print Jobs</v-btn>
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

          <v-card class="ma-3 dashboard-component" style="width: 425px; height: 305px;">
            <v-img src="/src/assets/image3.png"></v-img>
          </v-card>
        </v-row>
      </v-container>
    </v-main>
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
