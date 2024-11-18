<template>
  <v-app theme="light">
      <main-drawer class="sidebar"></main-drawer>
      <router-view class="content"></router-view>
  </v-app>
</template>

<script setup>
  import MainDrawer from './components/MainDrawer.vue';
</script>

<style>

 :root{
  --drawer-size:300px;
 }

.sidebar{
  position:fixed;
  width: var(--drawer-size);
  z-index:99;
}

.content{
  margin-left: var(--drawer-size);
}

.header{
  color:black;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight:bolder;
  font-size: medium;
}

.module-title{
  color:black;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight:bolder;
}

.toolbar{
  background-color: white;
  padding-left:10px;
  padding-bottom:15px; 
  height:50px;
}

</style>
