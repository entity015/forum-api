const CommentRepository = require("../../../Domains/comments/CommentRepository")
const ThreadRepository = require("../../../Domains/threads/ThreadRepository")
const DeleteCommentUseCase = require("../DeleteCommentUseCase")

describe("DeleteCommentUseCase", () => {
	it("should orchestrating delete comment action correctly", async () => {
		// Arrange
		const useCasePayload = { threadId: "thread-123", commentId: "comment-123", credentialId: "user-123" }
		const mockThread = {
			id: "thread-123",
			title: "Test",
			body: "Test",
			date: new Date().toISOString(),
			owner: "user-123",
			username: "testing",
		}
		const mockComment = {
			id: "comment-123",
			content: "Test",
			owner: "user-123",
			date: new Date().toISOString(),
			is_deleted: false,
		}
		const mockCommentRepository = new CommentRepository()
		const mockThreadRepository = new ThreadRepository()
		mockThreadRepository.getThreadById = jest.fn()
			.mockImplementation(() => Promise.resolve(mockThread))
		mockCommentRepository.getCommentById = jest.fn()
			.mockImplementation(() => Promise.resolve(mockComment))
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