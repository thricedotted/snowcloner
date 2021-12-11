export default class Corpus {

  constructor({
    rawData,
    filePath,
    path = []
  } = {}) {
    this.rawData = rawData
    this.filePath = filePath
    this.path = path
    this._data = []

    this.updateData()
  }

  updatePath(p) {
    this.path = p
    this.updateData()
    return this.path
  }

  _processObj(d, pathIdx) {
    let data = d

    const dataKeys = Corpus.filterDataKeys(d)

    const entries = Object.entries(d).filter(([k, v]) => dataKeys.includes(k))

    const childTypes = new Set(entries.map(([k, v]) => Array.isArray(v) ? 'array' : typeof v))
    // const grandchildTypes = new Set(entries.flatMap(([k, v]) => v).map(v => Array.isArray(v) ? 'array' : typeof v))

    // console.log(childTypes, grandchildTypes)

    let sharedStructure = false

    if (childTypes.size === 1 && childTypes.has('object')) {
      const keys = entries.map(([k, v]) => Object.keys(v))

      for (let i = 1; i < keys.length; i++) {
        const keyset = keys[i]
        const prevKeyset = keys[i-1]
        const [ longerKeyset, shorterKeyset ] = keyset.length > prevKeyset.length 
                                                ? [ keyset, prevKeyset ] : [ prevKeyset, keyset ]

        sharedStructure = true
        for (let k of shorterKeyset) {
          if (!longerKeyset.includes(k)) {
            sharedStructure = false
            break
          }
        }

        if (!sharedStructure) {
          break
        }
      }
    }

    // console.log(sharedStructure, grandchildTypes)

    if (sharedStructure || (this.path[pathIdx + 1] && this.path[pathIdx + 1].name === 'filter')) {
      data = entries.reduce((arr, [id, etc]) => {
        if (typeof etc === 'object' && !Array.isArray(etc)) {
          return [...arr, { id, ...etc }]
        }
        else {
          return [...arr, { id, data: etc }]
        }
      }, [])
    }
    // else if (grandchildTypes.size == 1 && grandchildTypes.has('string')) {
    //   console.log('ughhh!!!')
    // }

    return data
  }

  updateData() {
    let d = this.rawData

    if (this.path.length > 0 && this.path[0].name === 'filter') {
      d = this._processObj(d, -1)
    }

    this.path.forEach(({ name, selected }, i) => {
      if (name === 'key' && selected) {
        d = d[selected]
      }

      else if (name === 'filter' && selected && selected !== 'all') {
        d = d.flatMap(x => x[selected]).filter(x => x)
      }

      // postprocess non-array data
      if (!Array.isArray(d)) {
        d = this._processObj(d, i)
      }
    })

    while (!Array.isArray(d) && typeof d === 'object') {
      const dataKeys = Corpus.filterDataKeys(d)

      if (dataKeys.length === 1) {
        this.path = [...this.path, {
          name: 'key',
          options: dataKeys,
          selected: dataKeys[0]
        }]

        d = d[dataKeys[0]]
      }

      else if (dataKeys.length > 1) {
        const data = this._processObj(d)

        if (data != d) {
          d = data
        }

        else {
          this.path = [...this.path, {
            name: 'key',
            options: dataKeys,
            selected: '',
          }]

          break
        }
      }

      else {
        // this is some weird empty object. let's heck out of here.
        d = ['(empty data)']
      }
    }

    // update path from data 
    if (Array.isArray(d)) {

      const item = d[0]
      const keys = [...new Set(Object.values(d).flatMap(v => typeof v === 'object' ? Object.keys(v) : []))]

      const lastPicker = this.path.length > 0 ? this.path.slice(-1)[0] : {}

      if (lastPicker.name === 'filter' && lastPicker.options && lastPicker.options.length == 0) {
        this.path[this.path.length - 1] = {
          name: 'filter',
          options: keys,
          selected: 'all',
        }
      }

      else if (!Array.isArray(item) && typeof item === 'object' && lastPicker.selected !== 'all') {
        this.path = [...this.path, {
          name: 'filter',
          options: keys,
          selected: 'all'
        }]
      }

    }

    this._data = d
  }

  get data() {
    return this._data || []
  }

  get description() {
    return this.rawData.description || this.rawData.Description
  }

  get source() {
    return this.rawData.source
  }

  get placeholder() {
    const sel = this.path.filter(x => x.selected && x.selected !== 'all')
    return (sel.length > 0 ? sel[0] : this.filePath.slice(-1)[0]).selected
  }

  static filterDataKeys(data) {
    return Object.keys(data).filter(k => {
      return ['source', 'sources', 'description', 'license'].every(n => k.toLowerCase() !== n)
    })
  }
}