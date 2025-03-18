export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const API_URL = 'http://localhost:4000/graphql'

  const graphqlRequest = async (query: string, variables = {}) => {
    try {
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
      
      if (!response.ok) {
        throw new Error('Erreur réseau')
      }

      const result = await response.json()
      
      if (result.errors) {
        throw new Error(result.errors[0].message)
      }
      
      return result
    } catch (e) {
      console.error('Erreur GraphQL:', e)
      throw e
    }
  }

  return {
    provide: {
      graphql: graphqlRequest
    }
  }
}) 