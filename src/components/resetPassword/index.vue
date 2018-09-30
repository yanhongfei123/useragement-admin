<template>
  <el-dialog :visible.sync="show" title="修改密码" width="30%">
    <el-form ref="resetPasForm" label-width="120px">
      <el-form-item label="原密码" prop="oldPas" >
        <el-input v-model="oldPas" name="oldPas" autocomplete="off" type="password" style="width: 200px;" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPas">
        <el-input v-model="newPas" name="newPas" autocomplete="off" type="password" style="width: 200px;" />
      </el-form-item>
      <el-form-item label="验证密码" prop="conPas">
        <el-input v-model="conPas" name="conPas" autocomplete="off" type="password" style="width: 200px;" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hideDialog">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>

</template>

<script>
import { Message } from 'element-ui'
import { resetPas } from '@/api/resetPas'

export default {
  props: ['userId'],
  data() {
    return {
      show: false,
      oldPas: '',
      newPas: '',
      conPas: ''
    }
  },
  created() {},
  methods: {
    showDialog() {
      this.show = true
    },
    hideDialog() {
      this.show = false
    },
    submitForm() {
      var message = '',
        type = 'error'
      if (this.oldPas === '') {
        message = '请输入原密码'
      } else if (this.newPas === '') {
        message = '请输入新的密码'
      } else if (this.conPas === '') {
        message = '请再次输入密码'
      } else if (this.newPas !== this.conPas) {
        message = '两次输入的密码不一致'
      } else {
        message = '修改成功'
        type = 'success'
      }

      if (message !== '修改成功') {
        Message({ message, type, duration: 2 * 1000 })
      } else {
        var params = {
          userId: this.userId,
          oldPwd: this.oldPas,
          newPwd: this.newPas
        }

        resetPas(params).then(res => {
          this.oldPas = ''
          this.newPas = ''
          this.conPas = ''
          this.hideDialog()
          Message({ message, type, duration: 2 * 1000 })
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
