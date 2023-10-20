const ReplyRepository = require("../../../Domains/replies/ReplyRepository")
const CommentRepository = require("../../../Domains/comments/CommentRepository")
const ThreadRepository = require("../../../Domains/threads/ThreadRepository")
const DeleteReplyUseCase = require("../DeleteReplyUseCase")

describe("DeleteReplyUseCase", () => {
	it("should orchestrating delete reply action correctly", async () => {
		// Arrange
		const useCasePayload = { threadId: "thread-123", commentId: "comment-123", replyId: "reply-123", credentialId: "user-123" }
		const mockReplyRepository = new ReplyRepository()
		const mockCommentRepository = new CommentRepository()
		const mockThreadRepository = new ThreadRepository()
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
		const mockReply = {
			id: "reply-123",
			content: "Test",
			owner: "user-123",
			date: new Date().toISOString(),
			is_deleted: false,
		}
		mockThreadRepository.getThreadById = jest.fn()
			.mockImplementation(() => Promise.resolve(mockThread))
		mockCommentRepository.getCommentById = jest.fn()
			.mockImplementation(() => Promise.resolve(mockComment))
		mockReplyRepository.getReplyById = jest.fn()
			.mockImplementation(() => Promise.resolve(mockReply))
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