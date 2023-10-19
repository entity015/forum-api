const CommentRepository = require("../../../Domains/comments/CommentRepository")
const ThreadRepository = require("../../../Domains/threads/ThreadRepository")
const SeeDetailedThreadUseCase = require("../SeeDetailedThreadUseCase")

describe("SeeDetailedThreadUseCase", () => {
	it("should throw error if use case payload not contain threadId", async () => {
		// Arrange
		const useCasePaylod = {}
		const seeDetailedThreadUseCase = new SeeDetailedThreadUseCase({})

		// Action & Assert
		await expect(seeDetailedThreadUseCase.execute(useCasePaylod))
			.rejects.toThrowError("SEE_DETAILED_THREAD_USE_CASE.NOT_CONTAIN_THREAD_ID")
	})

	it("should throw error if threadId not string", async () => {
		// Arrange
		const useCasePaylod = { threadId: [] }
		const seeDetailedThreadUseCase = new SeeDetailedThreadUseCase({})

		// Action & Assert
		await expect(seeDetailedThreadUseCase.execute(useCasePaylod))
			.rejects.toThrowError("SEE_DETAILED_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION")
	})

	it("should throw orchestrating see detailed thread correctly", async () => {
		// Arrange
		const useCasePaylod = { threadId: "thread-123" }
		const now = new Date().toISOString()
		const mockThread = {
			id: "thread-123",
			title: "Test",
			body: "Test",
			date: now,
			owner: "user-123",
			username: "testing",
		}
		const mockComments = [
			{
				id: "comment-123",
				content: "Test",
				owner: "user-123",
				date: now,
				is_deleted: true,
				username: "testing",
			}
		]
		const mockThreadRepository = new ThreadRepository()
		const mockCommentRepository = new CommentRepository()
		mockThreadRepository.getThreadById = jest.fn()
			.mockImplementation(() => Promise.resolve(mockThread))
		mockCommentRepository.getCommentsByThreadId = jest.fn()
			.mockImplementation(() => Promise.resolve(mockComments))

		const seeDetailedThreadUseCase = new SeeDetailedThreadUseCase({
			threadRepository: mockThreadRepository,
			commentRepository: mockCommentRepository,
		})
		const spyTranslateComment = jest.spyOn(seeDetailedThreadUseCase, "_translateCommentModel")

		// Action
		const detailedThread = await seeDetailedThreadUseCase.execute(useCasePaylod)

		// Assert
		expect(mockThreadRepository.getThreadById)
			.toBeCalledWith(useCasePaylod.threadId)
		expect(mockCommentRepository.getCommentsByThreadId)
			.toBeCalledWith(useCasePaylod.threadId)
		expect(spyTranslateComment)
			.toHaveBeenCalledTimes(1)
		expect(detailedThread).toStrictEqual({
			id: "thread-123",
			title: "Test",
			body: "Test",
			date: now,
			username: "testing",
			comments: [
				{
					id: "comment-123",
					content: "**komentar telah dihapus**",
					username: "testing",
					date: now,
				}
			],
		})
	})
})