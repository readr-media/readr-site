import Vue from 'vue'

const SET_PROJECTS_LIST = (state, { projectsList }) => {
  state['projectsList'] = projectsList
}

const SET_PUBLIC_PROJECT_SINGLE = (state, { item }) => {
  state['publicProjectSingle'] = item
}

const SET_PUBLIC_PROJECTS = (state, { status, publicProjects }) => {
  Vue.set(state['publicProjects'], status, publicProjects)
}

const SET_PUBLIC_PROJECT_CONTENTS = (state, items) => {
  state['publicProjectContents'] = items
}

const SET_PROJECT_CONTENTS = (state, items) => {
  state['projectContents'] = items
}

const UPDATE_PUBLIC_PROJECT_CONTENTS = (state, items = []) => {
  state['publicProjectContents'].push(...items)
}

const UPDATE_PROJECT_CONTENTS = (state, items = []) => {
  state['projectContents'].push(...items)
}

export {
  SET_PROJECTS_LIST,
  SET_PUBLIC_PROJECT_SINGLE,
  SET_PUBLIC_PROJECTS,
  SET_PUBLIC_PROJECT_CONTENTS,
  SET_PROJECT_CONTENTS,
  UPDATE_PUBLIC_PROJECT_CONTENTS,
  UPDATE_PROJECT_CONTENTS
}
