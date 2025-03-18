<template>
  <main class="container mx-auto px-4 py-4 sm:py-8">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-8">Gestion des Todos</h1>
    
    <!-- Message d'erreur -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Formulaire d'ajout -->
    <div class="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-8">
      <form @submit.prevent="createTodo" class="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <input 
          v-model="newTodo.title" 
          required
          placeholder="Titre" 
          class="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          v-model="newTodo.description" 
          placeholder="Description" 
          class="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select 
          v-model="newTodo.user_id"
          class="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Non assigné</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>
        <button 
          type="submit"
          :disabled="isLoading"
          class="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          {{ isLoading ? 'Ajout...' : 'Ajouter' }}
        </button>
      </form>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading && !todos.length" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">Chargement des todos...</p>
    </div>

    <!-- Liste des todos -->
    <div v-else class="space-y-3 sm:space-y-4">
      <div v-if="!todos.length" class="text-center py-8 bg-white rounded-lg shadow">
        <p class="text-gray-600">Aucun todo pour le moment</p>
      </div>

      <div 
        v-for="todo in todos" 
        :key="todo.id" 
        class="bg-white rounded-lg shadow p-4 sm:p-6 transition-all hover:shadow-lg"
      >
        <div v-if="editingTodo?.id === todo.id">
          <form @submit.prevent="updateTodo" class="space-y-3 sm:space-y-4">
            <input 
              v-model="editingTodo.title" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              v-model="editingTodo.description" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  v-model="editingTodo.completed"
                  class="form-checkbox h-5 w-5 text-blue-500"
                >
                <span class="text-gray-700">Terminé</span>
              </label>
            </div>
            <select 
              v-model="editingTodo.user_id"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Non assigné</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300"
              >
                {{ isLoading ? 'Sauvegarde...' : 'Sauvegarder' }}
              </button>
              <button 
                type="button"
                @click="cancelEdit" 
                class="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
        <div v-else>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3">
                <h3 class="text-xl font-semibold text-gray-800" :class="{ 'line-through': todo.completed }">
                  {{ todo.title }}
                </h3>
                <span 
                  v-if="todo.completed" 
                  class="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                >
                  Terminé
                </span>
              </div>
              <p class="text-gray-600 mt-2">{{ todo.description }}</p>
              <p class="text-sm text-gray-500 mt-2">
                Créé le {{ new Date(todo.created_at).toLocaleDateString() }}
              </p>
              <p v-if="todo.user" class="text-sm text-gray-500 mt-1">
                Assigné à: {{ todo.user.name }}
              </p>
            </div>
            <div class="flex gap-2 mt-4 sm:mt-0">
              <button 
                @click="startEdit(todo)" 
                class="flex-1 sm:flex-none px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Modifier
              </button>
              <button 
                @click="confirmDelete(todo.id)" 
                class="flex-1 sm:flex-none px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useNuxtApp } from '#app'

const { $graphql } = useNuxtApp()

const todos = ref([])
const newTodo = ref({ title: '', description: '', user_id: '' })
const editingTodo = ref(null)
const isLoading = ref(false)
const error = ref(null)
const users = ref([])

const API_URL = 'http://localhost:4000/graphql'

// Fonction utilitaire pour les requêtes GraphQL avec gestion d'erreur
const graphqlRequest = async (query, variables = {}) => {
  try {
    isLoading.value = true
    error.value = null
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables
      })
    })
    
    const result = await response.json()
    
    if (result.errors) {
      throw new Error(result.errors[0].message)
    }
    
    return result
  } catch (e) {
    error.value = e.message
    throw e
  } finally {
    isLoading.value = false
  }
}

// Requêtes GraphQL
const GET_TODOS = `
  query GetTodos {
    todos {
      id
      title
      description
      completed
      created_at
      user_id
      user {
        name
      }
    }
  }
`

const CREATE_TODO = `
  mutation CreateTodo($title: String!, $description: String, $user_id: Int) {
    createTodo(title: $title, description: $description, user_id: $user_id) {
      id
      title
      description
      completed
      created_at
      user_id
      user {
        name
      }
    }
  }
`


const UPDATE_TODO = `
  mutation UpdateTodo($id: Int!, $title: String, $description: String, $completed: Boolean, $user_id: Int) {
    updateTodo(id: $id, title: $title, description: $description, completed: $completed, user_id: $user_id) {
      id
      title
      description
      completed
      created_at
      user_id
      user {
        name
      }
    }
  }
`

const DELETE_TODO = `
  mutation DeleteTodo($id: Int!) {
    deleteTodo(id: $id)
  }
`

const GET_USERS = `
  query GetUsers {
    users {
      id
      name
    }
  }
`

// Charger les todos
const loadTodos = async () => {
  try {
    const { data } = await graphqlRequest(GET_TODOS)
    todos.value = data.todos
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  }
}

// Créer un todo
const createTodo = async () => {
  if (!newTodo.value.title.trim()) {
    error.value = "Le titre est requis"
    return
  }
  
  try {
    const variables = {
      ...newTodo.value,
      user_id: newTodo.value.user_id ? parseInt(newTodo.value.user_id) : null
    }
    const { data } = await graphqlRequest(CREATE_TODO, variables)
    todos.value.unshift(data.createTodo)
    newTodo.value = { title: '', description: '', user_id: '' }
  } catch (error) {
    console.error('Erreur lors de la création:', error)
  }
}

// Démarrer l'édition
const startEdit = (todo) => {
  editingTodo.value = { ...todo }
}

// Annuler l'édition
const cancelEdit = () => {
  editingTodo.value = null
  error.value = null
}

// Mettre à jour un todo
const updateTodo = async () => {
  if (!editingTodo.value.title.trim()) {
    error.value = "Le titre est requis"
    return
  }
  
  try {
    const { data } = await graphqlRequest(UPDATE_TODO, {
      id: editingTodo.value.id,
      title: editingTodo.value.title,
      description: editingTodo.value.description,
      completed: editingTodo.value.completed,
      user_id: editingTodo.value.user_id
    })
    const index = todos.value.findIndex(t => t.id === data.updateTodo.id)
    todos.value[index] = data.updateTodo
    editingTodo.value = null
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
  }
}

// Confirmer la suppression
const confirmDelete = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce todo ?')) {
    try {
      await graphqlRequest(DELETE_TODO, { id })
      todos.value = todos.value.filter(t => t.id !== id)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

const loadUsers = async () => {
  try {
    const { data } = await graphqlRequest(GET_USERS)
    users.value = data.users
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error)
  }
}

// Charger les todos au montage
onMounted(async () => {
  await Promise.all([
    loadTodos(),
    loadUsers()
  ])
})
</script>
