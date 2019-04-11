<template>
  <div class="main-container diagnostic-main">
    <TabsHeader></TabsHeader>
    <NotAnalyzed></NotAnalyzed>
  </div>
</template>

<script>
import TabsHeader from "../TabsHeader";
import NotAnalyzed from "@/page/manage/diagnostic/pending/NotAnalyzed";
export default {
  name: "notanalyzed",
  components: {
    TabsHeader,
    NotAnalyzed
  }
};
</script>
