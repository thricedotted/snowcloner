export default class Corpus {

  constructor({
    rawData,
    filePath,
    path
  }) {
    this.rawData = rawData
    this.filePath = filePath
    this.path = path
    this._data = []
  }



  get data() {
    return this._data
  }

  get description() {
    return this._data.description || this._data.Description
  }

  get source() {
    return this._data.source

  }

  get placeholder() {
    const sel = this.path.filter(x => x.selected && x.selected !== 'all')
    return (sel.length > 0 ? sel[0] : this.filePath.slice(-1)[0]).selected
  }

  static fromPaths(filePath, dataPath) {

  }
}