<template>
  <div style="font-family: sans-serif; text-align: center; padding: 2rem;">
    <h1>⚡ Vibe Code Editor</h1>
    <p>Vue.js starter template</p>
    <button @click="count++" style="
      padding: 0.5rem 1.5rem;
      font-size: 1rem;
      border-radius: 8px;
      border: none;
      background: #E93F3F;
      color: white;
      cursor: pointer;
      margin-top: 1rem;
    ">
      Count is {{ count }}
    </button>
    <p style="margin-top: 1rem; color: #888;">
      Edit <code>src/App.vue</code> and save to see changes
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>
