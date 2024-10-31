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
                <v-btn block tile @click="routeTo('/Workflows')">Workflows</v-btn>
            </v-row>
            <v-row>
                <v-btn block tile>Simulation Reports</v-btn>
            </v-row>
        </v-navigation-drawer>
        <v-main>
            
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

    const validateWorkflows = () => {
        const errors = [];   
    }

    //// API CALLS ////

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

</style>