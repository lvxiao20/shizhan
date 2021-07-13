<template>
  <div class="Home">
        <el-button type="info" @click="tui">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    tui(){
      window.sessionStorage.clear()
      this.$router.push('/')
    }
  }
}
</script>

<style>

</style>