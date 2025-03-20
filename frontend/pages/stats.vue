<template>
  <main class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Statistiques</h1>
    



    <!-- Séparateur -->
    <!-- Statistiques des utilisateurs -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total des utilisateurs -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Total des utilisateurs</h2>
        <p class="text-3xl font-bold text-purple-600">{{ totalUsers }}</p>
      </div>

      <!-- Utilisateurs avec tâches -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Utilisateurs avec tâches</h2>
        <p class="text-3xl font-bold text-indigo-600">{{ usersWithTodos }}</p>
      </div>

      <!-- Moyenne des tâches par utilisateur -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Moyenne des tâches par utilisateur</h2>
        <p class="text-3xl font-bold text-pink-600">{{ averageTodosPerUser }}</p>
      </div>
    </div>

    <div class="relative my-8">
      <div class="absolute inset-0 flex items-center" aria-hidden="true">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center">
        <span class="bg-white px-4 text-sm text-gray-500">Statistiques des Todos
        </span>
      </div>
    </div>

     <!-- Statistiques des todos -->
 <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Total des todos -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Total des todos</h2>
        <p class="text-3xl font-bold text-blue-600">{{ totalTodos }}</p>
      </div>

      <!-- Todos complétés -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Todos complétés</h2>
        <p class="text-3xl font-bold text-green-600">{{ completedTodos }}</p>
      </div>

      <!-- Todos en cours -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Todos en cours</h2>
        <p class="text-3xl font-bold text-yellow-600">{{ pendingTodos }}</p>
      </div>
    </div>
     </main>
</template>

<script setup>
const supabase = useSupabaseClient()

const totalTodos = ref(0)
const completedTodos = ref(0)
const pendingTodos = ref(0)
const totalUsers = ref(0)
const usersWithTodos = ref(0)
const averageTodosPerUser = ref(0)

onMounted(async () => {
  try {
    // Récupérer les todos
    const { data: todosData, error: todosError } = await supabase
      .from('todos')
      .select('id, completed, user_id')

    if (todosError) throw todosError

    // Récupérer les utilisateurs
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, todos(*)')

    if (usersError) throw usersError
    
    // Statistiques des todos
    totalTodos.value = todosData.length
    completedTodos.value = todosData.filter(todo => todo.completed).length
    pendingTodos.value = todosData.filter(todo => !todo.completed).length

    // Statistiques des utilisateurs
    totalUsers.value = usersData.length
    usersWithTodos.value = usersData.filter(user => user.todos && user.todos.length > 0).length
    averageTodosPerUser.value = totalUsers.value > 0 
      ? Math.round((totalTodos.value / totalUsers.value) * 10) / 10 
      : 0
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  }
})
</script>
