import LoginPanel from 'src/components/LoginPanel.vue'
import Vue from 'vue'

describe('List.vue', () => {
  it('Login Panel should display facebook/g+ btns', () => {
    const Constructor = Vue.extend(LoginPanel);
    const ListComponent = new Constructor().$mount();
    expect(ListComponent.$el.textContent).to.contain('Facebook Login');
  })
})