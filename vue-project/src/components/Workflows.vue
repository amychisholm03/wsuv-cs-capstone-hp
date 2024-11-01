<template>
    <v-app theme="light">
        <v-toolbar>
            <v-btn class="pa-3 ma-3 drawer-button" tile icon="$menu" @click="drawer=!drawer"></v-btn>
            <v-toolbar-title>Workflows</v-toolbar-title>
        </v-toolbar> 

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
                <v-btn block tile>Simulation Reports</v-btn>
            </v-row>
        </v-navigation-drawer>
        <v-main>
            <v-card class="ma-3 pa-3" style="width:85vw; height:250px; border-width:2px;">
                <v-card-title>Select Previous Workflow</v-card-title> 
                <v-form ref="selectPreviousWorkflowForm" fast-fail @submit.prevent="selectPreviousWorkflow">
                    <v-select
                        v-model="selectedWorkflow"
                        :rules="selectedWorkflowValidation"
                        :items="previousWorkflows"
                        label="Previous Workflows"
                        item-title="name"
                        item-value="id"
                        outlined
                    >
                        <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props" ></v-list-item>
                        </template>
                    </v-select>

                    <v-btn type="submit" class="mb-2">Select Workflow</v-btn>
                </v-form>
                <v-alert class="mt-2" style="background-color:white;">{{ message }}</v-alert>
            </v-card>

            <v-card class="ma-3 pa-3" style="width:85vw; height:330px; border-width:2px;">
                <v-card-title>Create New Workflow</v-card-title>
                <v-form ref="createWorkflowForm" fast-fail @submit.prevent="createWorkflow">
                    <v-text-field :rules="titleValidation" label="Title" v-model="workflowTitle" />
                    <v-select
                        v-model="selectedSteps"
                        :rules="selectedStepsValidation"
                        :items="workflowSteps"
                        label="Select Workflow Steps"
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
                    <v-btn type="submit" class="mb-2">Create Workflow</v-btn>
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

    const selectedWorkflow = ref(null);
    const previousWorkflows = ref([
           { id: 1, name: 'Default Workflow' }
    ]);
    const workflowTitle = ref('');
    const selectedSteps = ref(null);
    const workflowSteps = ref([
        {title: "preflight"},
        {title: "metrics"},
        {title: "rasterization"},
        {title: "printing"},
        {title: "cutting"},
        {title: "laminating"}
    ]);


    //// METHODS ////
    const selectedWorkflowValidation = [
        x => { if (x) return true; return 'Workflow must be selected or created';}
    ];

    const titleValidation = [
        x => { if (x) return true; return 'Workflow title cannot not be left empty'}
    ];

    const selectedStepsValidation = [
        x => { if (x) return true; return 'Workflow must contain at least one step'}
    ];

    const validateSelectedWorkflow = () => {
        const errors = []; 
        selectedWorkflowValidation.forEach(rule => {
            const result = rule(selectedWorkflow.value);
            if (typeof result === "string"){
                errors.push(result);
            }     
        });

        if (errors.length > 0){
            return false;
        }
        return true;  
    }

    const validateCreatedWorkflow = () => {
        const errors = []; 
        titleValidation.forEach(rule => {
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

    const selectPreviousWorkflow = async () => {
        if (!validateSelectedWorkflow()){
            return false;
        } 
        
        // once API is made this will send selected workflow to backend
        const workflow = previousWorkflows.value.find(workflow => workflow.id === selectedWorkflow.value)
        message.value = workflow.name + " has been selected"
        setTimeout(() => {
          message.value = '';
        }, 3000);
        
    }

    const createWorkflow = async () => {
        if (!validateCreatedWorkflow()){
            return false;
        }

        
        const data = {
            Title: workflowTitle.value.toString(),
            Steps: ""
        }
        // once API is made this will send workflow to backend
        message.value = "The following steps have been selected: " + selectedSteps.value 
        setTimeout(() => {
          message.value = '';
        }, 3000);
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

</style>