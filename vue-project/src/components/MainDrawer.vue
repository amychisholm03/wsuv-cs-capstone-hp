<template>
  <v-app theme="light">
    <v-navigation-drawer style="min-width:300px;" :rail="disabled" :model-value="true" permanent theme="light">
        <v-row no-gutters class="fill-width">
            <v-col class="d-flex justify-end">
                <v-btn class="ma-4" size="medium" icon="mdi-account-circle"></v-btn>
            </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-list>
            <v-list-item class="menu-item" prepend-icon="mdi-view-dashboard" @click="routeTo('/')">
                <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item>
            <v-list-item class="menu-item" prepend-icon="mdi-printer-pos-plus" @click="routeTo('/PrintJobs')">
                <v-list-item-title>Create Print Jobs</v-list-item-title>
            </v-list-item>
            <v-list-item class="menu-item" prepend-icon="mdi-printer-pos-play" @click="routeTo('/SubmitJobs')">
                <v-list-item-title>Submit Print Jobs</v-list-item-title>
            </v-list-item>
            <v-list-item class="menu-item" prepend-icon="mdi-sitemap" @click="routeTo('/Workflows')">
                <v-list-item-title>Workflows</v-list-item-title>
            </v-list-item>
            <v-list-item class="menu-item" prepend-icon="mdi-test-tube" @click="routeTo('/SimulationReports')">
                <v-list-item-title>Simulation Reports</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</v-app>
</template>

<script setup>
  import { ref, onMounted, watch } from "vue";
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const disabled = ref(false);

  //// ROUTING ////
  const routeTo = (where) => {
    router.push(where);
  };
</script>

<style>
  .drawer-button {
    text-align: left;
  }
 
  .open-and-close-button{
    margin-top:10px;
    padding-top:10px;
  }

  .exit-button {
    border: none;
    padding: 0;
    box-shadow: none;
    background: transparent;
  }

  .menu-item:hover{
    opacity: 0.7;
  }

  .header{
    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-weight:bold;
  }

</style>
