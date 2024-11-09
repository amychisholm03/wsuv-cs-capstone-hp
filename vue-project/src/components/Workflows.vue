<template>
    <v-app theme="light">
        <v-toolbar>
            <v-btn class="pa-3 ma-3 drawer-button" tile icon="$menu" @click="drawer=!drawer"></v-btn>
            <v-toolbar-title>Define Workflows</v-toolbar-title>
        </v-toolbar> 

        <!-- Sidebar -->
        <v-navigation-drawer temporary v-model="drawer" theme="light">
            <v-row class="pa-4">
                <v-btn block tile color="blue" @click="routeTo('/')">Dashboard</v-btn>
            </v-row>
            <v-row>
                <v-btn block tile @click="routeTo('/PrintJobs')">Define Print Jobs</v-btn>
            </v-row>
            <v-row>
                <v-btn block tile @click="routeTo('/Workflows')">Define Workflows</v-btn>
            </v-row>
            <v-row>
                <v-btn block tile @click="routeTo('/SubmitJobs')">Submit Print Jobs</v-btn>
            </v-row>
            <v-row>
                <v-btn block tile @click="routeTo('/SimulationReports')">Simulation Reports</v-btn>
            </v-row>

        </v-navigation-drawer>
        <v-main>
            <v-card class="ma-3 pa-3" style="width:85vw; height:350px; border-width:2px;">
                <v-card-title>Create New Workflow</v-card-title>
                <v-form ref="createWorkflowForm" fast-fail @submit.prevent="createWorkflow">
                    <v-text-field :rules="workflowTitleValidation" label="Workflow Title" v-model="workflowTitle" />
                    <v-select
                        v-model="selectedSteps"
                        :rules="selectedStepsValidation"
                        :items="workflowSteps"
                        label="Select Workflow Steps"
                        item-title="Title"
                        item-value="_id"
                        multiple
                    >
                        <template v-slot:selection="{ item, index }">
                            <v-chip v-if="index < 2">
                                <span>{{ item.title }}</span>
                            </v-chip>
                            <span
                                v-if="index === 2"
                                class="text-grey text-caption align-self-center"
                            >
                                (+{{ selectedSteps.length - 2 }} others)
                            </span>
                        </template>
                    </v-select>
                    <v-btn type="submit" class="mb-2" color="light-blue-lighten-1">Create Workflow</v-btn>
                    <v-alert class="mt-2" style="background-color:white;">{{ message }}</v-alert>
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

    const message = ref('');
    const drawer = ref(false);

    const workflowTitle = ref('');
    const selectedSteps = ref(null);
    const workflowSteps = ref([]);

    //// METHODS ////
    const workflowTitleValidation = [
        x => { if (x) return true; return 'Workflow title cannot not be left empty'}
    ];

    const selectedStepsValidation = [
        x => { if (x && x.length !== 0) return true; return 'Workflow must contain at least one step'}
    ];

    const validateCreatedWorkflow = () => {
        const errors = []; 
        workflowTitleValidation.forEach(rule => {
            const result = rule(workflowTitle.value);
            if (typeof result === "string"){
                errors.push(result);
            }
        })

        selectedStepsValidation.forEach(rule => {
            const result = rule(selectedSteps.value);
            if (typeof result === "string"){
                errors.push(result);
            }

        });

        if (errors.length > 0){
            return false;
        }
        return true; 

    }

//// API CALLS ////
    onMounted( async () => {
        getWorkflowSteps()
    })

    const getWorkflowSteps = async () => {
        try {
            const url = "http://api.wsuv-hp-capstone.com:80/getWorkflowStepList";
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                }
            );
            workflowSteps.value = await response.json();
        } catch (error) {
            console.log('Error fetching list of workflow steps');     
        }
    }
    
    const createWorkflow = async () => {
        if (!validateCreatedWorkflow()){
            return false;
        }
        const url = "http://api.wsuv-hp-capstone.com:80/createWorkflow";
        const data = {
            Title: workflowTitle.value.toString(),
            Steps: selectedSteps.value,
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
            message.value = workflowTitle.value + " has been created"
            setTimeout(() => {
                message.value = '';
            }, 3000);
        }
    }
</script>


<style>
    .drawer-button{
    text-align: left;
    }

    .exit-button{
    border:none;
    padding:0;
    box-shadow: none;
    background: transparent;
    }


    .dashboard-component{
    border:1px;
    width: 400px;
    height: 400px;
    }

    .dashboard-container{
    max-width: 400px;
    }

    .v-btn{
        margin: 0 5px;
    }

</style>
