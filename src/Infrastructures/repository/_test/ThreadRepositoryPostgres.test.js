const NotFoundError = require("../../../Commons/exceptions/NotFoundError")
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const pool = require("../../database/postgres/pool")
const NewThread = require("../../../Domains/threads/entities/NewThread")
const CreatedThread = require("../../../Domains/threads/entities/CreatedThread")
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres")

describe("ThreadRepositoryPostgres implementation", () => {
	afterEach(async () => {
		await ThreadsTableTestHelper.cleanTable()
		await UsersTableTestHelper.cleanTable()
	})

	afterAll(async () => {
		await pool.end()
	})

	describe("addThread function", () => {
		it("should add thread to database", async () => {
			// Arrange
			const fakeIdGenerator = () => "123"
			const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator)
			const fakeOwner = "user-123"
			const newThread = new NewThread({
				title: "Test",
				body: "Test",
			})

			// Action
			await UsersTableTestHelper.addUser({id: fakeOwner})
			await threadRepository.addThread(newThread, fakeOwner)

			// Assert
			const threads = await ThreadsTableTestHelper.findThreadById("thread-123")
			expect(threads).toHaveLength(1)
		})

		it("should return created thread correctly", async () => {
			// Arrange
			const fakeIdGenerator = () => "123"
			const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator)
			const fakeOwner = "user-123"
			const newThread = new NewThread({
				title: "Test",
				body: "Test",
			})

			// Action
			await UsersTableTestHelper.addUser({id: fakeOwner})
			const createdThread = await threadRepository.addThread(newThread, fakeOwner)

			// Assert
			expect(createdThread).toStrictEqual(new CreatedThread({
				id: "thread-123",
				title: "Test",
				owner: "user-123",
			}))
		})
	})

	describe("getThreadById function", () => {
		it("should throw NotFoundError when thread not exist", async () => {
			// Arrange
			const threadRepository = new ThreadRepositoryPostgres(pool, {})

			// Action & Assert
			await expect(threadRepository.getThreadById("thread-404"))
				.rejects.toThrowError(NotFoundError)
		})

		it("should not throw NotFoundError when thread exist", async () => {
			// Arrange
			const fakeIdGenerator = () => "123"
			const fakeOwner = "user-123"
			const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator)
			const newThread = new NewThread({
				title: "Test",
				body: "Test",
			})

			// Action
			await UsersTableTestHelper.addUser({id: fakeOwner, username: "testing"})
			await ThreadsTableTestHelper.addThread({owner: fakeOwner, ...newThread})
			const thread = await threadRepository.getThreadById("thread-123")

			// Assert
			expect(thread.owner).toBe(fakeOwner)
			expect(thread.username).toBe("testing")
		})
	})
})