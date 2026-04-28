<template>
  <div class=" absolute right-4 top-4 z-50">
    <button
      type="button"
      class="dev-toggle btn-sketch"
      :class="settingsStore.devModeEnabled ? 'btn-sketch--dev' : 'btn-sketch--dev-off'"
      @click="settingsStore.toggleDevMode()"
    >
      <span class="btn-sketch__inner font-faberge">
        <span class="btn-sketch__switch-thumb" aria-hidden="true" />
        Dev
      </span>
    </button>
  </div>
</template>
<script setup lang="ts">
  import { useSettingsStore } from '@/stores'
  const settingsStore = useSettingsStore()
</script>
<style scoped>
  @import url("https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap");
  .btn-sketch {
    position: relative;
    font: normal 22px/25px "Patrick Hand", sans-serif;
    text-transform: uppercase;
    color: #000;
    text-decoration: none;
    padding-bottom: 3px;
    border-radius: 5px;
    box-shadow: 0 2px 0 #000;
    transition: box-shadow 0.2s ease-out, background 0.25s ease-out;
    background: linear-gradient(
      45deg,
      rgb(var(--color-button-default) / 1) 20%,
      transparent 20%,
      transparent 50%,
      rgb(var(--color-button-default) / 1) 50%,
      rgb(var(--color-button-default) / 1) 70%,
      transparent 70%
    );
    background-size: 5px 5px;
    border: none;
    cursor: pointer;
    margin: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .btn-sketch:focus {
    outline: none;
  }
  .btn-sketch:hover {
    box-shadow: 0 2px 0 #000, 0 2px 0 2px #f03755;
  }
  .btn-sketch--dev {
    background: linear-gradient(
      45deg,
      rgb(var(--color-button-dev) / 1) 20%,
      transparent 20%,
      transparent 50%,
      rgb(var(--color-button-dev) / 1) 50%,
      rgb(var(--color-button-dev) / 1) 70%,
      transparent 70%
    );
    background-size: 5px 5px;
    box-shadow: 0 2px 0 rgb(var(--color-button-dev));
  }
  .btn-sketch--dev:hover {
    box-shadow: 0 2px 0 rgb(var(--color-button-dev)), 0 2px 0 2px rgb(var(--color-button-hover-dev));
  }
  .btn-sketch--dev .btn-sketch__inner {
    background: rgb(var(--color-button-bg-dev));
    border-color: rgb(var(--color-button-dev));
    color: rgb(var(--color-button-dev));
  }
  .btn-sketch--dev-off {
    background: linear-gradient(
      45deg,
      rgb(var(--color-button-default) / 1) 20%,
      transparent 20%,
      transparent 50%,
      rgb(var(--color-button-default) / 1) 50%,
      rgb(var(--color-button-default) / 1) 70%,
      transparent 70%
    );
    background-size: 5px 5px;
    box-shadow: 0 2px 0 rgb(var(--color-button-default));
  }
  .btn-sketch--dev-off:hover {
    box-shadow: 0 2px 0 rgb(var(--color-button-default)), 0 2px 0 2px rgb(var(--color-button-hover-default));
  }
  .btn-sketch--dev-off .btn-sketch__inner {
    background: rgb(var(--color-surface-light));
    border-color: rgb(var(--color-button-default));
    color: rgb(var(--color-text-muted));
  }
  .btn-sketch__inner {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 5px 10px;
    padding-left: 30px;
    border-radius: 5px;
    border: 2px solid #000;
    min-height: 25px;
    font-size: 0.65em;
    line-height: 1.2;
    transition: padding 0.3s ease-out, background 0.25s ease-out, border-color 0.25s ease-out, color 0.25s ease-out;
  }
  .btn-sketch__switch-thumb {
    position: absolute;
    left: 3px;
    top: 50%;
    transform: translateY(-55%);
    width: 22px;
    height: 22px;
    border-radius: 4px;
    border: 2px solid #000;
    background: rgb(var(--color-surface-light));
    box-shadow: 0 1px 0 #000;
    transition: left 0.3s ease-out, background 0.25s ease-out, border-color 0.25s ease-out, box-shadow 0.25s ease-out;
    pointer-events: none;
  }
  .btn-sketch--dev .btn-sketch__inner {
    padding-left: 10px;
    padding-right: 30px;
  }
  .btn-sketch--dev .btn-sketch__switch-thumb {
    left: calc(100% - 25px);
    right: auto;
    background: rgb(var(--color-button-bg-dev));
    border-color: rgb(var(--color-button-dev));
    box-shadow: 0 1px 0 rgb(var(--color-button-dev));
  }
</style>
