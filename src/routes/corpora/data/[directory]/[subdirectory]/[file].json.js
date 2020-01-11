import corpora from '../../../_corpora-project'

export function get(req, res, next) {
  const { directory, subdirectory, file } = req.params

  try {
    const data = corpora.getFile(`${directory}/${subdirectory}`, file)

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