<template>
  <div id="customerList" class="container">    
    <nav class="nav nav-pills nav-fill">
      <a class="nav-item nav-link active" href="#">首页</a>
      <a class="nav-item nav-link" href="#" @click="goCustomerEdit('0')">新增</a>
      <a class="nav-item nav-link" href="#" @click="goHello">Hello</a>
    </nav>
    <hr>
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <td>头像</td>
          <td>职员名</td>
          <td>地址</td>
          <td>操作</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(customer,index) in customers" :key="customer._id">
          <td>
            <img :src='"http://127.0.0.1:3000/"+customer.img_path' width="40" height="40" class="rounded-circle">
          </td>
          <td>{{customer.name}}</td>
          <td>{{customer.address}}</td>
          <td>
            <button @click="goCustomerEdit(customer._id)" class="btn btn-success">修改</button>

        <button @click="goCustomerRemove(customer,index)" class="btn btn-danger">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import router from "../router/index";
import axios from "axios";

export default {
  name: "customerList",
  data() {
    return {
      customers: [] // 接收来自云端的数据
    };
  },
  created() {
    // 当创建组件前,初始化数据(访问云端)
    this.fetchData();
  },
  methods: {
    fetchData() {
      axios
        .get("http://127.0.0.1:3000/listCustomer?page=1&rows=20")
        .then(response => {
          this.customers = response.data;
          console.log(this.customers);
        })
        .catch(error => {
          console.log(error);
        });
    },
    goCustomerEdit(id) {
      router.push({ name: "CustomerEdit", params: { id: id } });
      return false;
    },
    goCustomerRemove(customer, index) {
      if (confirm("是否确认删除 " + customer.name + " ?")) {
        var querystring = require("querystring");

        axios
          .post(
            "http://127.0.0.1:3000/removeCustomer",
            querystring.stringify({ _id: customer._id })
          )
          .then(response => {
            console.log(response.data);
            // 删除后显示雇员列表
            this.customers.splice(index, 1);
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    goHello() {
      router.push({ name: "Hello" });
      return false;
    }
  }
};
</script>

<style>

</style>
