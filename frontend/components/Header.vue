<template>
  <header class="bg-white shadow-md">
    <nav class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo et titre -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <span class="text-2xl font-bold text-blue-600">📝</span>
            <span class="text-xl font-semibold text-gray-800 hidden sm:block">Todo App</span>
          </NuxtLink>
        </div>

        <!-- Navigation principale - Desktop -->
        <div class="hidden md:flex items-center space-x-4">
          <NuxtLink 
            to="/todos" 
            class="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Todos
          </NuxtLink>
          <NuxtLink 
            to="/stats" 
            class="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Statistiques
          </NuxtLink>
          <NuxtLink 
            to="/users" 
            class="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Utilisateurs
          </NuxtLink>
        </div>

        <!-- Menu utilisateur -->
        <div class="flex items-center space-x-4">

          <!-- Menu mobile -->
          <button 
            @click="isMenuOpen = !isMenuOpen"
            class="md:hidden p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg 
              class="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                v-if="!isMenuOpen"
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path 
                v-else
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Menu mobile -->
      <div 
        v-show="isMenuOpen" 
        class="md:hidden pb-4"
      >
        <div class="flex flex-col space-y-2">
          <NuxtLink 
            to="/todos" 
            class="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            @click="isMenuOpen = false"
          >
            Todos
          </NuxtLink>
          <NuxtLink 
            to="/stats" 
            class="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            @click="isMenuOpen = false"
          >
            Statistiques
          </NuxtLink>
          <NuxtLink 
            to="/users" 
            class="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            @click="isMenuOpen = false"
          >
            Utilisateurs
          </NuxtLink>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
const isMenuOpen = ref(false)
</script> 