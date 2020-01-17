import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';

import bodyParser from 'body-parser'
import crypto from 'crypto'
import { execSync } from 'child_process'

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const app = polka()

app.use(
	bodyParser.json(),
	compression({ threshold: 0 }),
	sirv('static', { dev }),
	sapper.middleware()
)

// adapted from
// https://healeycodes.com/glitch/github/tutorial/javascript/2019/05/06/glitch-to-github-via-webhook.html
app.post('/git', (req, res) => {
	const hmac = crypto.createHmac('sha1', process.env.SECRET)
	const sig = 'sha1=' + hmac.update(JSON.stringify(req.body)).digest('hex')

	if (req.headers['x-github-event'] === 'push' 
			&& crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(req.headers['x-hub-signature']))) {
		res.sendStatus(200)

		const commands = [
			'git fetch origin main',
			'git reset --hard origin/main',
			'git pull origin main --force',
			'npm install',
			'npm run build',
			'refresh'
		]

		for (const cmd of commands) {
			console.log(execSync(cmd).toString())
		}

		console.log('updated with origin/main!')
		return
	}

	else {
		console.log('webhook signature incorrect!')
		return res.sendStatus(403)
	}
})

app.listen(PORT, err => {
		if (err) console.log('error', err);
	});
