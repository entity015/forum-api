const CommentRepository = require("../../../Domains/comments/CommentRepository")
const ThreadRepository = require("../../../Domains/threads/ThreadRepository")
const CreatedComment = require("../../../Domains/comments/entities/CreatedComment")
const AddCommentUseCase = require("../AddCommentUseCase")

describe("AddCommentUseCase", () => {
	it("should throw error if use case payload not contain content", async () => {
		// Arrange
		const useCasePayload = {}
		const addCommentUseCase = new AddCommentUseCase({})

		// Action & Assert
		await expect(addCommentUseCase.execute(useCasePayload)).rejects.toThrowError("NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY")
	})

	it("should throw error if content not string", async () => {
		// Arrange
		const useCasePayload = { content: true }
		const addCommentUseCase = new AddCommentUseCase({})

		// Action & Assert
		await expect(addCommentUseCase.execute(useCasePayload)).rejects.toThrowError("NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION")
	})

	it("should orchestrating add comment action correctly", async () => {
		// Arrange
		const useCasePayload = { content: "Test", credentialId: "user-123", threadId: "thread-123" }
		const mockCreatedComment = new CreatedComment({
			id: "comment-123",
			content: "Test",
			owner: "user-123",
		})
		const mockThread = {
			id: "thread-123",
			title: "Test",
			body: "Test",
			date: new Date().toISOString(),
			owner: "user-123",
			username: "testing",
		}
		const mockCommentRepository = new CommentRepository()
		const mockThreadRepository = new ThreadRepository()
		mockThreadRepository.getThreadById = jest.fn()
			.mockImplementation(() => Promise.resolve(mockThread))
		mockCommentRepository.addComment = jest.fn()
			.mockImplementation(() => Promise.resolve(mockCreatedComment))

		const addCommentUseCase = new AddCommentUseCase({
			commentRepository: mockCommentRepository,
			threadRepository: mockThreadRepository,
		})

		// Action
		const createdComment = await addCommentUseCase.execute(useCasePayload)

		// Assert
		expect(mockThreadRepository.getThreadById)
			.toBeCalledWith(useCasePayload.threadId)
		expect(mockCommentRepository.addComment)
			.toBeCalledWith(useCasePayload.content, useCasePayload.credentialId, useCasePayload.threadId)
		expect(createdComment).toStrictEqual(new CreatedComment({
			id: "comment-123",
			content: "Test",
			owner: "user-123",
		}))
	})
})