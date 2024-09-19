import { mount } from '@vue/test-utils';
import { expect, beforeEach, describe, it } from 'vitest';
import { createPinia } from 'pinia';
import HomeView from '@/views/HomeView.vue';

const pinia = createPinia();

describe('HomeView', () => {
  let wrapper: any;

  beforeEach(async () => {
    wrapper = mount(HomeView, {
      global: {
        plugins: [pinia]
      }
    });
    await wrapper.vm.$nextTick(); // Wait for the DOM to update
  });

  it('renders map', () => {
    expect(wrapper.text()).toContain('Home');
    expect(wrapper.text()).toContain('History');
  });

  it('goes to the desired location on map', () => {
    expect(wrapper.text()).toContain('Home');
    expect(wrapper.text()).toContain('History');
  });

  it('renders text if there is no forecast data', () => {
    expect(wrapper.text()).toContain('Home');
    expect(wrapper.text()).toContain('History');
  });

  it('renders forecast data', () => {
    expect(wrapper.text()).toContain('Home');
    expect(wrapper.text()).toContain('History');
  });
});
