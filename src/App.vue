<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { locale, t } = useI18n();
const { push } = useRouter();

const changeLanguage = (lang: string) => {
  locale.value = lang;
};
</script>

<template>
  <div>
    <div style="display: flex; align-items: center; justify-content: space-between">
      <div style="display: flex; align-items: center">
        <button
          id="home-btn"
          :disabled="!$route.path.includes('history')"
          :class="$route.path.includes('history') ? 'btn header-btn' : 'btn header-btn-active'"
          @click="push('/')"
        >
          <h2>{{ t('home') }}</h2>
        </button>
        <button
          id="history-btn"
          :disabled="$route.path.includes('history')"
          :class="!$route.path.includes('history') ? 'btn header-btn' : 'btn header-btn-active'"
          @click="push('/history')"
        >
          <h2>{{ t('history') }}</h2>
        </button>
      </div>
      <div>
        <button
          id="en-btn"
          :class="
            locale === 'pt'
              ? 'transl-btn transl-btn-left transl-btn-hover'
              : 'transl-btn transl-btn-left transl-btn-active'
          "
          @click="changeLanguage('en')"
        >
          <v-icon name="fi-gb" scale="1.5" />
        </button>
        <button
          id="pt-btn"
          :class="
            locale === 'en'
              ? 'transl-btn transl-btn-right transl-btn-hover'
              : 'transl-btn transl-btn-right transl-btn-active'
          "
          @click="changeLanguage('pt')"
        >
          <v-icon name="fi-pt" scale="1.5" />
        </button>
      </div>
    </div>
    <div class="grid-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<style>
.btn {
  background-color: transparent;
  outline: none;
  border: none;
  padding: 4px 6px;
  cursor: pointer;
  color: gray;
  transition: all 0.2s ease;
}
.header-btn {
  border-bottom: 2px solid transparent;
  &:hover {
    background-color: gray;
    color: black;
  }
}
.header-btn-active {
  border-bottom: 2px solid gray;
}
.transl-btn {
  border: none;
  outline: unset;
  padding: 2px 14px;
  background-color: transparent;
  border: 2px solid gray;
  transition: all 0.2s ease;
  cursor: pointer;
}
.transl-btn-left {
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}
.transl-btn-right {
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}
.transl-btn-hover:hover {
  background-color: gray;
}
.transl-btn-active {
  background-color: gray;
}
.grid-container {
  padding: 60px 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  column-gap: 14px;
  row-gap: 24px;
  align-content: center;
  justify-content: center;
}
</style>
