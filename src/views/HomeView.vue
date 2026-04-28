<template>
  <div class="home flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
    <section class="mx-auto max-w-4xl text-center flex flex-col items-center">
      <h1 class="mb-12 ье-16 text-8xl font-bold text-text font-rampart tracking-tight-negative title">
        <span
          v-for="(char, index) in titleText"
          :key="index"
          class="letter"
        >
          {{ char === ' ' ? '\u00A0' : char }}
        </span>
      </h1>
      <p class="subtitle mb-16 text-md text-text-muted font-chicoree font-thin text-shadow-md max-w-md">
        <TextWaveBackAndForth :text="subtitleRaw" />
      </p>
      <div class="flex flex-col items-center gap-8">
        <router-link to="/setup">
          <AppButton variant="giant">
            Начать игру
          </AppButton>
        </router-link>
        <router-link to="/packs">
          <AppButton variant="secondary">
            Редактор вопросов и пакетов
          </AppButton>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import AppButton from '@/components/ui/AppButton.vue'
  import TextWaveBackAndForth from '@/components/ui/TextWaveBackAndForth.vue'

  const titleText = 'Твоя  игра'.split('')
  const subtitleRaw = 'Браузерная интеллектуальная игра в духе телевикторин'
</script>

<style>
  .title {
    text-shadow: 8px 8px 20px #00000031;
    cursor: default;
    display: inline-block;
  }

  .title .letter {
    display: inline-block;
    transition: transform 0.3s ease;
  }

  .title .letter:hover {
    transform: translateY(-20px);
  }

  .subtitle {
    display: inline-block;
  }
</style>