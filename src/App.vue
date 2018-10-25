<template>
    <div class="wrap" style="height:100%">
        <router-view/>
    </div>
</template>

<script>
import { doPost } from "@/api/ajax";
export default {
  name: "App",
  mounted() {}
};
</script>
<style scoped>
.wrap {
  width: 100%;
  height: 100%;
  min-width: 1250px;
  overflow: hidden;
}
