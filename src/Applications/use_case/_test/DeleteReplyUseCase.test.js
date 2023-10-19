const ReplyRepository = require("../../../Domains/replies/ReplyRepository")
const CommentRepository = require("../../../Domains/comments/CommentRepository")
const ThreadRepository = require("../../../Domains/threads/ThreadRepository")
const DeleteReplyUseCase = require("../DeleteReplyUseCase")

describe("DeleteReplyUseCase", () => {
	it("should throw error if use case payload not contain needed property", async () => {
		// Arrange
		const useCasePayload = {}
		const deleteReplyUseCase = new DeleteReplyUseCase({})

		// Action & Assert
		await expect(deleteReplyUseCase.execute(useCasePayload))
			.rejects.toThrowError("DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY")
	})

	it("should throw error if use case paylaoad not meet data type specs", async () => {
		// Arrange
		const useCasePayload = { threadId: true, commentId: 1, replyId: 2, credentialId: [] }
		const deleteReplyUseCase = new DeleteReplyUseCase({})

		// Action & Assert
		await expect(deleteReplyUseCase.execute(useCasePayload))
			.rejects.toThrowError("DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION")
	})

	it("should orchestrating delete reply action correctly", async () => {
		// Arrange
		const useCasePayload = { threadId: "thread-123", commentId: "comment-123", replyId: "reply-123", credentialId: "user-123" }
		const mockReplyRepository = new ReplyRepository()
		const mockCommentRepository = new CommentRepository()
		const mockThreadRepository = new ThreadRepository()
		mockThreadRepository.getThreadById = jest.fn()
			.mockImplementation(() => Promise.resolve())
		mockCommentRepository.getCommentById = jest.fn()
			.mockImplementation(() => Promise.resolve())
		mockReplyRepository.getReplyById = jest.fn()
			.mockImplementation(() => Promise.resolve())
		mockReplyRepository.verifyReplyOwner = jest.fn()
			.mockImplementation(() => Promise.resolve())
		mockReplyRepository.deleteReply = jest.fn()
			.mockImplementation(() => Promise.resolve())

		const deleteReplyUseCase = new DeleteReplyUseCase({
			replyRepository: mockReplyRepository,
			commentRepository: mockCommentRepository,
			threadRepository: mockThreadRepository,
		})

		// Action
		await deleteReplyUseCase.execute(useCasePayload)

		// Assert
		expect(mockThreadRepository.getThreadById)
			.toBeCalledWith(useCasePayload.threadId)
		expect(mockCommentRepository.getCommentById)
			.toBeCalledWith(useCasePayload.commentId)
		expect(mockReplyRepository.getReplyById)
			.toBeCalledWith(useCasePayload.replyId)
		expect(mockReplyRepository.verifyReplyOwner)
			.toBeCalledWith(useCasePayload.replyId, useCasePayload.credentialId)
		expect(mockReplyRepository.deleteReply)
			.toBeCalledWith(useCasePayload.replyId)
	})
})