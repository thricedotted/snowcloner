import corpora from 'corpora-project'

export function get(req, res, next) {
  const { directory } = req.params

  try {
    const files = corpora.getFiles(directory)

    res.writeHead(200, {
      'Content-Type': 'application/json'
    })

    res.end(JSON.stringify(files))
  }

  catch (err) {
    res.writeHead(404, {
      'Content-Type': 'application/json'
    })

    res.end(JSON.stringify({
      error: `Category '${directory}' not found`
    }))
  }
}