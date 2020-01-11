import corpora from '../../_corpora-project'

export function get(req, res, next) {
  const { directory, subdirectoryOrFile } = req.params

  try {
    const files = corpora.getFiles(`${directory}/${subdirectoryOrFile}`)

    res.writeHead(200, {
      'Content-Type': 'application/json'
    })

    res.end(JSON.stringify(files))
  }

  catch (err) {
    try {
      const data = corpora.getFile(directory, subdirectoryOrFile)

      res.writeHead(200, {
        'Content-Type': 'application/json'
      })

      res.end(JSON.stringify(data))
    }

    catch (err) {
      res.writeHead(404, {
        'Content-Type': 'application/json'
      })

      res.end(JSON.stringify({
        error: `'${directory}/${subdirectory}' not found`
      }))
    }
  }
}