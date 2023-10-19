const pool = require("../../database/postgres/pool")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper")
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper")
const CommentRepliesTableTestHelper = require("../../../../tests/CommentRepliesTableTestHelper")
const CommentReplyRepositoryPostgres = require("../CommentReplyRepositoryPostgres")

describe("CommentReplyRepositoryPostgres implementation", () => {
	afterEach(async () => {
		await CommentRepliesTableTestHelper.cleanTable()
		await CommentsTableTestHelper.cleanTable()
		await RepliesTableTestHelper.cleanTable()
		await UsersTableTestHelper.cleanTable()
	})

	afterAll(async () => {
		await pool.end()
	})

	describe("addEntry function", () => {
		it("should add comment-reply entry to database", async () => {
			// Arrange
			const userId = "user-123"
			const commentId = "comment-123"
			const replyId = "reply-123"
			const fakeIdGenerator = () => "123"
			const commentReplyRepository = new CommentReplyRepositoryPostgres(pool, fakeIdGenerator)

			// Action
			await UsersTableTestHelper.addUser({id: userId})
			await CommentsTableTestHelper.addComment({id: commentId, owner: userId})
			await RepliesTableTestHelper.addReply({id: replyId, owner: userId})
			await commentReplyRepository.addEntry(commentId, replyId)

			// Assert
			const entries = await CommentRepliesTableTestHelper.findEntryById("comment-reply-123")
			expect(entries).toHaveLength(1)
		})
	})

	describe("deleteEntryByReplyId function", () => {
		it("should delete comment-reply entry from database", async () => {
			// Arrange
			const userId = "user-123"
			const commentId = "comment-123"
			const replyId = "reply-123"
			const fakeIdGenerator = () => "123"
			const commentReplyRepository = new CommentReplyRepositoryPostgres(pool, fakeIdGenerator)

			// Action
			await UsersTableTestHelper.addUser({id: userId})
			await CommentsTableTestHelper.addComment({id: commentId, owner: userId})
			await RepliesTableTestHelper.addReply({id: replyId, owner: userId})
			await CommentRepliesTableTestHelper.addEntry(commentId, replyId)
			await commentReplyRepository.deleteEntryByReplyId(replyId)

			// Assert
			const entries = await CommentRepliesTableTestHelper.findEntryById("comment-reply-123")
			expect(entries).toHaveLength(0)
		})
	})
})