const pool = require("../../database/postgres/pool")
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper")
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper")
const container = require("../../container")
const createServer = require("../createServer")

describe("/replies endpoint", () => {
	afterAll(async () => {
		await pool.end()
	})

	beforeEach(async () => {
		await UsersTableTestHelper.addUser({id: "user-123"})
		await ThreadsTableTestHelper.addThread({id: "thread-123", owner: "user-123"})
		await CommentsTableTestHelper.addComment({id: "comment-123", owner: "user-123"})
	})

	afterEach(async () => {
		await ThreadsTableTestHelper.cleanTable()
		await UsersTableTestHelper.cleanTable()
		await CommentsTableTestHelper.cleanTable()
	})

	describe("when POST /threads/{threadId}/comments/{commmentId}/replies", () => {
		it("should response 201 and persisted reply", async () => {
			// Arrange
			const payload = {
				content: "Test",
			}
			const auth = {
				strategy: "forumapi_jwt",
				credentials: { id: "user-123" },
			}

			const server = await createServer(container)

			// Action
			const response = await server.inject({
				method: "POST",
				url: "/threads/thread-123/comments/comment-123/replies",
				payload,
				auth,
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(201)
			expect(responseJson.status).toEqual("success")
			expect(responseJson.data.addedReply).toBeDefined()
		})

		it("should response 400 when request payload not contain needed property", async () => {
			// Arrange
			const payload = {}
			const auth = {
				strategy: "forumapi_jwt",
				credentials: { id: "user-123" },
			}
			const server = await createServer(container)

			// Action
			const response = await server.inject({
				method: "POST",
				url: "/threads/thread-123/comments/comment-123/replies",
				payload,
				auth,
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(400)
			expect(responseJson.status).toEqual("fail")
			expect(responseJson.message).toEqual("harus mengirimkan balasan beserta id thread dan id komentar")
		})

		it("should response 400 when request payload not meet data type specification", async () => {
			// Arrange
			const payload = {
				content: true,
			}
			const auth = {
				strategy: "forumapi_jwt",
				credentials: { id: "user-123" },
			}
			const server = await createServer(container)

			// Action
			const response = await server.inject({
				method: "POST",
				url: "/threads/thread-123/comments/comment-123/replies",
				payload,
				auth,
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(400)
			expect(responseJson.status).toEqual("fail")
			expect(responseJson.message).toEqual("balasan harus berupa string")
		})

		it("should response 404 when thread not exist", async () => {
			// Arrange
			const payload = {
				content: "Test",
			}
			const auth = {
				strategy: "forumapi_jwt",
				credentials: { id: "user-123" },
			}
			const server = await createServer(container)

			// Action
			const response = await server.inject({
				method: "POST",
				url: "/threads/thread-404/comments/comment-123/replies",
				payload,
				auth,
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(404)
			expect(responseJson.status).toEqual("fail")
			expect(responseJson.message).toEqual("thread tidak ditemukan")
		})

		it("should response 404 when comment not exist", async () => {
			// Arrange
			const payload = {
				content: "Test",
			}
			const auth = {
				strategy: "forumapi_jwt",
				credentials: { id: "user-123" },
			}
			const server = await createServer(container)

			// Action
			const response = await server.inject({
				method: "POST",
				url: "/threads/thread-123/comments/comment-404/replies",
				payload,
				auth,
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(404)
			expect(responseJson.status).toEqual("fail")
			expect(responseJson.message).toEqual("komentar tidak ditemukan")
		})
	})

	describe("when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}", () => {
		it("should response 200 with authorized user", async () => {
			// Arrange
			const auth = {
				strategy: "forumapi_jwt",
				credentials: { id: "user-123" },
			}
			// eslint-disable-next-line no-undef
			const server = await createServer(container)

			// Action
			await RepliesTableTestHelper.addReply({id: "reply-123", owner: "user-123"})
			const response = await server.inject({
				method: "DELETE",
				url: "/threads/thread-123/comments/comment-123/replies/reply-123",
				auth,
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(200)
			expect(responseJson.status).toEqual("success")
		})

		it("should response 403 with unauthorized user", async () => {
			// Arrange
			const auth = {
				strategy: "forumapi_jwt",
				credentials: { id: "user-404" },
			}
			const server = await createServer(container)

			// Action
			await RepliesTableTestHelper.addReply({id: "reply-123", owner: "user-123"})
			const response = await server.inject({
				method: "DELETE",
				url: "/threads/thread-123/comments/comment-123/replies/reply-123",
				auth,
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(403)
			expect(responseJson.status).toEqual("fail")
			expect(responseJson.message).toEqual("anda tidak diizinkan mengakses balasan ini")
		})

		it("should response 404 when thread not exist", async () => {
			// Arrange
			const auth = {
				strategy: "forumapi_jwt",
				credentials: { id: "user-123" },
			}
			const server = await createServer(container)

			// Action
			await RepliesTableTestHelper.addReply({id: "reply-123", owner: "user-123"})
			const response = await server.inject({
				method: "DELETE",
				url: "/threads/thread-404/comments/comment-123/replies/reply-123",
				auth,
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(404)
			expect(responseJson.status).toEqual("fail")
			expect(responseJson.message).toEqual("thread tidak ditemukan")
		})

		it("should response 404 when comment not exist", async () => {
			// Arrange
			const auth = {
				strategy: "forumapi_jwt",
				credentials: { id: "user-123" },
			}
			const server = await createServer(container)

			// Action
			await RepliesTableTestHelper.addReply({id: "reply-123", owner: "user-123"})
			const response = await server.inject({
				method: "DELETE",
				url: "/threads/thread-123/comments/comment-404/replies/reply-123",
				auth,
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(404)
			expect(responseJson.status).toEqual("fail")
			expect(responseJson.message).toEqual("komentar tidak ditemukan")
		})
	})
})
