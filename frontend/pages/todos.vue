<template>
  <main class="container mx-auto px-4 py-4 sm:py-8">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-8">Gestion des Todos</h1>
    
    <!-- Message d'erreur -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Filtres et Recherche -->
    <div class="bg-white rounded-lg shadow p-4 sm:p-6 mb-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input 
          v-model="filters.search"
          placeholder="Rechercher..." 
          class="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <select 
          v-model="filters.priority"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Toutes les priorités</option>
          <option value="high">Haute priorité</option>
          <option value="medium">Moyenne priorité</option>
          <option value="low">Basse priorité</option>
        </select>
        <select 
          v-model="filters.status"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En cours</option>
          <option value="completed">Terminé</option>
        </select>
        <select 
          v-model="filters.tag"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Tous les tags</option>
          <option v-for="tag in availableTags" :key="tag" :value="tag">
            {{ tag }}
          </option>
        </select>
      </div>
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
        <select 
          v-model="newTodo.priority"
          class="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="high">Haute priorité</option>
          <option value="medium">Moyenne priorité</option>
          <option value="low">Basse priorité</option>
        </select>
        <input 
          type="date"
          v-model="newTodo.due_date"
          class="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          v-model="newTodo.tags"
          placeholder="Tags (séparés par des virgules)" 
          class="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
        v-for="todo in filteredTodos" 
        :key="todo.id" 
        class="bg-white rounded-lg shadow p-4 sm:p-6 transition-all hover:shadow-lg"
      >
        <div v-if="editingTodo?.id === todo.id">
          <form @submit.prevent="updateTodo" class="space-y-4">
            <!-- Informations principales -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input 
                  v-model="editingTodo.title" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  v-model="editingTodo.description" 
                  rows="2"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            <!-- Statut et Priorité -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <div class="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    v-model="editingTodo.completed"
                    class="form-checkbox h-5 w-5 text-blue-500"
                  >
                  <span class="text-gray-700">Terminé</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                <select 
                  v-model="editingTodo.priority"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="high">Haute priorité</option>
                  <option value="medium">Moyenne priorité</option>
                  <option value="low">Basse priorité</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date d'échéance</label>
                <input 
                  type="date"
                  v-model="editingTodo.due_date"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <!-- Assignation et Tags -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Assigné à</label>
                <select 
                  v-model="editingTodo.user_id"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Non assigné</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <span 
                    v-for="tag in editingTodo.tags" 
                    :key="tag"
                    class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1"
                  >
                    {{ tag }}
                    <button 
                      type="button" 
                      @click="removeTag(tag)"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                </div>
                <div class="flex gap-2">
                  <input 
                    v-model="newTag"
                    placeholder="Nouveau tag" 
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @keyup.enter.prevent="addTag"
                  />
                  <button 
                    type="button"
                    @click="addTag"
                    class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>

            <!-- Boutons d'action -->
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                type="submit"
                :disabled="isLoading"
                class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300"
              >
                {{ isLoading ? 'Sauvegarde...' : 'Sauvegarder' }}
              </button>
              <button 
                type="button"
                @click="cancelEdit" 
                class="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
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
                <span 
                  :class="getPriorityColor(todo.priority)"
                  class="px-2 py-1 rounded-full text-sm"
                >
                  {{ todo.priority }}
                </span>
                <span 
                  v-if="todo.due_date"
                  :class="isOverdue(todo.due_date) ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'"
                  class="px-2 py-1 rounded-full text-sm"
                >
                  {{ formatDate(todo.due_date) }}
                </span>
              </div>
              <p class="text-gray-600 mt-2">{{ todo.description }}</p>
              <p class="text-sm text-gray-500 mt-2">
                Créé le {{ new Date(todo.created_at).toLocaleDateString() }}
              </p>
              <p v-if="todo.user" class="text-sm text-gray-500 mt-1">
                Assigné à: {{ todo.user.name }}
              </p>
              <div class="flex flex-wrap gap-2 mt-2">
                <span 
                  v-for="tag in todo.tags" 
                  :key="tag"
                  class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {{ tag }}
                </span>
              </div>
              <!-- Sous-tâches -->
              <div class="mt-4 pl-4 border-l-2 border-gray-200">
                <div 
                  v-for="subtask in todo.subtasks" 
                  :key="subtask.id"
                  class="flex items-center gap-2 mb-2"
                >
                  <input 
                    type="checkbox"
                    v-model="subtask.completed"
                    @change="updateSubtask(todo.id, subtask)"
                    class="form-checkbox h-4 w-4 text-blue-500"
                  />
                  <span :class="{ 'line-through': subtask.completed }">
                    {{ subtask.title }}
                  </span>
                </div>
                <form @submit.prevent="addSubtask(todo.id)" class="flex gap-2 mt-2">
                  <input 
                    v-model="newSubtasks[todo.id]"
                    placeholder="Nouvelle sous-tâche"
                    class="flex-1 px-3 py-1 border border-gray-300 rounded"
                  />
                  <button 
                    type="submit"
                    class="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    +
                  </button>
                </form>
              </div>
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

