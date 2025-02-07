<script setup>
import MoreIcon from '@/components/icons/moreIcon.png';
import { ref, onMounted, computed } from 'vue';
import { fetchAreas } from '@/libs/fetchAreas';
import { useRoute } from 'vue-router';

const areas = ref([]);
const route = useRoute();

// โหลดพื้นที่ทั้งหมด
onMounted(async () => {
  areas.value = await fetchAreas();
});

// กรองไม่ให้แสดงพื้นที่ที่กำลังเปิดอยู่
const filteredAreas = computed(() => {
  const currentAreaId = parseInt(route.params.areaId, 10); // แปลงให้เป็น number
  return areas.value.filter(area => area.areaId !== currentAreaId);
});
</script>

<template>
  <div class="sidebar bg-[#540A0E] w-1/4 flex flex-col">
    <p class="text-white text-3xl font-itim underline p-20 px-5 mb-[-60px]">My Space</p>

      <router-link 
        v-for="(area, index) in filteredAreas" 
        :key="index" 
        :to="{ 
          name: 'Post', 
          params: { areaId: area.areaId },  // ส่ง areaId ผ่าน params
          query: { areaName: area.areaName } // ส่ง areaName ผ่าน query
        }"
        class="bg-[#540A0E] text-white font-itim py-2 rounded-md hover:bg-[#652B2E] transition duration-300"
        @click="$emit('area-selected', area.areaId)">
        <p class="text-left ml-5 text-xl">{{ area.areaName }}</p>
      </router-link>

    <div class="flex-grow"></div> <!-- Spacer to push content to bottom -->

    <router-link to="/">
      <div class="bg-[#540A0E] flex text-white font-itim py-2 rounded-md border border-white border-2 hover:bg-[#652B2E] transition duration-300 items-center justify-center w-full h-10">
        <img :src="MoreIcon" alt="More Icon" class="w-15 h-7 px-3" />
        <p class="text-xl">MORE SPACE</p>
      </div>
    </router-link>
  </div>
</template>

<style scoped>
.sidebar {
  position: fixed; /* Fix the sidebar */
  left: 0; /* Position at the left */
  top: 0; /* Position at the top */
  height: 100vh; /* Full height */
  width: 25vw; /* 25% of the viewport width */
}
</style>