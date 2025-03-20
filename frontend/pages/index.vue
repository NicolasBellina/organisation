<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <!-- En-tête -->
    <div class="container mx-auto px-4 py-12 text-center">
      <h1 class="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
        Application de Gestion des Tâches
      </h1>
      <p class="text-xl text-gray-600 mb-12">
        Gérez vos tâches et votre équipe efficacement
      </p>
    </div>

    <!-- Cards de navigation -->
    <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <!-- Card Todos -->
      <NuxtLink to="/todos" 
        class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
        <div class="p-6">
          <div class="bg-blue-500 text-white rounded-lg w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Todos</h2>
          <p class="text-gray-600">Gérez vos tâches quotidiennes et suivez leur progression</p>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <span class="text-blue-500 font-semibold group-hover:text-blue-600 transition-colors">
            Voir les todos →
          </span>
        </div>
      </NuxtLink>

      <!-- Card Utilisateurs -->
      <NuxtLink to="/users" 
        class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
        <div class="p-6">
          <div class="bg-green-500 text-white rounded-lg w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Utilisateurs</h2>
          <p class="text-gray-600">Gérez les membres de votre équipe et leurs accès</p>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <span class="text-green-500 font-semibold group-hover:text-green-600 transition-colors">
            Gérer les utilisateurs →
          </span>
        </div>
      </NuxtLink>

      <!-- Card Statistiques -->
      <NuxtLink to="/stats" 
        class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
        <div class="p-6">
          <div class="bg-purple-500 text-white rounded-lg w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Statistiques</h2>
          <p class="text-gray-600">Visualisez les métriques et la progression de chaque utilisateur</p>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <span class="text-purple-500 font-semibold group-hover:text-purple-600 transition-colors">
            Voir les statistiques →
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>

</template>

<script setup>
// Suppression de la redirection automatique pour permettre l'affichage de la page d'accueil
</script>
