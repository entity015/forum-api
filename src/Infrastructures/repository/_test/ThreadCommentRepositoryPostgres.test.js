const pool = require("../../database/postgres/pool")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper")
const ThreadCommentsTableTestHelper = require("../../../../tests/ThreadCommentsTableTestHelper")
const ThreadCommentRepositoryPostgres = require("../ThreadCommentRepositoryPostgres")

describe("ThreadCommentPostgres implementation", () => {
	afterEach(async () => {
		await UsersTableTestHelper.cleanTable()
		await ThreadsTableTestHelper.cleanTable()
	})

	afterAll(async () => {
		await pool.end()
	})

	describe("addEntry function", () => {
		it("should add thread-comment entry to database", async () => {
			// Arrange
			const userId = "user-123"
			const threadId = "thread-123"
			const commentId = "comment-123"
			const fakeIdGenerator = () => "123"
			const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator)

			// Action
			await UsersTableTestHelper.addUser({id: userId})
			await ThreadsTableTestHelper.addThread({id: threadId, owner: userId})
			await CommentsTableTestHelper.addComment({id: commentId, owner: userId})
			await threadCommentRepository.addEntry(threadId, commentId)

			// Assert
			const entries = await ThreadCommentsTableTestHelper.findEntryById("thread-comment-123")
			expect(entries).toHaveLength(1)
		})
	})

	describe("deleteEntryByCommentId function", () => {
		it("should delete thread-comment entry from database", async () => {
			// Arrange
			const userId = "user-123"
			const threadId = "thread-123"
			const commentId = "comment-123"
			const fakeIdGenerator = () => "123"
			const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator)

			// Action
			await UsersTableTestHelper.addUser({id: userId})
			await ThreadsTableTestHelper.addThread({id: threadId, owner: userId})
			await CommentsTableTestHelper.addComment({id: commentId, owner: userId})
			await threadCommentRepository.addEntry(threadId, commentId)
			await threadCommentRepository.deleteEntryByCommentId(commentId)

			// Assert
			const entries = await ThreadCommentsTableTestHelper.findEntryById("thread-comment-123")
			expect(entries).toHaveLength(0)
		})
	})
})