const { $graphql } = useNuxtApp()

const supabase = useSupabaseClient()

const todos = ref([])
const newTodo = ref({ 
  title: '', 
  description: '', 
  user_id: '',
  priority: 'medium', // Ajout de la priorité
  due_date: null, // Ajout de la date d'échéance
  tags: [] // Ajout des tags
})
const editingTodo = ref(null)
const isLoading = ref(false)
const error = ref(null)
const users = ref([])

// État des filtres
const filters = ref({
  search: '',
  priority: '',
  status: '',
  tag: ''
})

// Tags disponibles
const availableTags = ref([])

// Gestion des sous-tâches
const newSubtasks = ref({})

// Filtrer les todos
const filteredTodos = computed(() => {
  let result = todos.value

  // Filtre par recherche
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(todo => 
      todo.title.toLowerCase().includes(search) ||
      todo.description.toLowerCase().includes(search)
    )
  }

  // Filtre par priorité
  if (filters.value.priority) {
    result = result.filter(todo => todo.priority === filters.value.priority)
  }

  // Filtre par statut
  if (filters.value.status) {
    const isCompleted = filters.value.status === 'completed'
    result = result.filter(todo => todo.completed === isCompleted)
  }

  // Filtre par tag
  if (filters.value.tag) {
    result = result.filter(todo => todo.tags?.includes(filters.value.tag))
  }

  return result
})

