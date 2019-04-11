<template>
  <div class="no-analyzing">
    <div class="show">
      <div class="analyzing-content">
        <img src="../../../../assets/img/noanalyzing.png" alt="" width="305" height="241">
        <p class="content-first">当前没有正在分析的病理</p>
        <p class="content-second">请先到待分析表格中选择要分析的数据</p>
      </div>


    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
 .no-analyzing{
   flex:1;
   .show{
     height:100%;
     display:flex;
     align-items: center;
     justify-content: center;
     .analyzing-content{
       text-align:center;
       margin-top:-150px;
       .content-first{
         margin-top:25px;
         height:22px;
         font-size:16px;
         font-weight:500;
         color:rgba(137,147,168,1);
         line-height:22px;
       }
       .content-second{
         margin-top:5x;
         font-size:14px;
         font-weight:400;
         color:rgba(137,147,168,1);
         line-height:20px;
       }
     }
   }
 }
 @media screen and (max-height: 800px){
   .no-analyzing{
     .show{
       .content{
         margin-top:-50px;
       }
     }
   }
 }
</style>
