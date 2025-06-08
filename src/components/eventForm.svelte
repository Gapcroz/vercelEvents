<script>
  import { createEvent } from '$lib/createEventAPI';
  let modalVisible = false;

  let form = {
    flyer: '',
    title: '',
    category: '',
    customCategory: '',
    description: '',
    url: '',
    city: '',
    region: '',
    country: '',
    start: '',
    end: '',
    timezone: '',
    modality: '',
    cost: '',
    status: 'active',
    responsible: '',
  };

  function submit() {
    const finalCategory = form.category === 'otra' ? form.customCategory : form.category;
    createEvent({ ...form, category: finalCategory });
    modalVisible = false;
  }
</script>

<button on:click={() => modalVisible = true}>➕ Nuevo Evento</button>

{#if modalVisible}
  <div class="w-full fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
    <div class="bg-white p-8 rounded-2xl shadow-2xl max-w-xl w-full relative border border-gray-200">
      <h2 class="text-xl font-bold mb-4">Crear nuevo evento</h2>

      <form on:submit|preventDefault={submit} class="space-y-4">
        <input placeholder="Nombre del evento" bind:value={form.title} class="w-full p-2 border rounded" required />
        <input placeholder="Descripción" bind:value={form.description} class="w-full p-2 border rounded" required />
        <input type="url" placeholder="URL de registro" bind:value={form.url} class="w-full p-2 border rounded" />
        <input placeholder="Ciudad" bind:value={form.city} class="w-full p-2 border rounded" />
        <input placeholder="Estado" bind:value={form.region} class="w-full p-2 border rounded" />
        <input placeholder="País" bind:value={form.country} class="w-full p-2 border rounded" />
        <input type="datetime-local" bind:value={form.start} class="w-full p-2 border rounded" />
        <input type="datetime-local" bind:value={form.end} class="w-full p-2 border rounded" />
        <input placeholder="Zona horaria" bind:value={form.timezone} class="w-full p-2 border rounded" />
        <select bind:value={form.modality} class="w-full p-2 border rounded">
          <option value="">Selecciona modalidad</option>
          <option value="Presencial">Presencial</option>
          <option value="Virtual">Virtual</option>
          <option value="Híbrido">Híbrido</option>
        </select>
        <select bind:value={form.cost} class="w-full p-2 border rounded">
          <option value="">¿Con costo?</option>
          <option value="Gratis">Gratis</option>
          <option value="Con costo">Con costo</option>
        </select>
        <select bind:value={form.category} class="w-full p-2 border rounded">
          <option value="">Categoría</option>
          <option value="conferencia">Conferencia</option>
          <option value="startup weekend">Startup Weekend</option>
          <option value="hackathon">Hackathon</option>
          <option value="otra">Otra...</option>
        </select>
        {#if form.category === 'otra'}
          <input placeholder="Categoría personalizada" bind:value={form.customCategory} class="w-full p-2 border rounded" />
        {/if}

        <input placeholder="Responsable u organización" bind:value={form.responsible} class="w-full p-2 border rounded" />
        <div class="flex justify-end gap-2 mt-4">
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
          <button type="button" on:click={() => modalVisible = false} class="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
{/if}
