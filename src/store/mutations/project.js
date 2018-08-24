import Vue from 'vue'

const SET_PROJECTS_LIST = (state, { projectsList, }) => {
  state['projectsList'] = projectsList
}

const SET_PUBLIC_PROJECT_SINGLE = (state, { item, }) => {
  state['publicProjectSingle'] = item
}

const SET_PUBLIC_PROJECTS = (state, { status, publicProjects, }) => {
  Vue.set(state['publicProjects'], status, publicProjects)
}

export {
  SET_PROJECTS_LIST,
  SET_PUBLIC_PROJECT_SINGLE,
  SET_PUBLIC_PROJECTS,
}
