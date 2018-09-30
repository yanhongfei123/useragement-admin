<template>
  <div class="app-container">
    <el-form ref="submitForm" label-width="120px">
      <el-form-item label="姓名" prop="name" >
        <el-input v-model="name" :disabled="true" name="name" type="text" style="width: 200px;" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="mobile" :disabled="true" name="mobile" type="text" style="width: 200px;" />
      </el-form-item>
      <el-form-item label="" >
        <el-button style="width:200px" type="primary" @click="resetPass">修改密码</el-button>
      </el-form-item>
    </el-form>

    <reset-password ref="resPas" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ResetPassword from '@/components/resetPassword'

export default {
  name: 'UserInfo',
  components: { ResetPassword },
  computed: {
    ...mapGetters([
      'name',
      'mobile'
    ])
  },
  methods: {
    resetPass() {
      this.$refs.resPas.showDialog()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
