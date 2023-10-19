const Hapi = require("@hapi/hapi")
const ClientError = require("../../Commons/exceptions/ClientError")
const DomainErrorTranslator = require("../../Commons/exceptions/DomainErrorTranslator")
const users = require("../../Interfaces/http/api/users")
const threads = require("../../Interfaces/http/api/threads")
const comments = require("../../Interfaces/http/api/comments")
const authentications = require("../../Interfaces/http/api/authentications")
const Jwt = require("@hapi/jwt")

const createServer = async (container) => {
	const server = Hapi.server({
		host: process.env.HOST,
		port: process.env.PORT,
	})

	await server.register([
		{
			plugin: Jwt,
		},
	])
	
	server.auth.strategy("forumapi_jwt", "jwt", {
		keys: process.env.ACCESS_TOKEN_KEY,
		verify: {
			aud: false,
			iss: false,
			sub: false,
			maxAgeSec: 1800,
		},
		validate: (artifacts) => ({
			isValid: true,
			credentials: { id: artifacts.decoded.payload.id },
		}),
	})

	await server.register([
		{
			plugin: users,
			options: { container },
		},
		{
			plugin: authentications,
			options: { container },
		},
		{
			plugin: threads,
			options: { container }
		},
		{
			plugin: comments,
			options: { container }
		},
	])

	server.ext("onPreResponse", (request, h) => {
		const { response } = request

		if (response instanceof Error) {
			// bila response tersebut error, tangani sesuai kebutuhan
			const translatedError = DomainErrorTranslator.translate(response)

			// user defined
			if (translatedError instanceof ClientError) {
				const newResponse = h.response({
					status: "fail",
					message: translatedError.message,
				})
				newResponse.code(translatedError.statusCode)
				return newResponse
			}

			// other client errors
			if (!translatedError.isServer) {
				return h.continue
			}

			// server errors
			const newResponse = h.response({
				status: "error",
				message: "terjadi kegagalan pada server kami",
			})
			newResponse.code(500)
			return newResponse
		}

		// default
		return h.continue
	})

	return server
}

module.exports = createServer
