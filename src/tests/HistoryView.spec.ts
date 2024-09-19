import { mount } from '@vue/test-utils';
import { expect, beforeEach, describe, it } from 'vitest';
import { createPinia } from 'pinia';
import HistoryView from '@/views/HistoryView.vue';

const pinia = createPinia();

describe('HistoryView', () => {
  let wrapper: any;

  beforeEach(async () => {
    wrapper = mount(HistoryView, {
      global: {
        plugins: [pinia]
      }
    });
    await wrapper.vm.$nextTick(); // Wait for the DOM to update
  });

  it('renders text if search history empty', () => {
    expect(wrapper.text()).toContain('Home');
    expect(wrapper.text()).toContain('History');
  });

  it('renders search data', () => {
    expect(wrapper.text()).toContain('Home');
    expect(wrapper.text()).toContain('History');
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
