const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError")
const NotFoundError = require("../../../Commons/exceptions/NotFoundError")
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper")
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const CommentRepliesTableTestHelper = require("../../../../tests/CommentRepliesTableTestHelper")
const pool = require("../../database/postgres/pool")
const CreatedReply = require("../../../Domains/replies/entities/CreatedReply")
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres")

describe("ReplyRepositoryPostgres implementation", () => {
	afterEach(async () => {
		await CommentsTableTestHelper.cleanTable()
		await UsersTableTestHelper.cleanTable()
		await CommentRepliesTableTestHelper.cleanTable()
		await RepliesTableTestHelper.cleanTable()
	})

	afterAll(async () => {
		await pool.end()
	})

	describe("addReply function", () => {
		it("should add reply to database", async () => {
			// Arrange
			const fakeIdGenerator = () => "123"
			const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator)
			const fakeOwner = "user-123"
			const content = "Test"

			// Action
			await UsersTableTestHelper.addUser({id: fakeOwner})
			await replyRepository.addReply(content, fakeOwner)

			// Assert
			const replies = await RepliesTableTestHelper.findReplyById("reply-123")
			expect(replies).toHaveLength(1)
		})

		it("should return created comment correctly", async () => {
			// Arrange
			const fakeIdGenerator = () => "123"
			const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator)
			const fakeOwner = "user-123"
			const content = "Test"

			// Action
			await UsersTableTestHelper.addUser({id: fakeOwner})
			const createdReply = await replyRepository.addReply(content, fakeOwner)

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
			const fakeOwner = "user-123"
			const content = "Test"
			const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

			// Action
			await UsersTableTestHelper.addUser({id: fakeOwner})
			await RepliesTableTestHelper.addReply(content, fakeOwner)

			// Assert
			await expect(replyRepository.verifyReplyOwner("reply-123", "user-404"))
				.rejects.toThrowError(AuthorizationError)
		})

		it("should not throw AuthorizationError when match owner", async () => {
			// Arrange
			const fakeIdGenerator = () => "123"
			const fakeOwner = "user-123"
			const content = "Test"
			const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

			// Action
			await UsersTableTestHelper.addUser({id: fakeOwner})
			await RepliesTableTestHelper.addReply(content, fakeOwner)

			// Assert
			await expect(replyRepository.verifyReplyOwner("reply-123", fakeOwner))
				.resolves.not.toThrowError(AuthorizationError)
		})
	})

	describe("deleteReply function", () => {
		it("should delete reply from database", async () => {
			// Arrange
			const fakeIdGenerator = () => "123"
			const fakeOwner = "user-123"
			const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

			// Action
			await UsersTableTestHelper.addUser({id: fakeOwner})
			await RepliesTableTestHelper.addReply({owner: fakeOwner})
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
			const fakeOwner = "user-123"
			const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

			// Action
			await UsersTableTestHelper.addUser({id: fakeOwner})
			await RepliesTableTestHelper.addReply({owner: fakeOwner})
			const reply = await replyRepository.getReplyById("reply-123")

			// Assert
			expect(reply.owner).toBe(fakeOwner)
		})
	})

	describe("getRepliesByCommentId function", () => {
		it("should return replies", async () => {
			// Arrange
			const fakeIdGenerator = () => "123"
			const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator)
			const fakeOwner = "user-123"
			const content = "Test"
			// const threadId = "thread-123"
			const commentId = "comment-123"

			// Action
			await UsersTableTestHelper.addUser({id: fakeOwner, username: "testing"})
			await CommentsTableTestHelper.addComment({id: commentId, owner: fakeOwner})

			await RepliesTableTestHelper.addReply({id: "reply-123", owner: fakeOwner})
			await RepliesTableTestHelper.addReply({id: "reply-456", owner: fakeOwner})
			await CommentRepliesTableTestHelper.addEntry({id: "comment-reply-1", commentId, replyId: "reply-123"})
			await CommentRepliesTableTestHelper.addEntry({id: "comment-reply-2", commentId, replyId: "reply-456"})
			const replies = await replyRepository.getRepliesByCommentId(commentId)

			// Assert
			expect(replies).toHaveLength(2)
			expect(replies[0].username).toBe("testing")
		})
	})
})