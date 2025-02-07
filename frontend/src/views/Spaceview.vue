<script setup>
import Header from '@/components/Header.vue';
import FavoriteList from '@/components/icons/favoriteIist.png';
import AddSpace from '@/components/icons/addSpace.png';
import Clear from '@/components/icons/clearSearch.png';
import Search from '@/components/icons/searchIcon.png';
import AddImage from '@/components/icons/AddImage.png';
import { addArea, fetchAreas } from '@/libs/fetchAreas';
import { ref, onMounted, computed } from 'vue';

const areas = ref([]);
const showModal = ref(false);
const searchQuery = ref('');
const newAreaName = ref('');
const newAreaDescription = ref('');
// Fetch areas when the component is mounted
onMounted(async () => {
  areas.value = await fetchAreas();
});

// Add area method
const handleAddArea = async () => {
  await addArea(newAreaName, newAreaDescription, areas, showModal);
};

// Computed property to filter areas based on the search query
const filteredAreas = computed(() => {
  const searchText = searchQuery.value.toLowerCase();
  return areas.value.filter(area => {
    const areaName = area.areaName ? area.areaName.toLowerCase() : '';
    const areaDescription = area.areaDescription ? area.areaDescription.toLowerCase() : '';

    return areaName.includes(searchText) || areaDescription.includes(searchText);
  });
});

// Clear search query
const clearSearch = () => {
  searchQuery.value = '';
};
</script>

<template>
  <div class="bg-[#FFF7CB] min-h-screen">
    <!-- Header -->
    <div class="fixed left-0 top-0 w-full h-[50px] z-50">
      <Header />
    </div>

    <!-- Search Bar -->
    <div class="flex items-center gap-4 p-4 mx-auto max-w-4xl pt-[80px]">
      <button class="flex items-center justify-center">
        <img :src="FavoriteList" alt="Star Icon" class="w-12 h-12" />
      </button>

      <!-- Search Box -->
      <div class="flex items-center flex-1 bg-[#E09F3E] p-1 rounded-full">
        <img :src="Search" alt="Search Icon" class="w-15 h-8 px-3" />
        <input type="text" v-model="searchQuery" placeholder="Search"
          class="flex-1 px-4 py-2 bg-transparent rounded-full focus:outline-none text-white placeholder-[#BD7509]" />
        <button @click="clearSearch">
          <img :src="Clear" alt="Clear Icon" class="w-11 h-4 px-3 hover:scale-50" />
        </button>
      </div>

      <!-- Add Space Button (Modal Trigger) -->
      <button @click="showModal = true" class="flex items-center justify-center">
        <img :src="AddSpace" alt="AddSpace Icon" class="w-12 h-12" />
      </button>
    </div>

    <!-- Areas List -->
    <div class="flex justify-center bg-[#FFF7CB]">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-x-16 gap-y-5 p-4 rounded-md w-full max-w-6xl">
        <router-link v-for="(area, index) in filteredAreas" :key="index"
          :to="{ path: `/posts/area/${area.areaId}`, query: { areaName: area.areaName } }"
          class="bg-[#4D322A] p-3 rounded-md w-[270px] text-center text-white hover:bg-[#6B453D] transition font-itim">
          <p>{{ area.areaName }}</p>
          <p class="text-sm text-gray-300">{{ area.areaDescription }}</p>
        </router-link>
      </div>
    </div>

    <!-- Modal for Adding New Area -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-[#E09F3E] w-5/12 p-6 rounded-xl shadow-lg">
        <h3 class="text-3xl font-itim mb-2 text-[#FFF3B0] text-center">Create New Space</h3>
        <hr class="mb-3 border border-[#FFF3B0] rounded-full ">
        <div class="flex justify-center items-center">
          <img :src="AddImage" alt="addImage Icon" class="w-40 mb-3 ">
        </div>
        <!-- Area Name Input -->
        <h1 class="font-itim text-[#FFF3B0] text-lg">Space Name</h1>
        <input v-model="newAreaName" type="text"
          class="w-full px-4 py-2 rounded-xl border border-[2px] border-[#FFF7CC] mb-3 font-itim bg-[#E09F3E] text-[#FFF7CC]" />

        <!-- Area Description Input -->
        <h1 class="font-itim text-[#FFF3B0] text-lg">Space Description</h1>
        <textarea v-model="newAreaDescription"
          class="w-full px-4 py-2 rounded-xl border border-[2px] border-[#FFF7CC] mb-4 font-itim bg-[#E09F3E] text-[#FFF7CC]"
          rows="4">
        </textarea>

        <div class="flex justify-center gap-4">
          <!-- Cancel Button -->
          <button @click="showModal = false"
            class="bg-gray-300 px-24 py-2 rounded-full font-itim transition duration-300 ease-in-out hover:bg-gray-400 hover:shadow-lg active:scale-95 text-black">
            Cancel
          </button>

          <!-- Create Button -->
          <button @click="handleAddArea"
            class="bg-[#5FBA80] text-white px-24 py-2 rounded-full font-itim transition duration-300 ease-in-out hover:bg-[#4AA96C] hover:shadow-lg active:scale-95">
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles you need */
</style>