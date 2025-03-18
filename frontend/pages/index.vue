<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-800 mb-6">Bienvenue dans l'application Todo</h1>
      <NuxtLink 
        to="/todos" 
        class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-block"
      >
        Aller aux Todos
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// Redirection automatique vers /todos
onMounted(() => {
  navigateTo('/todos')
})
</script> 