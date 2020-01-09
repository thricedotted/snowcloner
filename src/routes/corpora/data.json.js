import corpora from 'corpora-project'

export function get(req, res, next) {
  const categories = JSON.stringify(corpora.getCategories())

	res.writeHead(200, {
		'Content-Type': 'application/json'
  })

  res.end(categories)
}