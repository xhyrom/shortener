<script>
  import { openModal } from 'svelte-modals'
  import Modal from './Modal.svelte'
  export let name;

  function handleClick() {
    openModal(Modal, { title: 'Alert', message: 'create link' })
  }
</script>

<button
  id=""
  class="broder-1 flex w-48 items-center justify-center gap-x-3 rounded-lg border border-[#fbc11a] bg-[#735d1d]/50 px-10 py-3 text-lg font-semibold text-white transition-colors hover:bg-[#735d1d]"
  on:click={handleClick}
>
  {name}
</button>
