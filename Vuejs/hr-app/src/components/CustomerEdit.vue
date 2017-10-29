<template>
  <div id="customerEdit" class="container">
    <nav class="nav nav-pills nav-fill">
      <a class="nav-item nav-link" href="#" @click="goIndex">首页</a>
      <a class="nav-item nav-link active" href="#">{{addOrEdit}}</a>
      <a class="nav-item nav-link" href="#" @click="goHello">Hello</a>
    </nav>
    <hr>

    <div class="form-group">
      <input v-model="customer.name" placeholder="职员名" class="form-control" type="text">
    </div>
    <div class="form-group">
      <input v-model="customer.address" placeholder="地址" class="form-control" type="text">
    </div>
    <img :src='"http://127.0.0.1:3000/"+customer.img_path' width="80" height="80" class="rounded-circle">
    <!--
    <div class="form-group">
      <input v-model="customer.img_path" placeholder="图片" class="form-control" type="text">
    </div>
    -->
    <!--
    field:后端接收文件用的 name [域，上传文件name，触发事件会带上（如果一个页面多个图片上传控件，可以做区分]
    @crop-success @crop-upload-success @crop-upload-fail 钩子函数
    width height: 最终裁剪后的图片大小
    url 上传文件的接口
    img-format 图片格式
    -->
    <my-upload
      field="avatar"
      v-model="show"
      @crop-success="cropSuccess"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail"
      :width="200"
      :height="200"
      url="http://127.0.0.1:3000/profile"
      img-format="png">
    </my-upload>
    <button class="btn btn-info btn-block" @click="toggleShow">上传图片</button>
    <button class="btn btn-primary btn-block" @click="save">保存</button>
  </div>
</template>

<script>
import router from "../router/index";
import axios from "axios";
// 导入 vue 图片上传的组件
import myUpload from "vue-image-crop-upload/upload-2.vue";

var querystring = require("querystring");

export default {
  name: "customerEdit",
  data() {
    return {
      customer: {},
      op: false,
      addOrEdit: "新增",
      show: false, // 选择图片的窗口显示/隐藏
      imgDataUrl: "" // 图片的数据路径
    };
  },
  components: {
    "my-upload": myUpload
  },
  created() {
    // 接收路由参数值
    var id = this.$route.params.id;
    console.log(id);
    if (id != "0") {
      console.log("修改...根据 id 查询数据库");
      this.op = true; // 修改操作
      this.addOrEdit = "修改";
      this.fetchData(id);
    } else {
      console.log("新增");
      this.customer.img_path = "images/empty_photo.png";
    }
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    cropSuccess(imgDataUrl, field) {
      this.imgDataUrl = imgDataUrl;
    },
    cropUploadSuccess(resData, field) {
      console.log(resData);
      // 设置当前职员的图片路径(上传之后的图片路径)
      this.customer.img_path = resData.img_path;
    },
    cropUploadFail(status, field) {},
    fetchData(id) {
      var querystring = require("querystring");

      axios
        .post(
          "http://127.0.0.1:3000/findCustomerById",
          querystring.stringify({ _id: id })
        )
        .then(response => {
          console.log(response.data);
          this.customer = response.data[0];
        })
        .catch(error => {
          console.log(error);
        });
    },
    save() {
      console.log(this.customer);

      var url = "addCustomer";
      if (this.op) {
        url = "modifyCustomer";
      }

      axios
        .post(
          "http://127.0.0.1:3000/" + url,
          querystring.stringify(this.customer)
        )
        .then(response => {
          console.log(response.data);
          // 保存成功后跳转至首页
          router.push({ name: "CustomerList" });
        })
        .catch(error => {
          console.log(error);
        });
    },
    goHello() {
      router.push({ name: "Hello" });
      return false;
    },
    goIndex() {
      router.push({ name: "CustomerList" });
      return false;
    }
  }
};
</script>

<style>

</style>
