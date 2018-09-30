<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="mobile" placeholder="手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter(mobile,'')"/>
      <el-input v-model="name" placeholder="姓名" style="width: 170px;" class="filter-item" @keyup.enter.native="handleFilter('',name)"/>
      <el-button type="primary" icon="el-icon-search" @click="handleFilter(mobile,name)" >筛选</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="dialogVisible4 = true">添加代理</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="tableData"
      border
      stripe
      style="width: 100%">
      <el-table-column
        align="center"
        prop="recvAgentL1Mobile"
        label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.recvAgentMobile }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="agentName"
        label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.agentName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="lastTotal"
        label="用户数量">
        <template slot-scope="scope">
          <span>{{ scope.row.recvCount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="signRate"
        label="佣金点数">
        <template slot-scope="scope">
          <span>{{ scope.row.signRate }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column
        align="center"
        prop="total"
        label="总成交量">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNum }}</span>
        </template>
      </el-table-column>
      -->
      <el-table-column
        align="center"
        prop="date"
        label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.created | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="oprote"
        width="400"
        label="操作" >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showDialog(scope.row,'dialogVisible1')">冻结用户</el-button>
          <el-button type="primary" size="mini" @click="showDialog(scope.row, 'dialogVisible2')">修改密码</el-button>
          <el-button type="primary" size="mini" @click="showDialog(scope.row, 'dialogVisible3')">修改分佣点数</el-button>
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <el-dialog :visible.sync="dialogVisible1" title="冻结用户" width="30%">
      <el-form ref="" label-width="120px">
        <el-form-item label="封禁时间" prop="disCount" >
          <el-input-number v-model="disCount" :min="1" label="请输入封禁时间" style="width:200px;"/>
        </el-form-item>
        <el-form-item label="时间单位" prop="danwei" >
          <el-select v-model="selectValue" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="freezAcount">确 定</el-button>
      </span>
    </el-dialog>

    <reset-password ref="resPas" :user-id="row.recvAgentId"/>

    <el-dialog :visible.sync="dialogVisible3" title="修改分佣点数" width="30%">
      <!-- <el-input v-model="count" placeholder="请输入额度数" style="width:200px;" class="" /> -->
      <el-input-number v-model="count" :precision="2" :step="0.01" :min="0.01" :max="0.1" label="请输入分佣点数" style="width:200px;"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="countConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible4" title="添加代理" width="30%">
      <el-form ref="submitForm" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="姓名" prop="agentName" >
          <el-input v-model="form.agentName" name="agentName" autocomplete="off" type="text" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="手机号" prop="agentMobile">
          <el-input v-model="form.agentMobile" name="agentMobile" autocomplete="off" type="text" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" name="password" autocomplete="off" type="text" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="分拥点数" prop="signRate" style="margin-bottom:0">
          <el-input v-model="form.signRate" name="signRate" autocomplete="off" type="text" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="" >
          <span>*分佣点数不能大于代理点数 0.1</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4 = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import ResetPassword from '@/components/resetPassword'
import { Message } from 'element-ui'
import {
  getUseragentlist,
  addUseragent,
  addCount
} from '@/api/proxyManagement'
import { freezAcount } from '@/api/common/index'

export default {
  name: 'ProxyManagement',
  components: {
    ResetPassword
  },
  filters: {
    parseTime(time) {
      return new Date(time).toISOString().substr(0, 10)
    }
  },
  data() {
    const validateNickName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }

    const validateMobile = (rule, value, callback) => {
      if (!/^1\d{10}$/.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }

    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }

    const validateRate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入正确的分佣点数'))
      } else if (value > 0.1) {
        callback(new Error('分佣点数不能大于代理点数 0.1'))
      } else {
        callback()
      }
    }
    return {
      row: {},
      password: '',
      count: 0.01, // 默认0
      mobile: '',
      name: '',
      total: 0,
      num: 0, //
      listLoading: true,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      form: {
        agentName: '',
        agentMobile: '',
        password: '',
        signRate: ''
      },
      disCount: 1,
      selectValue: 3,
      options: [
        {
          value: 0,
          label: '秒'
        },
        {
          value: 1,
          label: '分钟'
        },
        {
          value: 2,
          label: '小时'
        },
        {
          value: 3,
          label: '天'
        }
      ],
      rules: {
        agentName: [
          { required: true, trigger: 'blur', validator: validateNickName }
        ],
        agentMobile: [
          { required: true, trigger: 'blur', validator: validateMobile }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePass }
        ],
        signRate: [
          { required: true, trigger: 'blur', validator: validateRate }
        ]
      }
    }
  },
  created() {
    this.getUseragentlist()
  },
  methods: {
    handleFilter(agentMobile, agentName) {
      var params = { agentMobile, agentName }
      this.getUseragentlist(params)
    },
    getUseragentlist(data = {}) {
      this.listLoading = true
      var { page, limit } = this.listQuery
      var params = Object.assign({}, { page, limit }, data)
      getUseragentlist(params).then(res => {
        this.total = res.payload.pages.count
        this.tableData = res.payload.result
        setTimeout(() => {
          this.listLoading = false
        }, 1000)
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getUseragentlist()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getUseragentlist()
    },
    showDialog(row, id) {
      this.row = row
      if (id === 'dialogVisible2') {
        this.$refs.resPas.showDialog()
      } else {
        this[id] = true
      }
    },
    submitForm() {
      this.$refs.submitForm.validate(valid => {
        if (valid) {
          addUseragent(this.form).then(response => {
            Message({
              message: '添加成功',
              type: 'success',
              duration: 2 * 1000
            })
            this.dialogVisible4 = false
            this.form = {
              agentName: '',
              agentMobile: '',
              password: '',
              signRate: ''
            }
            this.getUseragentlist()
          })
        } else {
          console.log('error submit!!')
        }
      })
    },
    freezAcount() {
      var reg = /^[1-9]+$/
      if (!reg.test(this.disCount)) {
        Message({
          message: '请输入正整数',
          type: 'error',
          duration: 2 * 1000
        })
      } else {
        var { recvAgentId } = this.row
        var params = {
          userId: recvAgentId,
          delayCount: this.disCount,
          delayUnit: this.selectValue
        }
        console.log(params)
        freezAcount(params).then(response => {
          this.dialogVisible1 = false
          Message({
            message: '账户已被冻结',
            type: 'success',
            duration: 2 * 1000
          })
        })
      }
    },
    countConfirm() {
      var { recvAgentId } = this.row
      var signRate = this.count
      var params = {
        userId: recvAgentId,
        signRate
      }
      addCount(params).then(response => {
        this.dialogVisible3 = false
        Message({
          message: '修改成功',
          type: 'success',
          duration: 2 * 1000
        })
      })
    }
  }
}
</script>

<style scoped>
.filter-container {
  margin-bottom: 20px;
}
.pagination-container {
  margin-top: 40px;
}
</style>

