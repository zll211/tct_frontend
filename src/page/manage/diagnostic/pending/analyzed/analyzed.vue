<template>
  <div class="main-container diagnostic-main">
    <TabsHeader></TabsHeader>
    <Analyzed></Analyzed>
  </div>
</template>

<script>
import TabsHeader from "../TabsHeader";
import Analyzed from "@/page/manage/diagnostic/pending/Analyzed";
export default {
  name: "analyzed",
  components: {
    TabsHeader,
    Analyzed
  }
};
</script>
