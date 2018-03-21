import PaginationNav from 'src/components/PaginationNav.vue'
import sinon from 'sinon'
// import _ from 'lodash'
import { mount } from 'avoriaz'

describe('PaginationNav.vue', () => {
  sinon.stub(PaginationNav, 'mounted').callsFake(() => {})
  const PaginationNavCom = mount(PaginationNav)
  it('component PaginationNav should have class name "pagination-nav"', () => {
    const totalPages = 10
    PaginationNavCom.setProps({
      totalPages
    })
    expect(PaginationNavCom.hasClass('pagination-nav')).to.equal(true)
  })
  it('component paginationNav should contain few block', () => {
    const totalPages = 10
    PaginationNavCom.setProps({
      totalPages
    })
    const prev = PaginationNavCom.find('.pagination-nav__prev')[0]
    const next = PaginationNavCom.find('.pagination-nav__next')[0]
    expect(prev).to.not.be.undefined
    expect(next).to.not.be.undefined
  })
  it('componment should render correct page items', () => {
    const totalPages = 10
    PaginationNavCom.setProps({
      totalPages
    })
    const pages = PaginationNavCom.find('.pagination-nav__page')
    expect(PaginationNavCom.vm.$props.totalPages).to.equal(totalPages)
    expect(pages.length).to.equal(5)
  })
  it('the current index should be which user clicked', () => {
    const totalPages = 10
    PaginationNavCom.setProps({
      totalPages
    })
    const pages = PaginationNavCom.find('.pagination-nav__page')
    pages[4].trigger('click')
    expect(PaginationNavCom.vm.currPage).to.equal(5)
  })
})
