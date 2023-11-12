const pool = require("../../database/postgres/pool")
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper")
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper")
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

	describe("when PUT /threads/{threadId}/comments/{commmentId}/likes", () => {
		it("should response 200 and add like", async () => {
			// Arrange
			const auth = {
				strategy: "forumapi_jwt",
				credentials: { id: "user-123" },
			}

			const server = await createServer(container)

			// Action
			const response = await server.inject({
				method: "PUT",
				url: "/threads/thread-123/comments/comment-123/likes",
				auth,
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(200)
			expect(responseJson.status).toEqual("success")
		})

		it("should response 200 and switch like to dislike", async () => {
			// Arrange
			const auth = {
				strategy: "forumapi_jwt",
				credentials: { id: "user-123" },
			}
			const server = await createServer(container)

			// Action
			await LikesTableTestHelper.addLike("user-123", "comment-123")
			const response = await server.inject({
				method: "PUT",
				url: "/threads/thread-123/comments/comment-123/likes",
				auth,
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(200)
			expect(responseJson.status).toEqual("success")
		})		
	})
})