// Charger les todos
const loadTodos = async () => {
  try {
    isLoading.value = true
    const client = useSupabaseClient()
    
    // Chargement des todos
    const { data: todosData, error: todosError } = await client
      .from('todos')
      .select(`
        *,
        user:users (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false })

    if (todosError) throw todosError

    // Tentative de chargement des sous-tâches
    let subtasksData = []
    try {
      const { data, error } = await client
        .from('subtasks')
        .select('*')
        .order('created_at', { ascending: true })
      
      if (!error) {
        subtasksData = data
      }
    } catch (err) {
      console.warn('Table subtasks non disponible:', err)
    }

    // Combinaison des données
    todos.value = (todosData || []).map(todo => ({
      ...todo,
      tags: Array.isArray(todo.tags) ? todo.tags : [],
      subtasks: subtasksData.filter(subtask => subtask?.todo_id === todo.id)
    }))
    
    // Extraction des tags uniques
    const tags = new Set()
    todos.value.forEach(todo => {
      if (todo.tags && Array.isArray(todo.tags)) {
        todo.tags.forEach(tag => tags.add(tag))
      }
    })
    availableTags.value = Array.from(tags)

  } catch (err) {
    console.error('Erreur:', err)
    error.value = "Erreur lors du chargement des todos"
  } finally {
    isLoading.value = false
  }
}

// Mettre à jour la fonction createTodo pour gérer les tags correctement
const createTodo = async () => {
  if (!newTodo.value.title.trim()) {
    error.value = "Le titre est requis"
    return
  }

  try {
    const tags = newTodo.value.tags
      ? newTodo.value.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      : []

    const client = useSupabaseClient()
    const { data, error } = await client
      .from('todos')
      .insert({
        title: newTodo.value.title,
        description: newTodo.value.description,
        user_id: newTodo.value.user_id ? parseInt(newTodo.value.user_id) : null,
        priority: newTodo.value.priority,
        due_date: newTodo.value.due_date,
        tags: tags
      })
      .select(`
        *,
        user:users (
          id,
          name
        )
      `)
      .single()

    if (error) throw error

    todos.value.unshift({
      ...data,
      subtasks: [],
      tags: tags
    })
    
    newTodo.value = { 
      title: '', 
      description: '', 
      user_id: '', 
      priority: 'medium', 
      due_date: null, 
      tags: ''
    }
  } catch (error) {
    console.error('Erreur lors de la création:', error)
    error.value = error.message
  }
}

// Démarrer l'édition
const startEdit = (todo) => {
  editingTodo.value = { 
    ...todo,
    tags: [...(todo.tags || [])], // Créer une copie du tableau des tags
    user_id: todo.user_id || '' // Assurer que user_id est une chaîne vide si null
  }
  newTag.value = ''
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
    const client = useSupabaseClient()
    const { data, error } = await client
      .from('todos')
      .update({
        title: editingTodo.value.title,
        description: editingTodo.value.description,
        completed: editingTodo.value.completed,
        user_id: editingTodo.value.user_id ? parseInt(editingTodo.value.user_id) : null,
        priority: editingTodo.value.priority,
        due_date: editingTodo.value.due_date,
        tags: editingTodo.value.tags
      })
      .eq('id', editingTodo.value.id)
      .select('*')
      .single()

    if (error) {
      throw new Error(error.message)
    }

    const index = todos.value.findIndex(t => t.id === data.id)
    todos.value[index] = data
    editingTodo.value = null
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
    error.value = error.message
  }
}

// Confirmer la suppression
const confirmDelete = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce todo ?')) {
    try {
      const client = useSupabaseClient()
      const { error } = await client
        .from('todos')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(error.message)
      }

      todos.value = todos.value.filter(t => t.id !== id)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      error.value = error.message
    }
  }
}

const loadUsers = async () => {
  try {
    const client = useSupabaseClient()
    const { data, error } = await client
      .from('users')
      .select('*')

    if (error) {
      throw new Error(error.message)
    }

    users.value = data || []
  } catch (err) {
    error.value = err.message
    console.error('Erreur lors du chargement des utilisateurs:', err)
    users.value = []
  }
}

// Fonction pour obtenir la couleur selon la priorité
const getPriorityColor = (priority) => {
  switch(priority) {
    case 'high': return 'bg-red-100 text-red-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'low': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// Formatter les dates
const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

// Vérifier si la date est dépassée
const isOverdue = (date) => {
  return new Date(date) < new Date()
}

// Ajouter une sous-tâche
const addSubtask = async (todoId) => {
  if (!newSubtasks.value[todoId]?.trim()) return

  try {
    const client = useSupabaseClient()
    const { data, error } = await client
      .from('subtasks')
      .insert({ 
        todo_id: todoId,
        title: newSubtasks.value[todoId],
        completed: false
      })
      .select('*')
      .single()

    if (error) throw error

    const todo = todos.value.find(t => t.id === todoId)
    if (todo) {
      if (!todo.subtasks) todo.subtasks = []
      todo.subtasks.push(data)
    }
    
    newSubtasks.value[todoId] = ''
  } catch (err) {
    console.error('Erreur lors de l\'ajout de la sous-tâche:', err)
  }
}

// Mettre à jour une sous-tâche
const updateSubtask = async (todoId, subtask) => {
  try {
    const client = useSupabaseClient()
    const { error } = await client
      .from('subtasks')
      .update({ completed: subtask.completed })
      .eq('id', subtask.id)

    if (error) throw error
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la sous-tâche:', err)
  }
}

// Charger les todos au montage
onMounted(async () => {
  try {
    await Promise.all([
      loadTodos(),
      loadUsers()
    ])
  } catch (err) {
    console.error('Erreur:', err)
  }
})

const newTag = ref('')

const addTag = () => {
  if (!newTag.value.trim()) return
  if (!editingTodo.value.tags) {
    editingTodo.value.tags = []
  }
  if (!editingTodo.value.tags.includes(newTag.value.trim())) {
    editingTodo.value.tags.push(newTag.value.trim())
  }
  newTag.value = ''
}

const removeTag = (tagToRemove) => {
  if (editingTodo.value.tags) {
    editingTodo.value.tags = editingTodo.value.tags.filter(tag => tag !== tagToRemove)
  }
}
</script>
