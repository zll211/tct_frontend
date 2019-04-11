<template>
  <div class="main-container diagnostic-main">
    <TabsHeader></TabsHeader>
    <Analyzing></Analyzing>
  </div>
</template>

<script>
import TabsHeader from "../TabsHeader";
import Analyzing from "@/page/manage/diagnostic/pending/Analyzing";
export default {
  name: "analyzing",
  components: {
    TabsHeader,
    Analyzing
  }
};
</script>
