<template>
    <v-app theme="light">
        <v-toolbar class="toolbar">
            <v-toolbar-title class="header">Workflows</v-toolbar-title>
        </v-toolbar> 
        <v-main>
            <v-card class="ma-3 pa-3" style="width:700px; height:350px; border-width:2px;">
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
                    <v-btn type="submit" class="mb" color="primary" :disabled="failure || success">
                        Create Workflow
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
            if (response.ok){ 
                workflowSteps.value = await response.json();
            } else {
                console.log("Error fetching data. Response from server: " + String(response.status))
            }
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
            WorkflowSteps: selectedSteps.value,
        }
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            console.log("Error posting data. Response from server: " + String(response.status))
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

<style>

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
