const NotFoundError = require("../../../Commons/exceptions/NotFoundError")
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper")
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper")
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const pool = require("../../database/postgres/pool")
const LikesRepositoryPostgres = require("../LikesRepositoryPostgres")

describe("LikesRepositoryPostgres implementation", () => {
	afterEach(async () => {
		await LikesTableTestHelper.cleanTable()
		await CommentsTableTestHelper.cleanTable()
		await ThreadsTableTestHelper.cleanTable()
		await UsersTableTestHelper.cleanTable()
	})

	afterAll(async () => {
		await pool.end()
	})

	describe("checkLike function", () => {
		it("should throw NotFoundError", async () => {
			// Arrange
			const likesRepository = new LikesRepositoryPostgres(pool)

			// Action & Assert
			await expect(likesRepository.checkLike("user-404", "comment-404"))
				.rejects.toThrowError(NotFoundError)
		})

		it("should not throw NotFoundError", async () => {
			// Arrange
			const likesRepository = new LikesRepositoryPostgres(pool)

			// Action & Assert
			await UsersTableTestHelper.addUser({id: "user-123"})
			await ThreadsTableTestHelper.addThread({id: "thread-123"})
			await CommentsTableTestHelper.addComment({id: "comment-123"})
			await LikesTableTestHelper.addLike("user-123", "comment-123")

			// Action & Assert
			await expect(likesRepository.checkLike("user-123", "comment-123"))
				.resolves.not.toThrowError(NotFoundError)
		})
	})

	describe("addLike function", () => {
		it("should add like to a comment", async () => {
			// Arrange
			const likesRepository = new LikesRepositoryPostgres(pool)

			// Action
			await UsersTableTestHelper.addUser({id: "user-123", username: "test"})
			await UsersTableTestHelper.addUser({id: "user-456", username: "user"})
			await ThreadsTableTestHelper.addThread({id: "thread-123"})
			await CommentsTableTestHelper.addComment({id: "comment-123"})
			await likesRepository.addLike("user-123", "comment-123")
			await likesRepository.addLike("user-456", "comment-123")

			// Assert
			const likes = await LikesTableTestHelper.findLikesByCommentId("comment-123")
			expect(likes).toHaveLength(2)
		})
	})

	describe("disLike function", () => {
		it("should switch is_liked column to false", async () => {
			// Arrange
			const likesRepository = new LikesRepositoryPostgres(pool)

			// Action
			await UsersTableTestHelper.addUser({id: "user-123"})
			await ThreadsTableTestHelper.addThread({id: "thread-123"})
			await CommentsTableTestHelper.addComment({id: "comment-123"})
			await LikesTableTestHelper.addLike("user-123", "comment-123")
			await likesRepository.disLike("user-123", "comment-123")

			// Assert
			const like = await LikesTableTestHelper.findLike("user-123", "comment-123")
			expect(like.is_liked).toBeFalsy()
		})
	})

	describe("getLikesByCommentId function", () => {
		it("should return likes", async () => {
			// Arrange
			const likesRepository = new LikesRepositoryPostgres(pool)

			// Action
			await UsersTableTestHelper.addUser({id: "user-123", username: "1"})
			await UsersTableTestHelper.addUser({id: "user-456", username: "2"})
			await UsersTableTestHelper.addUser({id: "user-789", username: "3"})
			await ThreadsTableTestHelper.addThread({id: "thread-123"})
			await CommentsTableTestHelper.addComment({id: "comment-123"})
			await LikesTableTestHelper.addLike("user-123", "comment-123")
			await LikesTableTestHelper.addLike("user-456", "comment-123")
			await LikesTableTestHelper.addLike("user-789", "comment-123")
			const likes = await likesRepository.getLikesByCommentId("comment-123")

			// Assert
			expect(likes).toHaveLength(3)
		})
	})
})