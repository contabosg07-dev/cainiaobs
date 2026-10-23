<template>
  <el-container>
    <!-- Header -->
    <el-header class="header">
      <div class="header-content">
        <div @click="goBack">
          <svg
            t="1745812297880"
            class="icon"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
          >
            <path
              d="M675.328 117.717333A425.429333 425.429333 0 0 0 512 85.333333C276.352 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667 426.666667-191.018667 426.666667-426.666667c0-56.746667-11.093333-112-32.384-163.328a21.333333 21.333333 0 0 0-39.402667 16.341333A382.762667 382.762667 0 0 1 896 512c0 212.074667-171.925333 384-384 384S128 724.074667 128 512 299.925333 128 512 128c51.114667 0 100.8 9.984 146.986667 29.12a21.333333 21.333333 0 0 0 16.341333-39.402667z m-324.693333 373.013334l174.464-174.485334a21.141333 21.141333 0 0 0-0.192-29.973333 21.141333 21.141333 0 0 0-29.973334-0.192l-208.256 208.256a20.821333 20.821333 0 0 0-6.122666 14.976c0.042667 5.418667 2.133333 10.837333 6.314666 14.997333l211.178667 211.2a21.141333 21.141333 0 0 0 29.973333 0.213334 21.141333 21.141333 0 0 0-0.213333-29.973334l-172.629333-172.629333 374.997333 2.602667a20.693333 20.693333 0 0 0 21.034667-21.034667 21.482667 21.482667 0 0 0-21.333334-21.333333l-379.242666-2.624z"
              fill="#3D3D3D"
            ></path>
          </svg>
        </div>
        <h2 class="header-title">寄快递</h2>
      </div>
    </el-header>

    <el-main>
      <el-form :model="form" ref="formRef" label-width="120px">
        <el-form-item label="快递ID" prop="id" :rules="[{ required: true, message: '请输入快递ID', trigger: 'blur' }]">
          <el-input v-model="form.id" placeholder="请输入快递ID"></el-input>
        </el-form-item>

        <el-form-item label="快递公司" prop="courier" :rules="[{ required: true, message: '请选择快递公司', trigger: 'change' }]">
          <el-select v-model="form.courier" placeholder="请选择快递公司">
            <el-option label="顺丰" value="顺丰快递"></el-option>
            <el-option label="京东" value="京东快递"></el-option>
            <el-option label="中通" value="中通快递"></el-option>
            <el-option label="圆通" value="圆通快递"></el-option>
            <el-option label="申通" value="申通快递"></el-option>
            <el-option label="韵达" value="韵达快递"></el-option>
            <el-option label="邮政" value="邮政快递"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="取件码" prop="pickupCode" :rules="[{ required: true, message: '请输入取件码', trigger: 'blur' }]">
          <el-input v-model="form.pickupCode" placeholder="请输入取件码"></el-input>
        </el-form-item>

        <el-form-item label="收件人" prop="receiver" :rules="[{ required: true, message: '请输入收件人', trigger: 'blur' }]">
          <el-input v-model="form.receiver" placeholder="请输入收件人"></el-input>
        </el-form-item>

        <el-form-item label="驿站" prop="station" :rules="[{ required: true, message: '请选择驿站', trigger: 'change' }]">
          <el-select v-model="form.station" placeholder="请选择驿站" style="width: 100%">
            <el-option v-for="s in stations" :key="s" :label="s" :value="s"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="sendPackage">寄件</el-button>
        </el-form-item>
      </el-form>

      <el-alert
        v-if="dialogVisible"
        :title="dialogMessage"
        :type="dialogType"
        :closable="false"
        class="result-alert"
      ></el-alert>
    </el-main>
  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const router = useRouter()
const formRef = ref(null)
const form = ref({
  id: '',
  courier: '',
  pickupCode: '',
  receiver: '',
  station: ''
})
const stations = ref([])
const dialogVisible = ref(false)
const dialogMessage = ref('')
const dialogType = ref('success') // 'success' 或 'error'

const goBack = () => {
  router.back()
}

const token = localStorage.getItem('token')

onMounted(async () => {
  try {
    const { data } = await axios.get('/api/stations')
    stations.value = data
  } catch (e) {
    /* 驿站列表加载失败时仍可手动填写场景由后端校验兜底 */
  }
})

const sendPackage = async () => {
  if (!token) {
    dialogMessage.value = '请先登录！'
    dialogType.value = 'error'
    dialogVisible.value = true
    return
  }

  try {
    await formRef.value.validate() // 校验表单

    const { data: result } = await axios.post('/api/send', form.value)

    if (result.type === 'success') {
      dialogMessage.value = '寄件成功！取件码为: ' + form.value.pickupCode
      dialogType.value = 'success'
    } else {
      dialogMessage.value = '寄件失败: ' + result.message
      dialogType.value = 'error'
    }
  } catch (error) {
    dialogMessage.value = '寄件失败: 网络错误或表单未填完整'
    dialogType.value = 'error'
  }

  dialogVisible.value = true
}
</script>

<style scoped>
.header {
  background-color: #f4f4f4;
  padding: 10px 20px;
  border-bottom: 1px solid #ddd;
}
.header-content {
  display: flex;
  align-items: center;
}
.icon {
  margin-right: 10px;
}
.header-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  line-height: 40px;
}
.el-main {
  padding: 20px;
}
.el-form-item {
  margin-bottom: 20px;
}
.result-alert {
  margin-top: 20px;
}
</style>
