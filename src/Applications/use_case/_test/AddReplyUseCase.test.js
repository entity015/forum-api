const CommentRepository = require("../../../Domains/comments/CommentRepository")
const ThreadRepository = require("../../../Domains/threads/ThreadRepository")
const CommentReplyRepository = require("../../../Domains/comment_replies/CommentReplyRepository")
const ReplyRepository = require("../../../Domains/replies/ReplyRepository")
const CreatedReply = require("../../../Domains/replies/entities/CreatedReply")
const AddReplyUseCase = require("../AddReplyUseCase")

describe("AddReplyUseCase", () => {
	it("should throw error if use case payload not contain content", async () => {
		// Arrange
		const useCasePayload = {}
		const addReplyUseCase = new AddReplyUseCase({})

		// Action & Assert
		await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrowError("ADD_REPLY_USE_CASE.NOT_CONTAIN_CONTENT")
	})

	it("should throw error if content not string", async () => {
		// Arrange
		const useCasePayload = { content: true, credentialId: [], threadId: 1, commentId: 2 }
		const addReplyUseCase = new AddReplyUseCase({})

		// Action & Assert
		await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrowError("ADD_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION")
	})

	it("should orchestrating add reply action correctly", async () => {
		// Arrange
		const useCasePayload = { content: "Test", credentialId: "user-123", threadId: "thread-123", commentId: "comment-123" }
		const mockCreatedReply = new CreatedReply({
			id: "reply-123",
			content: "Test",
			owner: "user-123",
		})
		const mockCommentRepository = new CommentRepository()
		const mockThreadRepository = new ThreadRepository()
		const mockCommentReplyRepository = new CommentReplyRepository()
		const mockReplyRepository = new ReplyRepository()
		mockThreadRepository.getThreadById = jest.fn()
			.mockImplementation(() => Promise.resolve())
		mockCommentRepository.getCommentById = jest.fn()
			.mockImplementation(() => Promise.resolve())
		mockReplyRepository.addReply = jest.fn()
			.mockImplementation(() => Promise.resolve(mockCreatedReply))
		mockCommentReplyRepository.addEntry = jest.fn()
			.mockImplementation(() => Promise.resolve())

		const addReplyUseCase = new AddReplyUseCase({
			commentRepository: mockCommentRepository,
			threadRepository: mockThreadRepository,
			commentReplyRepository: mockCommentReplyRepository,
			replyRepository: mockReplyRepository,
		})

		// Action
		const createdReply = await addReplyUseCase.execute(useCasePayload)

		// Assert
		expect(mockThreadRepository.getThreadById)
			.toBeCalledWith(useCasePayload.threadId)
		expect(mockCommentRepository.getCommentById)
			.toBeCalledWith(useCasePayload.commentId)
		expect(mockReplyRepository.addReply)
			.toBeCalledWith(useCasePayload.content, useCasePayload.credentialId)
		expect(mockCommentReplyRepository.addEntry)
			.toBeCalledWith(useCasePayload.commentId, createdReply.id)
		expect(createdReply).toStrictEqual(new CreatedReply({
			id: "reply-123",
			content: "Test",
			owner: "user-123",
		}))
	})
})