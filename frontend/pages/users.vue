<template>
  <main class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Gestion des Utilisateurs</h1>

    <!-- Message d'erreur -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Formulaire d'ajout/modification -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <form @submit.prevent="editMode ? updateUser() : createUser()" class="flex flex-col md:flex-row gap-4">
        <input 
          v-model="newUser.name" 
          required
          placeholder="Nom" 
          class="w-full md:flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          v-model="newUser.email" 
          required
          type="email"
          placeholder="Email" 
          class="w-full md:flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div class="flex gap-2 w-full md:w-auto">
          <button 
            type="submit"
            :disabled="isLoading"
            class="flex-1 md:flex-none px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            {{ isLoading ? 'En cours...' : editMode ? 'Modifier' : 'Ajouter' }}
          </button>
          <button 
            v-if="editMode"
            type="button"
            @click="cancelEdit"
            class="flex-1 md:flex-none px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>

    <!-- Liste des utilisateurs -->
    <div class="grid grid-cols-1 gap-4">
      <div 
        v-for="user in users" 
        :key="user.id" 
        class="bg-white rounded-lg shadow p-6"
      >
        <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div class="w-full sm:w-auto">
            <h3 class="text-xl font-semibold text-gray-800">{{ user.name }}</h3>
            <p class="text-gray-600">{{ user.email }}</p>
            <p class="text-sm text-gray-500 mt-2">
              {{ user.todos?.length || 0 }} tâches assignées
            </p>
          </div>
          <div class="flex gap-2 w-full sm:w-auto">
            <button 
              @click="editUser(user)"
              class="flex-1 sm:flex-none px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Modifier
            </button>
            <button 
              @click="deleteUser(user.id)"
              class="flex-1 sm:flex-none px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
const { $graphql } = useNuxtApp()

const users = ref([])
const newUser = ref({ name: '', email: '' })
const error = ref(null)
const isLoading = ref(false)
const editMode = ref(false)

const GET_USERS = `
  query GetUsers {
    users {
      id
      name
      email
      todos {
        id
        title
      }
    }
  }
`

const CREATE_USER = `
  mutation CreateUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`

const DELETE_USER = `
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id)
  }
`

const UPDATE_USER = `
  mutation UpdateUser($id: Int!, $name: String!, $email: String!) {
    updateUser(id: $id, name: $name, email: $email) {
      id
      name
      email
    }
  }
`

const loadUsers = async () => {
  try {
    isLoading.value = true
    error.value = null
    const { data } = await $graphql(GET_USERS)
    users.value = data.users
  } catch (err) {
    error.value = "Erreur lors du chargement des utilisateurs"
    console.error('Erreur:', err)
  } finally {
    isLoading.value = false
  }
}

const createUser = async () => {
  try {
    isLoading.value = true
    error.value = null
    const { data } = await $graphql(CREATE_USER, newUser.value)
    users.value.unshift(data.createUser)
    newUser.value = { name: '', email: '' }
  } catch (err) {
    error.value = "Erreur lors de la création de l'utilisateur"
    console.error('Erreur:', err)
  } finally {
    isLoading.value = false
  }
}

const deleteUser = async (id) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return
  
  try {
    isLoading.value = true
    error.value = null
    await $graphql(DELETE_USER, { id })
    users.value = users.value.filter(user => user.id !== id)
  } catch (err) {
    error.value = "Erreur lors de la suppression de l'utilisateur"
    console.error('Erreur:', err)
  } finally {
    isLoading.value = false
  }
}

const editUser = (user) => {
  editMode.value = true
  newUser.value = { ...user }
}

const cancelEdit = () => {
  editMode.value = false
  newUser.value = { name: '', email: '' }
}

const updateUser = async () => {
  try {
    isLoading.value = true
    error.value = null
    const { data } = await $graphql(UPDATE_USER, {
      id: newUser.value.id,
      name: newUser.value.name,
      email: newUser.value.email
    })
    
    const index = users.value.findIndex(u => u.id === newUser.value.id)
    if (index !== -1) {
      users.value[index] = data.updateUser
    }
    
    cancelEdit()
  } catch (err) {
    error.value = "Erreur lors de la modification de l'utilisateur"
    console.error('Erreur:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(loadUsers)
</script>