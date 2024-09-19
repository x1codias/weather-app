import App from '@/App.vue';
import { flushPromises, mount } from '@vue/test-utils';
import { expect, beforeEach, describe, it } from 'vitest';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import { i18n } from '@/translations/i18n';

// Mock routes for testing
const routes = [
  { path: '/', component: { template: '<div>Home Page</div>' } },
  { path: '/history', component: { template: '<div>History Page</div>' } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const pinia = createPinia();

describe('App', () => {
  let wrapper: any;

  beforeEach(async () => {
    wrapper = mount(App, {
      global: {
        plugins: [i18n, router, pinia]
      }
    });
    await router.isReady();
    router.push('/');
    await wrapper.vm.$nextTick(); // Wait for the DOM to update
  });

  it('renders the correct initial language (English)', () => {
    expect(wrapper.text()).toContain('Home');
    expect(wrapper.text()).toContain('History');
  });

  it('navigates to the home route when Home button is clicked', async () => {
    await wrapper.find('#home-btn').trigger('click');
    expect(router.currentRoute.value.path).toBe('/');
  });

  it('navigates to the history route when History button is clicked', async () => {
    await wrapper.find('#history-btn').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.path).toBe('/history');
  });

  it('changes the language to english when english flag icon is clicked', async () => {
    await wrapper.find('#en-btn').trigger('click');
    expect(i18n.global.locale).toBe('en');
  });

  it('changes the langauge to portuguese when portuguese flag icon is clicked', async () => {
    await wrapper.find('#pt-btn').trigger('click');
    expect(i18n.global.locale).toBe('pt');
  });
});
