<template>
  <aside class="el-aside" :class="{'close-side': collapse}">
    <div class="side-top flex justify-content-between" @click="modifyCollapse">
      <img style="margin-left: 15px" v-show="!collapse" src="../assets/img/headerLogo.png">
      <img src="../assets/img/navCloseIcon.png"/>
      <!--<span v-show="!collapse">细胞病理TCT诊断平台</span>-->
    </div>
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical"
      :unique-opened="true"
      background-color="#ffffff"
      text-color="#8993A8"
      active-text-color="#4868B9"
      :collapse="collapse"
      :router="true"
      @select="menuSelect">
      <div class="side-menu">
        <el-submenu
          v-if="menu.children&&menu.children.length >0"
          :index="menu.path+''" v-for="(menu, index) in menus" :key="index">
          <template slot="title">
            <!--<i class="el-icon-caret-right"></i>-->
            <i><img :src="menu.icon" alt="" width="16" v-if="!menu.select">
              <img :src="menu.activeIcon" alt="" width="16" v-else></i>
            <span style="margin-left: 20px" slot="title">{{menu.name}}</span>
          </template>
          <el-menu-item
            :index="menu.path+'/'+child.path"
            v-for="(child, index1) in menu.children" :key="index1">
            <i>
              <img :src="child.icon" alt="" width="14" v-if="!child.select">
              <img :src="child.activeIcon" alt="" width="14" v-else></i>
            <span style="margin-left: 20px">{{child.name}}</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item
          v-if="menu.children&&menu.children.length ===0&&!menu.isShow"
          :index="menu.path" v-for="(menu, index) in menus"
          :key="index" class="single-nav">
          <!-- <i class="el-icon-menu"></i>-->
          <i><img :src="menu.icon" alt="" width="16" v-if="!menu.select">
            <img :src="menu.activeIcon" alt="" width="16" v-else></i>
          <span style="margin-left: 20px" slot="title">{{menu.name}}</span>
        </el-menu-item>
      </div>
    </el-menu>
  </aside>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        menuIndex:undefined,
        subIndex:undefined,
      }
    },
    watch:{
      $route(to,from){
        this.changeIcon(to.path)
      },
    },
    created() {
      this.menus.forEach((item)=>{
        if(!item.isShow){
          item.select = false;
          let menuArray= item.icon.split('.');
          item.activeIcon = menuArray[0]+'A.'+menuArray[1];
          if(item.children&&item.children.length>0){
            item.children.forEach((subItem)=>{
              subItem.select = false;
              let arr = subItem.icon.split('.');
              subItem.activeIcon = arr[0]+'A.'+arr[1];
            })
          }
        }
      })
      this.changeIcon(this.$route.path)
    },
    computed: mapState([
      'menus',
      'collapse',
    ]),
    methods: {
      modifyCollapse() {
        this.$store.commit('setCollapse', !this.collapse);
        setTimeout(() => {
          this.$root.$emit('size-change');
        }, 300);
      },
      menuSelect(index){
        // this.changeIcon(index)
      },
      changeIcon(routePath){
        let num=0;
        let childrenNum=0;
        let menu = this.menus.findIndex((item)=>item.path===routePath);
        if(menu===-1){
          let selectArray = routePath.split('/');
          let selectMenu = selectArray[selectArray.length-1];
          this.menus.forEach((item,itemIndex)=>{
            this.$set(this.menus[itemIndex],'select',false)
            if(item.children&&item.children.length>0){
              childrenNum++;
              item.children.forEach((subItem,subIndex)=>{
                if(subItem.path===selectMenu||subItem.redirect===routePath){
                  this.$set(this.menus[itemIndex].children[subIndex],'select',true)
                  this.$set(this.menus[itemIndex],'select',true)
                  this.menuIndex = itemIndex;
                  this.subIndex=subIndex;
                }
                else {
                  this.$set(this.menus[itemIndex].children[subIndex],'select',false)
                }
              })
              let sub=item.children.findIndex((item)=>item.path===selectMenu);
              let three=item.children.findIndex((item)=>item.redirect===routePath);
              if(sub===-1&&three===-1){
                num++;

              }
            }
          })
          if(num===childrenNum){
            if(this.menuIndex!==undefined){
              this.$set(this.menus[this.menuIndex],'select',true);
              if(this.subIndex!==undefined){
                this.$set(this.menus[this.menuIndex].children[this.subIndex],'select',true)
              }
            }
          }
        }
        else {
          this.menus.forEach((item,itemIndex)=>{
            if(itemIndex===menu){
              this.menus[menu].select=true;
              this.menuIndex=itemIndex;
              this.subIndex=undefined;
            }
            else{
              item.select=false;
            }
            if(item.children&&item.children.length>0){
              item.children.forEach((val,valIndex)=>{
                this.$set(this.menus[itemIndex].children[valIndex],'select',false)
              })
            }

          })

        }
        this.$forceUpdate();
      }
    },
  }
