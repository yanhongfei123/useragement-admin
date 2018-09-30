<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="pickerValue"
        style="width:300px;"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="handleFilter"/>
      <el-select v-model="state.receiptType" placeholder="收款类型" style="width:160px" @change="handleFilter" >
        <el-option :value="0" label="VISA"/>
        <el-option :value="1" label="MASTERCARD"/>
      </el-select>
      <el-select v-model="state.orderState" placeholder="订单状态" style="width:120px" @change="handleFilter" >
        <el-option :value="0" label="待支付"/>
        <el-option :value="1" label="已完成"/>
        <el-option :value="2" label="已取消"/>
      </el-select>

      <el-input v-model="state.acount" placeholder="账号" style="width:140px" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="state.orderNum" placeholder="订单号" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="state.businessFlow" placeholder="业务流水号" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button type="primary" icon="el-icon-search" @click="handleFilter" >筛选</el-button>

    </div>

    <el-table
      v-loading="listLoading"
      :data="tableData"
      border
      stripe
      style="width: 100%">
      <el-table-column
        align="center"
        prop="orderSN"
        label="订单号">
        <template slot-scope="scope">
          <span>{{ scope.row.orderSN }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="payOrderSN"
        label="商家订单号">
        <template slot-scope="scope">
          <span>{{ scope.row.payOrderSN }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="money"
        label="金额">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="mark"
        label="订单流水号">
        <template slot-scope="scope">
          <span>{{ scope.row.mark }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="transAccount"
        label="付款账号">
        <template slot-scope="scope">
          <span>{{ scope.row.transAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="recvMobile"
        label="收款人手机">
        <template slot-scope="scope">
          <span>{{ scope.row.recvMobile }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="apiName"
        label="收款类型">
        <template slot-scope="scope">
          <span>{{ scope.row.apiName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created"
        label="收款时间">
        <template slot-scope="scope">
          <span>{{ scope.row.created | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="status"
        label="订单状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status | parseStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="oprote"
        label="操作" >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showDialog(scope.row.orderSN)">修改订单</el-button>
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <el-dialog :visible.sync="dialogVisible" title="修改订单" width="30%">
      <el-form ref="" label-width="120px">
        <el-form-item label="订单号" prop="disCount" >
          <el-input v-model="orderNum" :disabled="true" label="请输入订单号" style="width:200px;"/>
        </el-form-item>
        <el-form-item label="修改状态" prop="disCount" >
          <el-select v-model="orderState" placeholder="订单状态" style="width:200px" >
            <el-option :value="0" label="待支付"/>
            <el-option :value="1" label="已完成"/>
            <el-option :value="2" label="已取消"/>
          </el-select>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getOrderlist, setOrderStatus } from '@/api/common/'
import { formatDate } from '@/utils/'

export default {
  name: 'OrderManagement',
  filters: {
    parseTime(time) {
      return new Date(time).toISOString().substr(0, 10)
    },
    parseStatus(status) {
      return ['待支付', '已完成', '已取消'][status]
    }
  },

  data() {
    return {
      row: {},
      total: 0,
      keyMap: {
        receiptType: 'apiType',
        orderState: 'status',
        acount: 'transAccount',
        orderNum: 'orderSN',
        businessFlow: 'payOrderSN'
      },
      state: {
        receiptType: '',
        orderState: '',
        acount: '',
        orderNum: '',
        businessFlow: ''
      },
      orderNum: '',
      orderState: 0,
      pickerValue: [new Date('2018-01-01'), new Date()],
      listLoading: true,
      dialogVisible: false,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      form: {}
    }
  },
  created() {
    this.getOrderlist()
  },
  methods: {
    save() {
      var params = {
        orderId: this.orderNum, status: this.orderState
      }
      setOrderStatus(params).then(res => {
        this.dialogVisible = false
        Message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      })
    },
    handleFilter() {
      this.getOrderlist()
    },
    getOrderlist() {
      var data = {},
        state = this.state,
        keyMap = this.keyMap
      for (var key in state) {
        if (state[key] !== '') {
          data[keyMap[key]] = state[key]
        }
      }
      this.listLoading = true
      var { page, limit } = this.listQuery
      var timeStart = formatDate(this.pickerValue[0])
      var timeEnd = formatDate(this.pickerValue[1])
      var params = Object.assign({}, { page, limit, timeStart, timeEnd }, data)

      getOrderlist(params).then(res => {
        this.total = res.payload.pages.count
        this.tableData = res.payload.result
        setTimeout(() => {
          this.listLoading = false
        }, 1000)
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getOrderlist()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getOrderlist()
    },
    showDialog(orderNum, id) {
      this.orderNum = orderNum
      this.dialogVisible = true
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

