import localForage from 'localforage'

import { writable } from 'svelte/store'

import { STORE_KEY } from '$lib/util'

function createSnowcloneStore() {
  const { set, update, subscribe } = writable([])

  const initialize = async () => {
    const snowclones = await localForage.getItem(STORE_KEY)
    if (Array.isArray(snowclones)) {
      set(snowclones)
    }
    else {
      await localForage.setItem(STORE_KEY, [])
    }
  }

  const add = async ({ name, data }) => {
    let updated

    update(arr => {
      updated = [
        ...arr, 
        { name, data, id: Date.now() }
      ]
      return updated
    })

    await localForage.setItem(STORE_KEY, updated)
  }

  const remove = async idx => {
    let updated

    update(arr => {
      updated = [
        ...arr.slice(0, idx), 
        ...arr.slice(idx + 1, arr.length)
      ]
      return updated
    })

    await localForage.setItem(STORE_KEY, updated)
  }

  return {
    subscribe,
    initialize,
    add,
    remove
  }
}

const snowcloneStore = createSnowcloneStore()

export {
  snowcloneStore
}