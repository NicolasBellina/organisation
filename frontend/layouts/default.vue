<template>
    <Header>
      <nav class="navigation">
        <div class="nav-links">
          <NuxtLink to="/">Accueil</NuxtLink>
          <NuxtLink to="/projets">Projets</NuxtLink>
          <NuxtLink to="/calendrier">Calendrier</NuxtLink>
          <NuxtLink to="/taches">Tâches</NuxtLink>
        </div>
        <div class="search-bar">
          <input type="text" placeholder="Rechercher..." v-model="searchQuery" />
        </div>
      </nav>
    </Header>
    <main>
      <slot />
    </main>
</template>
