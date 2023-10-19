const CommentRepository = require("../../../Domains/comments/CommentRepository")
const ThreadRepository = require("../../../Domains/threads/ThreadRepository")
const ThreadCommentRepository = require("../../../Domains/thread_comments/ThreadCommentRepository")
const CreatedComment = require("../../../Domains/comments/entities/CreatedComment")
const AddCommentUseCase = require("../AddCommentUseCase")

describe("AddCommentUseCase", () => {
	it("should throw error if use case payload not contain content", async () => {
		// Arrange
		const useCasePayload = {}
		const addCommentUseCase = new AddCommentUseCase({})

		// Action & Assert
		await expect(addCommentUseCase.execute(useCasePayload)).rejects.toThrowError("ADD_COMMENT_USE_CASE.NOT_CONTAIN_CONTENT")
	})

	it("should throw error if content not string", async () => {
		// Arrange
		const useCasePayload = { content: true, credentialId: [], threadId: 1 }
		const addCommentUseCase = new AddCommentUseCase({})

		// Action & Assert
		await expect(addCommentUseCase.execute(useCasePayload)).rejects.toThrowError("ADD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION")
	})

	it("should orchestrating add comment action correctly", async () => {
		// Arrange
		const useCasePayload = { content: "Test", credentialId: "user-123", threadId: "thread-123" }
		const mockCreatedComment = new CreatedComment({
			id: "comment-123",
			content: "Test",
			owner: "user-123",
		})
		const mockCommentRepository = new CommentRepository()
		const mockThreadRepository = new ThreadRepository()
		const mockThreadCommentRepository = new ThreadCommentRepository()
		mockThreadRepository.getThreadById = jest.fn()
			.mockImplementation(() => Promise.resolve())
		mockCommentRepository.addComment = jest.fn()
			.mockImplementation(() => Promise.resolve(mockCreatedComment))
		mockThreadCommentRepository.addEntry = jest.fn()
			.mockImplementation(() => Promise.resolve())

		const addCommentUseCase = new AddCommentUseCase({
			commentRepository: mockCommentRepository,
			threadRepository: mockThreadRepository,
			threadCommentRepository: mockThreadCommentRepository,
		})

		// Action
		const createdComment = await addCommentUseCase.execute(useCasePayload)

		// Assert
		expect(mockThreadRepository.getThreadById)
			.toBeCalledWith(useCasePayload.threadId)
		expect(mockCommentRepository.addComment)
			.toBeCalledWith(useCasePayload.content, useCasePayload.credentialId)
		expect(mockThreadCommentRepository.addEntry)
			.toBeCalledWith(useCasePayload.threadId, createdComment.id)
		expect(createdComment).toStrictEqual(new CreatedComment({
			id: "comment-123",
			content: "Test",
			owner: "user-123",
		}))
	})
})