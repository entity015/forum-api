const CommentRepository = require("../../../Domains/comments/CommentRepository")
const ThreadRepository = require("../../../Domains/threads/ThreadRepository")
const DeleteCommentUseCase = require("../DeleteCommentUseCase")

describe("DeleteCommentUseCase", () => {
	it("should throw error if use case payload not contain needed property", async () => {
		// Arrange
		const useCasePayload = {}
		const deleteCommentUseCase = new DeleteCommentUseCase({})

		// Action & Assert
		await expect(deleteCommentUseCase.execute(useCasePayload))
			.rejects.toThrowError("DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY")
	})

	it("should throw error if use case paylaoad not meet data type specs", async () => {
		// Arrange
		const useCasePayload = { threadId: true, commentId: 1, credentialId: [] }
		const deleteCommentUseCase = new DeleteCommentUseCase({})

		// Action & Assert
		await expect(deleteCommentUseCase.execute(useCasePayload))
			.rejects.toThrowError("DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION")
	})

	it("should orchestrating delete comment action correctly", async () => {
		// Arrange
		const useCasePayload = { threadId: "thread-123", commentId: "comment-123", credentialId: "user-123" }
		const mockCommentRepository = new CommentRepository()
		const mockThreadRepository = new ThreadRepository()
		mockThreadRepository.getThreadById = jest.fn()
			.mockImplementation(() => Promise.resolve())
		mockCommentRepository.getCommentById = jest.fn()
			.mockImplementation(() => Promise.resolve())
		mockCommentRepository.verifyCommentOwner = jest.fn()
			.mockImplementation(() => Promise.resolve())
		mockCommentRepository.deleteComment = jest.fn()
			.mockImplementation(() => Promise.resolve())

		const deleteCommentUseCase = new DeleteCommentUseCase({
			commentRepository: mockCommentRepository,
			threadRepository: mockThreadRepository,
		})

		// Action
		await deleteCommentUseCase.execute(useCasePayload)

		// Assert
		expect(mockThreadRepository.getThreadById)
			.toBeCalledWith(useCasePayload.threadId)
		expect(mockCommentRepository.getCommentById)
			.toBeCalledWith(useCasePayload.commentId)
		expect(mockCommentRepository.verifyCommentOwner)
			.toBeCalledWith(useCasePayload.commentId, useCasePayload.credentialId)
		expect(mockCommentRepository.deleteComment)
			.toBeCalledWith(useCasePayload.commentId)
	})
})