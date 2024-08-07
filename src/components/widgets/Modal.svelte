<script>
  import { closeModal } from "svelte-modals";

  // provided by Modals
  export let isOpen;

  export let title;
  export let message;
</script>

{#if isOpen}
  <div
    role="dialog"
    class="pointer-events-none fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center"
  >
    <div
      class="pointer-events-auto flex min-w-fit flex-col justify-between rounded-md bg-dark-300 p-4"
    >
      <h2 class="text-center">{title}</h2>
      <p class="text-center">{message}</p>
      <div class="mt-8 flex justify-end">
        <button on:click={closeModal}>OK</button>
      </div>
    </div>
  </div>
{/if}
