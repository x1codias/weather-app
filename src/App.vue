<template>
  <div>
    <div style="display: flex; align-items: center; justify-content: space-between">
      <div>
        <button @click="goTo('/')">{{ $t('weather') }}</button>
        <button @click="goTo('/history')">{{ $t('history') }}</button>
      </div>
      <div>
        <button @click="changeLanguage('en')">English</button>
        <button @click="changeLanguage('pt')">Português</button>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
export default {
  methods: {
    changeLanguage(lang: string) {
      this.$i18n.locale = lang
    },
    goTo(path: string) {
      this.$router.push(path)
    }
  }
}
</script>
