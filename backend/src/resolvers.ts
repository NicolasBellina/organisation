import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export const resolvers = {
  Query: {
    todos: async () => {
      const { data, error } = await supabase
        .from('todos')
        .select(`
          *,
          user:users(*)
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    
    todo: async (_, { id }) => {
      const { data, error } = await supabase
        .from('todos')
        .select(`
          *,
          user:users(*)
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },

    users: async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          todos(*)
        `)
      
      if (error) throw error
      return data
    },

    user: async (_, { id }) => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          todos(*)
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    }
  },

  Mutation: {
    createTodo: async (_, { title, description, user_id }) => {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ 
          title, 
          description, 
          completed: false,
          user_id
        }])
        .select(`
          *,
          user:users(*)
        `)
        .single()
      
      if (error) throw error
      return data
    },

    updateTodo: async (_, { id, title, description, completed, user_id }) => {
      const { data, error } = await supabase
        .from('todos')
        .update({ 
          title, 
          description, 
          completed,
          user_id
        })
        .eq('id', id)
        .select(`
          *,
          user:users(*)
        `)
        .single()
      
      if (error) throw error
      return data
    },

    deleteTodo: async (_, { id }) => {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return true
    },

    createUser: async (_, { name, email }) => {
      const { data, error } = await supabase
        .from('users')
        .insert([{ name, email }])
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    updateUser: async (_, { id, name, email }) => {
      const { data, error } = await supabase
        .from('users')
        .update({ name, email })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    deleteUser: async (_, { id }) => {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return true
    }
  }
} 