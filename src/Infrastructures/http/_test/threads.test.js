const pool = require("../../database/postgres/pool")
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const container = require("../../container")
const createServer = require("../createServer")

describe("/threads endpoint", () => {
	afterAll(async () => {
		await pool.end()
	})

	beforeEach(async () => {
		await UsersTableTestHelper.addUser({id: "user-123"})
	})

	afterEach(async () => {
		await ThreadsTableTestHelper.cleanTable()
		await UsersTableTestHelper.cleanTable()
	})

	describe("when POST /threads", () => {
		it("should response 201 and persisted thread", async () => {
			// Arrange
			const payload = {
				title: "Test",
				body: "Test",
			}
			const auth = {
				strategy: "forumapi_jwt",
				credentials: { id: "user-123" },
			}
			// eslint-disable-next-line no-undef
			const server = await createServer(container)

			// Action
			const response = await server.inject({
				method: "POST",
				url: "/threads",
				payload,
				auth,
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(201)
			expect(responseJson.status).toEqual("success")
			expect(responseJson.data.addedThread).toBeDefined()
		})

		it("should response 400 when request payload not contain needed property", async () => {
			// Arrange
			const payload = {
				title: "Test",
			}
			const auth = {
				strategy: "forumapi_jwt",
				credentials: { id: "user-123" },
			}
			const server = await createServer(container)

			// Action
			const response = await server.inject({
				method: "POST",
				url: "/threads",
				payload,
				auth,
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(400)
			expect(responseJson.status).toEqual("fail")
			expect(responseJson.message).toEqual("tidak dapat membuat thread karena properti tidak lengkap")
		})

		it("should response 400 when request payload not meet data type specification", async () => {
			// Arrange
			const payload = {
				title: true,
				body: [1],
			}
			const auth = {
				strategy: "forumapi_jwt",
				credentials: { id: "user-123" },
			}
			const server = await createServer(container)

			// Action
			const response = await server.inject({
				method: "POST",
				url: "/threads",
				payload,
				auth,
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(400)
			expect(responseJson.status).toEqual("fail")
			expect(responseJson.message).toEqual("tidak dapat membuat thread karena tipe data tidak sesuai")
		})
	})

	describe("when GET /threads/{threadId}", () => {
		it("should response 200 with detailed thread", async () => {
			// Arrange
			const server = await createServer(container)

			// Action
			await ThreadsTableTestHelper.addThread({id: "thread-123"})
			const response = await server.inject({
				method: "GET",
				url: "/threads/thread-123",
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(200)
			expect(responseJson.status).toEqual("success")
			expect(responseJson.data.thread).toBeDefined()
		})

		it("should response 404 when thread not exist", async () => {
			// Arrange
			const server = await createServer(container)

			// Action
			const response = await server.inject({
				method: "GET",
				url: "/threads/thread-404",
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(404)
			expect(responseJson.status).toEqual("fail")
			expect(responseJson.message).toEqual("thread tidak ditemukan")
		})
	})
})
