<script>
  import { onMount } from 'svelte';
  import { ENDPOINTS } from '$lib/config';
  
  let events = [];
  let loading = true;
  let error = null;
  let searchTerm = '';
  let selectedCategory = '';
  let selectedCity = '';
  let startDate = '';
  let endDate = '';
  let userLat = null;
  let userLng = null;
  
  const categories = ['conferences', 'expos', 'community', 'academic'];
  
  async function fetchEvents() {
    try {
      loading = true;
      error = null;
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedCity) params.append('city', selectedCity);
      if (startDate) params.append('start', startDate);
      if (endDate) params.append('end', endDate);
      if (userLat && userLng) {
        params.append('lat', userLat);
        params.append('lng', userLng);
      }
      
      const response = await fetch(`${ENDPOINTS.EVENTS}?${params.toString()}`);
      if (!response.ok) throw new Error('Error al cargar los eventos');
      
      events = await response.json();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }
  
  onMount(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLat = position.coords.latitude;
        userLng = position.coords.longitude;
        fetchEvents(); // ✅ Aquí sí se cargan los eventos con coordenadas
      },
      (error) => {
        console.warn("Usuario rechazó compartir ubicación:", error);
        fetchEvents(); // Aun si no acepta, mostramos algo
      }
    );
  } else {
    fetchEvents(); // Navegador no soporta geolocalización
    }
  });
</script>

<!-- content -->
<main class="container">
  <h1 class="text-center text-3xl border text-emerald-800 mb-10 pb-10 bg-red-50">Eventos de Emprendimiento</h1>
  <div class="filters">
    <input 
      type="text" 
      bind:value={searchTerm} 
      placeholder="Buscar eventos..."
      class="search-input"
    />
    
    <select bind:value={selectedCategory} class="filter-select">
      <option value="">Todas las categorías</option>
      {#each categories as category}
        <option value={category}>{category}</option>
      {/each}
    </select>
    
    <input 
      type="text" 
      bind:value={selectedCity} 
      placeholder="Ciudad"
      class="filter-input"
    />
    
    <div class="date-filters">
      <input 
        type="date" 
        bind:value={startDate} 
        class="date-input"
      />
      <input 
        type="date" 
        bind:value={endDate} 
        class="date-input"
      />
    </div>
    <button class="search-btn" on:click={fetchEvents}>Buscar</button>
  </div>
  
  {#if loading}
    <div class="loader">Cargando eventos...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else if events.length === 0}
    <div class="no-events">No se encontraron eventos</div>
  {:else}
    <div class="events-grid">
      {#each events as event}
      <div class="event-card">
        <h2>{event.title}</h2>
        <p class="description">{event.description}</p>
        <div class="event-details">
          <p><strong>Fecha inicio:</strong> {event.start ? new Date(event.start).toLocaleString() : 'Sin especificar'}</p>
          <p><strong>Fecha fin:</strong> {event.end ? new Date(event.end).toLocaleString() : 'Sin especificar'}</p>
          <p><strong>Zona horaria:</strong> {event.timezone || 'Sin especificar'}</p>
          <p><strong>Ubicación:</strong>
            {#if event.city || event.region || event.country_name}
              {event.city || 'Ciudad desconocida'},
              {event.region || 'Estado'}, 
              {event.country_name || 'País'}
            {:else}
              Coordenadas: {event.location ? `${event.location[1]}, ${event.location[0]}` : 'Sin datos'}
            {/if}
          </p>
          <p><strong>Categoría:</strong> {event.category || 'Sin especificar'}</p>
          <p><strong>Estado:</strong> {event.state || 'Desconocido'}</p>
        </div>
      </div>
      
      {/each}
    </div>
  {/if}
</main>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    align-items: center;
  }
  
  .search-input,
  .filter-select,
  .filter-input,
  .date-input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .search-btn {
    padding: 0.5rem 1.2rem;
    background: #222;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
  }
  .search-btn:hover {
    background: #444;
  }
  
  .date-filters {
    display: flex;
    gap: 0.5rem;
  }
  
  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .event-card {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 1rem;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .event-card h2 {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
  }
  
  .description {
    color: #666;
    margin-bottom: 1rem;
  }
  
  .event-details {
    font-size: 0.9rem;
  }
  
  .ranks {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
  }
  
  .rank {
    background: #f0f0f0;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
  }
  
  .loader,
  .error,
  .no-events {
    text-align: center;
    padding: 2rem;
    font-size: 1.2rem;
  }
  
  .error {
    color: #dc2626;
  }
</style>
