// adapted from
// https://healeycodes.com/glitch/github/tutorial/javascript/2019/05/06/glitch-to-github-via-webhook.html

import crypto from 'crypto'
import { execSync } from 'child_process'

export function post(req, res, next) {
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
}