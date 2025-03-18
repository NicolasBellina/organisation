import Fastify from 'fastify'
import cors from '@fastify/cors'
import { mercurius } from 'mercurius'
import { schema } from './schema'
import { resolvers } from './resolvers'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const app = Fastify()

// Configuration Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

// Test de connexion à Supabase
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('todos').select('*')
    if (error) throw error
    console.log('✅ Backend connecté à Supabase !')
  } catch (error) {
    console.error('❌ Erreur de connexion à Supabase:', error.message)
  }
}

// Configuration GraphQL
app.register(mercurius, {
  schema,
  resolvers,
  graphiql: true
})

// Configuration CORS
app.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
})

const start = async () => {
  try {
    await app.listen({ port: 4000 })
    console.log('🚀 Serveur backend démarré sur http://localhost:4000')
    await testConnection()
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start() 