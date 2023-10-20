const createServer = require("../createServer")
const Jwt = require("@hapi/jwt")

describe("HTTP server", () => {
	it("should response 404 when request unregistered route", async () => {
		// Arrange
		const server = await createServer({})

		// Action
		const response = await server.inject({
			method: "GET",
			url: "/unregisteredRoute",
		})

		// Assert
		expect(response.statusCode).toEqual(404)
	})

	it("should handle server error correctly", async () => {
		// Arrange
		const requestPayload = {
			username: "dicoding",
			fullname: "Dicoding Indonesia",
			password: "super_secret",
		}
		const server = await createServer({}) // fake injection

		// Action
		const response = await server.inject({
			method: "POST",
			url: "/users",
			payload: requestPayload,
		})

		// Assert
		const responseJson = JSON.parse(response.payload)
		expect(response.statusCode).toEqual(500)
		expect(responseJson.status).toEqual("error")
		expect(responseJson.message).toEqual("terjadi kegagalan pada server kami")
	})

	it("should decode jwt token", async () => {
		// Arrange
		const token = Jwt.token.generate({id: "user-123"}, process.env.ACCESS_TOKEN_KEY)
		const server = await createServer({})

		// Action
		server.route({
			method: "GET",
			path: "/jwt",
			handler: (request) => {
				return request.auth.credentials
			},
			options: {
				auth: "forumapi_jwt",
			}
		})
		const response = await server.inject({
			method: "GET",
			url: "/jwt",
			headers: { Authorization: `Bearer ${token}` },
		})

		// Assert
		const responseJson = JSON.parse(response.payload)
		expect(responseJson.id).toEqual("user-123")
	})
})
