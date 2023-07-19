<script>
  import { closeModal } from 'svelte-modals'

  // provided by Modals
  export let isOpen

  export let title
  export let message
</script>

{#if isOpen}
<div role="dialog" class="top-0 bottom-0 right-0 left-0 fixed flex justify-center items-center pointer-events-none">
  <div class="min-w-fit rounded-md p-4 flex flex-col justify-between pointer-events-auto bg-dark-300">
    <h2 class="text-center">{title}</h2>
    <p class="text-center">{message}</p>
    <div class="mt-8 flex justify-end">
      <button on:click="{closeModal}">OK</button>
    </div>
  </div>
</div>
{/if}