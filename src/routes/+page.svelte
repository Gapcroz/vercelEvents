<script>
  import { onMount } from 'svelte';
  import { ENDPOINTS } from '$lib/config';
  import { createEvent } from '$lib/createEventAPI.js';
  import EventForm from '$components/EventForm.svelte';




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
  let categories = [];
  let mostrarModal = false;

  // Evento final filtrado (reactivo)
  $: filteredEvents = events.filter(event => {
    const titulo = event.title?.toLowerCase() || '';
    const ciudad = event.city?.toLowerCase() || '';
    const categoria = event.category || '';
    const search = searchTerm.trim().toLowerCase();
    const ciudadFiltro = selectedCity.trim().toLowerCase();

    const coincideTexto = search === '' || titulo.includes(search);
    const coincideCiudad = ciudadFiltro === '' || ciudad.includes(ciudadFiltro);
    const coincideCategoria = selectedCategory === '' || categoria === selectedCategory;

    const coincideFechaInicio = !startDate || new Date(event.start) >= new Date(startDate);
    const coincideFechaFin = !endDate || new Date(event.end) <= new Date(endDate);

    return (
      coincideTexto &&
      coincideCiudad &&
      coincideCategoria &&
      coincideFechaInicio &&
      coincideFechaFin
    );
  });

  // Combina eventos sin duplicar (usando phq_id o _id como identificador único)
  function combinarSinDuplicados(listaA, listaB) {
    const idsVistos = new Set(listaA.map(e => e.phq_id || e._id));
    const nuevos = listaB.filter(e => !idsVistos.has(e.phq_id || e._id));
    return [...listaA, ...nuevos];
  }

  async function fetchEvents() {
  try {
    loading = true;
    error = null;

    const params = new URLSearchParams();
    if (searchTerm) params.append('q', searchTerm);
    if (selectedCategory) params.append('category', selectedCategory);
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);
    if (userLat && userLng) {
      params.append('lat', userLat);
      params.append('lng', userLng);
    }

    const response = await fetch(`${ENDPOINTS.EVENTS}?${params.toString()}`);
    if (!response.ok) throw new Error('Error al cargar los eventos');

    const nuevosEventos = await response.json();
    events = nuevosEventos;

    sessionStorage.setItem("cachedEvents", JSON.stringify(nuevosEventos));
    console.log("✅ Eventos guardados en sessionStorage");
  } catch (e) {
    error = e.message;
  } finally {
    loading = false;
  }
}


  onMount(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          userLat = pos.coords.latitude;
          userLng = pos.coords.longitude;
          await fetchEvents(); // ✅ call once
        },
        async (err) => {
          console.warn("⚠️ No se pudo obtener ubicación del usuario:", err.message);
          await fetchEvents(); // ✅ Fallback without location
        }
      );
    } else {
      // No se soporta geolocalización
      fetchEvents(); // ✅ Llamada única sin ubicación
    }

    // Carga categorías (esto no cambia)
    (async () => {
      try {
        const res = await fetch(ENDPOINTS.CATEGORIES);
        if (res.ok) {
          categories = await res.json();
        }
      } catch (err) {
        console.error("❌ Error cargando categorías:", err);
      }
    })();
  });

</script>


<!-- content -->
<main class="max-w-screen-xl mx-auto p-8">
  <h1 class="text-center text-3xl text-emerald-800 mb-10 pb-4 border-b border-emerald-200 bg-red-50">
    Eventos de Emprendimiento
  </h1>

  <div class="flex flex-wrap gap-4 mb-8 items-center">
    <input
      type="text"
      bind:value={searchTerm}
      placeholder="Buscar eventos..."
      class="p-2 border border-gray-300 rounded w-full sm:w-auto"
    />

    <select bind:value={selectedCategory} class="p-2 border border-gray-300 rounded">
      <option value="">Todas las categorías</option>
      {#each categories as category}
        <option value={category}>{category}</option>
      {/each}
    </select>

    <input
      type="text"
      bind:value={selectedCity}
      placeholder="Ciudad"
      class="p-2 border border-gray-300 rounded"
    />

    <input type="date" bind:value={startDate} class="p-2 border border-gray-300 rounded" />
    <input type="date" bind:value={endDate} class="p-2 border border-gray-300 rounded" />

    <button
      class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      on:click={fetchEvents}
    >
      Buscar
    </button>
    <button
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
      on:click={() => {
        sessionStorage.removeItem("cachedEvents");
        fetchEvents();
      }}
    >
      🔄 Refrescar eventos
    </button>

    <!-- Botón para abrir el modal -->
    <button
    class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800"
    on:click={() => (mostrarModal = true)}
    >
    ➕ Agregar nuevo evento
    </button>

    <!-- Modal -->
    {#if mostrarModal}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
      <div class="bg-white p-6 rounded shadow-lg max-w-lg w-full relative">
        <button
          class="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl font-bold"
          on:click={() => (mostrarModal = false)}
        >
          ✖
        </button>
        <EventForm on:close={() => (mostrarModal = false)} />
      </div>
    </div>
    {/if}
  </div>

  {#if loading}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each Array(15) as _, i}
        <div class="animate-pulse p-4 border rounded-lg bg-white shadow" key={i}>
          <div class="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      {/each}
    </div>
  {:else if error}
    <div class="text-center text-red-600">{error}</div>
  {:else if filteredEvents.length === 0}
    <div class="text-center text-gray-500">No se encontraron eventos</div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredEvents as event}
        <div class="border rounded-lg p-4 bg-white shadow">
          <h2 class="text-xl font-semibold mb-2">{event.title}</h2>
          <p class="text-sm text-gray-700 mb-2">{event.description}</p>
          <div class="text-sm space-y-1">
            <p><strong>Inicio:</strong>
              {event.source === 'eventbrite'
                ? new Date(event.start).toLocaleDateString()
                : new Date(event.start).toLocaleString()}
            </p>
            {#if event.source !== 'eventbrite'}
              <p><strong>Fin:</strong> {new Date(event.end).toLocaleString()}</p>
            {/if}
            <p><strong>Zona horaria:</strong> {event.timezone}</p>
            <p><strong>Ubicación:</strong> {event.city || 'Ciudad desconocida'}, {event.region || 'Estado'}, {event.country_name || 'País'}</p>
            <p><strong>Categoría:</strong> {event.category || 'N/A'}</p>
            <p><strong>Estado:</strong> {event.state || 'Desconocido'}</p>
            <p><strong>Fuente:</strong> {event.source}</p>
            {#if event.source === 'eventbrite' && event.url}
              <p>
                <strong>Enlace:</strong>
                <a href={event.url} target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">
                  Ver en Eventbrite
                </a>
              </p>
            {/if}

          </div>
        </div>
      {/each}
    </div>
  {/if}
</main>