</script>

<style lang="scss">
  @import "../style/variables";

  .el-aside {
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border-right: 1px solid #E2E2E4;
    &.close-side{
      .side-top{
        width: 30px;
        transition: width linear .3s;
      }
    }
    .side-top{
      height: 67px;
      min-height: 67px;
      width: 181px;
      border-bottom: 1px solid #E2E2E4;
      background: $_pm-base-color;
      display: flex;
      align-items: center;
      padding: 0 15px;
      font-size: 18px;
      color: #4868B9;
      line-height: 1;
      margin-bottom: 30px;
      transition: width linear .3s;
      .circle{
        & + span {
          margin-left: 9px;
        }
      }
      &:hover{
        cursor: pointer;
      }
    }
    .side-menu{
      /*padding: 0 5px;*/
      font-size: 16px;
      li {
        margin:  5px 0;
      }
    }
    .el-menu {
      border-right: none;
      .single-nav {
        .el-tooltip {
          display: flex !important;;
          align-items: center;
          justify-content: center;
          &:hover {
            background-color: $_pm-base-color !important;
          }
        }
        [class^="el-icon-"] {
          margin-right: 0;
        }
      }
      .el-submenu{
        img{
          height:16px;
        }
      }
    }
    .el-submenu__title {
      height: 43px;
      line-height: 43px;
      font-size: 16px;
      display: flex;
      align-items: center;
      background-color: $_pm-base-color !important;
    }
    .el-menu-vertical:not(.el-menu--collapse) {
      width: 210px;
      /*min-height: 800px;*/
      flex: 1;
    }
    .el-menu--collapse {
      width: 50px;
      height: 100%;
      .el-submenu {
        & > .el-submenu__title {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 !important;
          span {
            display: none;
          }
          &:hover {
            & > .el-submenu__title {
              background-color: $_pm-base-color !important;
            }
            i {
              color: #fff !important;
            }
            background-color: $_pm-base-color !important;
          }
        }
        &.is-active {
          & > .el-submenu__title {
            background-color: $_pm-base-color !important;
          }
          i {
            color: #fff !important;
          }
        }
      }
    }
    .el-submenu {
      .el-menu-item {
        height: 43px;
        line-height: 43px;
        min-width: 210px;
        font-size: 14px;
        padding: 0 30px !important;
        &.is-active {
          background-color: $_pm-base-color !important;
          border-right: 4px solid #4868B9;
        }
        &:hover {
          background-color: $_pm-base-color !important;
          border-right: 4px solid #4868B9;
        }
      }
    }
  }

  .el-menu-item {
    height: 43px;
    line-height: 43px;
    font-size: 16px;
    display: flex;
    align-items: center;
    img{
      width:14px;
      height:14px;
    }
    &:hover {
      background-color: $_pm-base-color !important;
      border-right: 4px solid #4868B9;
    }
    &.is-active {
      background-color: $_pm-base-color !important;
      border-right: 4px solid #4868B9;
      i {
        color: #fff !important;
      }
    }
  }
</style>
