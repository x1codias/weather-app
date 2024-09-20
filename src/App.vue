<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import './styles.css';

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
