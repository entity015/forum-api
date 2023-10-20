const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError")
const NotFoundError = require("../../../Commons/exceptions/NotFoundError")
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper")
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const pool = require("../../database/postgres/pool")
const CreatedComment = require("../../../Domains/comments/entities/CreatedComment")
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres")

describe("CommentRepositoryPostgres implementation", () => {
	afterEach(async () => {
		await CommentsTableTestHelper.cleanTable()
		await UsersTableTestHelper.cleanTable()
		await ThreadsTableTestHelper.cleanTable()
	})

	afterAll(async () => {
		await pool.end()
	})

	describe("addComment function", () => {
		it("should add comment to database", async () => {
			// Arrange
			const fakeIdGenerator = () => "123"
			const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator)
			const fakeOwner = "user-123"
			const threadId = "thread-123"

			// Action
			await UsersTableTestHelper.addUser({id: fakeOwner})
			await ThreadsTableTestHelper.addThread({id: threadId, owner: fakeOwner})
			await commentRepository.addComment("Test", fakeOwner, threadId)

			// Assert
			const comments = await CommentsTableTestHelper.findCommentById("comment-123")
			expect(comments).toHaveLength(1)
		})

		it("should return created comment correctly", async () => {
			// Arrange
			const fakeIdGenerator = () => "123"
			const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator)
			const fakeOwner = "user-123"
			const threadId = "thread-123"

			// Action
			await UsersTableTestHelper.addUser({id: fakeOwner})
			await ThreadsTableTestHelper.addThread({id: threadId, owner: fakeOwner})
			const createdComment = await commentRepository.addComment("Test", fakeOwner, threadId)

			// Assert
			expect(createdComment).toStrictEqual(new CreatedComment({
				id: "comment-123",
				content: "Test",
				owner: "user-123",
			}))
		})
	})

	describe("verifyCommentOwner function", () => {
		it("should throw AuthorizationError when not match owner", async () => {
			// Arrange
			const fakeIdGenerator = () => "123"
			const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator)
			const fakeOwner = "user-123"
			const threadId = "thread-123"

			// Action
			await UsersTableTestHelper.addUser({id: fakeOwner})
			await ThreadsTableTestHelper.addThread({id: threadId, owner: fakeOwner})
			await CommentsTableTestHelper.addComment("Test", fakeOwner, threadId)

			// Assert
			await expect(commentRepository.verifyCommentOwner("comment-123", "user-404"))
				.rejects.toThrowError(AuthorizationError)
		})

		it("should not throw AuthorizationError when match owner", async () => {
			// Arrange
			const fakeIdGenerator = () => "123"
			const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator)
			const fakeOwner = "user-123"
			const threadId = "thread-123"

			// Action
			await UsersTableTestHelper.addUser({id: fakeOwner})
			await ThreadsTableTestHelper.addThread({id: threadId, owner: fakeOwner})
			await CommentsTableTestHelper.addComment("Test", fakeOwner, threadId)

			// Assert
			await expect(commentRepository.verifyCommentOwner("comment-123", fakeOwner))
				.resolves.not.toThrowError(AuthorizationError)
		})
	})

	describe("deleteComment function", () => {
		it("should delete comment from database", async () => {
			// Arrange
			const fakeIdGenerator = () => "123"
			const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator)
			const fakeOwner = "user-123"
			const threadId = "thread-123"

			// Action
			await UsersTableTestHelper.addUser({id: fakeOwner})
			await ThreadsTableTestHelper.addThread({id: threadId, owner: fakeOwner})
			await CommentsTableTestHelper.addComment({threadId})
			await commentRepository.deleteComment("comment-123")

			// Assert
			const comments = await CommentsTableTestHelper.findCommentById("comment-123")
			expect(comments[0].is_deleted).toBe(true)
		})
	})

	describe("getCommentById function", () => {
		it("should throw error when comment not exist", async () => {
			// Arrange
			const commentRepository = new CommentRepositoryPostgres(pool, {})

			// Action & Assert
			await expect(commentRepository.getCommentById("thread-404"))
				.rejects.toThrowError(NotFoundError)
		})

		it("should not throw error when comment exist", async () => {
			// Arrange
			const fakeIdGenerator = () => "123"
			const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator)
			const fakeOwner = "user-123"
			const threadId = "thread-123"

			// Action
			await UsersTableTestHelper.addUser({id: fakeOwner})
			await ThreadsTableTestHelper.addThread({id: threadId, owner: fakeOwner})
			await CommentsTableTestHelper.addComment({threadId})
			const comment = await commentRepository.getCommentById("comment-123")

			// Assert
			expect(comment.thread_id).toBe(threadId)
		})
	})

	describe("getCommentsByThreadId function", () => {
		it("should return comments", async () => {
			// Arrange
			const fakeIdGenerator = () => "123"
			const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator)
			const fakeOwner = "user-123"
			const threadId = "thread-123"

			// Action
			await UsersTableTestHelper.addUser({id: fakeOwner, username: "testing"})
			await ThreadsTableTestHelper.addThread({id: threadId, owner: fakeOwner})

			await CommentsTableTestHelper.addComment({id: "comment-123", threadId})
			await CommentsTableTestHelper.addComment({id: "comment-456", threadId})
			const comments = await commentRepository.getCommentsByThreadId(threadId)

			// Assert
			expect(comments).toHaveLength(2)
			expect(comments[0].username).toBe("testing")
		})
	})
})