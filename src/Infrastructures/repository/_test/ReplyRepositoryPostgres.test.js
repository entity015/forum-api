const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError")
const NotFoundError = require("../../../Commons/exceptions/NotFoundError")
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper")
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper")
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const pool = require("../../database/postgres/pool")
const CreatedReply = require("../../../Domains/replies/entities/CreatedReply")
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres")

describe("ReplyRepositoryPostgres implementation", () => {
	beforeEach(async () => {
		await UsersTableTestHelper.addUser({id: "user-123"})
		await ThreadsTableTestHelper.addThread({id: "thread-123", owner: "user-123"})
	})
	afterEach(async () => {
		await RepliesTableTestHelper.cleanTable()
		await CommentsTableTestHelper.cleanTable()
		await ThreadsTableTestHelper.cleanTable()
		await UsersTableTestHelper.cleanTable()
	})

	afterAll(async () => {
		await pool.end()
	})

	describe("addReply function", () => {
		it("should add reply to database", async () => {
			// Arrange
			const fakeIdGenerator = () => "123"
			const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

			// Action
			await CommentsTableTestHelper.addComment({id: "comment-123", threadId: "thread-123"})
			await replyRepository.addReply("Test", "user-123", "comment-123")

			// Assert
			const replies = await RepliesTableTestHelper.findReplyById("reply-123")
			expect(replies).toHaveLength(1)
		})

		it("should return created comment correctly", async () => {
			// Arrange
			const fakeIdGenerator = () => "123"
			const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

			// Action
			await CommentsTableTestHelper.addComment({id: "comment-123", threadId: "thread-123"})
			const createdReply = await replyRepository.addReply("Test", "user-123", "comment-123")

			// Assert
			expect(createdReply).toStrictEqual(new CreatedReply({
				id: "reply-123",
				content: "Test",
				owner: "user-123",
			}))
		})
	})

	describe("verifyReplyOwner function", () => {
		it("should throw AuthorizationError when not match owner", async () => {
			// Arrange
			const fakeIdGenerator = () => "123"
			const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

			// Action
			await CommentsTableTestHelper.addComment({id: "comment-123", threadId: "thread-123"})
			await RepliesTableTestHelper.addReply({content: "Test", owner: "user-123", commentId: "comment-123"})

			// Assert
			await expect(replyRepository.verifyReplyOwner("reply-123", "user-404"))
				.rejects.toThrowError(AuthorizationError)
		})

		it("should not throw AuthorizationError when match owner", async () => {
			// Arrange
			const fakeIdGenerator = () => "123"
			const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

			// Action
			await CommentsTableTestHelper.addComment({id: "comment-123", threadId: "thread-123"})
			await RepliesTableTestHelper.addReply({content: "Test", owner: "user-123", commentId: "comment-123"})

			// Assert
			await expect(replyRepository.verifyReplyOwner("reply-123", "user-123"))
				.resolves.not.toThrowError(AuthorizationError)
		})
	})

	describe("deleteReply function", () => {
		it("should delete reply from database", async () => {
			// Arrange
			const fakeIdGenerator = () => "123"
			const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

			// Action
			await CommentsTableTestHelper.addComment({id: "comment-123", threadId: "thread-123"})
			await RepliesTableTestHelper.addReply({owner: "user-123", commentId: "comment-123"})
			await replyRepository.deleteReply("reply-123")

			// Assert
			const comments = await RepliesTableTestHelper.findReplyById("reply-123")
			expect(comments[0].is_deleted).toBe(true)
		})
	})

	describe("getReplyById function", () => {
		it("should throw NotFoundError when reply not exist", async () => {
			// Arrange
			const replyRepository = new ReplyRepositoryPostgres(pool, {})

			// Action & Assert
			await expect(replyRepository.getReplyById("thread-404"))
				.rejects.toThrowError(NotFoundError)
		})

		it("should not throw NotFoundError when reply exist", async () => {
			// Arrange
			const fakeIdGenerator = () => "123"
			const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

			// Action
			await CommentsTableTestHelper.addComment({id: "comment-123", threadId: "thread-123"})
			await RepliesTableTestHelper.addReply({owner: "user-123", commentId: "comment-123"})
			const reply = await replyRepository.getReplyById("reply-123")

			// Assert
			expect(reply.owner).toBe("user-123")
		})
	})

	describe("getRepliesByCommentId function", () => {
		it("should return replies", async () => {
			// Arrange
			const fakeIdGenerator = () => "123"
			const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

			// Action
			await CommentsTableTestHelper.addComment({id: "comment-123", threadId: "thread-123"})

			await RepliesTableTestHelper.addReply({id: "reply-123", commentId: "comment-123"})
			await RepliesTableTestHelper.addReply({id: "reply-456", commentId: "comment-123"})
			const replies = await replyRepository.getRepliesByCommentId("comment-123")

			// Assert
			expect(replies).toHaveLength(2)
			expect(replies[0].username).toBe("dicoding")
		})
	})
})