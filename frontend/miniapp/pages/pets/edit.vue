<template>
  <view class="container">
    <view class="form-item">
      <t-input v-model="form.name" placeholder="名字" />
    </view>
    <view class="form-item">
      <t-input v-model="form.type" placeholder="种类" />
    </view>
    <view class="form-item">
      <t-picker :columns="genderOptions" @change="changeGender">
        <t-input readonly :value="genderText" placeholder="选择性别" />
      </t-picker>
    </view>
    <view class="form-item">
      <t-input v-model="form.age" placeholder="年龄" />
    </view>
    <t-button theme="primary" @click="submit">保存</t-button>
  </view>
</template>

<script>
import { request } from '@/utils/request'
// Import TDesign mini program components
import { Input, Button, Picker } from 'tdesign-miniprogram/vue'

export default {
  components: { 't-input': Input, 't-button': Button, 't-picker': Picker },
  data() {
    return {
      form: {
        id: '',
        name: '',
        type: '',
        gender: '',
        age: ''
      },
      genderOptions: ['公', '母']
    }
  },
  onLoad(options) {
    if (options.id) {
      this.form.id = options.id
      this.loadPet()
    }
  },
  computed: {
    genderText() {
      return this.form.gender !== '' ? this.genderOptions[this.form.gender] : '选择性别'
    }
  },
  methods: {
    changeGender(e) {
      this.form.gender = e.detail.value
    },
    loadPet() {
      request({ url: `/pets/${this.form.id}` }).then(res => {
        this.form = res
      })
    },
    submit() {
      const method = this.form.id ? 'PUT' : 'POST'
      const url = this.form.id ? `/pets/${this.form.id}` : '/pets'
      request({ url, method, data: this.form }).then(() => {
        uni.navigateBack()
      })
    }
  }
}
</script>
