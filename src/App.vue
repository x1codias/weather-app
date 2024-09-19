<template>
  <div>
    <div style="display: flex; align-items: center; justify-content: space-between">
      <div style="display: flex; align-items: center">
        <button
          :disabled="!$route.path.includes('history')"
          :class="$route.path.includes('history') ? 'btn header-btn' : 'btn header-btn-active'"
          @click="goTo('/')"
        >
          <h2>{{ $t('home') }}</h2>
        </button>
        <button
          :disabled="$route.path.includes('history')"
          :class="!$route.path.includes('history') ? 'btn header-btn' : 'btn header-btn-active'"
          @click="goTo('/history')"
        >
          <h2>{{ $t('history') }}</h2>
        </button>
      </div>
      <div>
        <button
          :class="
            $i18n.locale === 'pt'
              ? 'transl-btn transl-btn-left transl-btn-hover'
              : 'transl-btn transl-btn-left transl-btn-active'
          "
          @click="changeLanguage('en')"
        >
          <v-icon name="fi-gb" scale="1.5" />
        </button>
        <button
          :class="
            $i18n.locale === 'en'
              ? 'transl-btn transl-btn-right transl-btn-hover'
              : 'transl-btn transl-btn-right transl-btn-active'
          "
          @click="changeLanguage('pt')"
        >
          <v-icon name="fi-pt" scale="1.5" />
        </button>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { OhVueIcon } from 'oh-vue-icons';

export default {
  components: {
    'v-icon': OhVueIcon
  },
  methods: {
    changeLanguage(lang: string) {
      this.$i18n.locale = lang;
    },
    goTo(path: string) {
      this.$router.push(path);
    }
  }
};
</script>

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
</style>
