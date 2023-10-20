const CommentRepository = require("../../../Domains/comments/CommentRepository")
const ThreadRepository = require("../../../Domains/threads/ThreadRepository")
const ReplyRepository = require("../../../Domains/replies/ReplyRepository")
const CreatedReply = require("../../../Domains/replies/entities/CreatedReply")
const AddReplyUseCase = require("../AddReplyUseCase")

describe("AddReplyUseCase", () => {
	it("should throw error if use case payload not contain content", async () => {
		// Arrange
		const useCasePayload = {}
		const addReplyUseCase = new AddReplyUseCase({})

		// Action & Assert
		await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrowError("NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY")
	})

	it("should throw error if content not string", async () => {
		// Arrange
		const useCasePayload = { content: true, credentialId: [], threadId: 1, commentId: 2 }
		const addReplyUseCase = new AddReplyUseCase({})

		// Action & Assert
		await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrowError("NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION")
	})

	it("should orchestrating add reply action correctly", async () => {
		// Arrange
		const useCasePayload = { content: "Test", credentialId: "user-123", threadId: "thread-123", commentId: "comment-123" }
		const mockCreatedReply = new CreatedReply({
			id: "reply-123",
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
		const mockComment = {
			id: "comment-123",
			content: "Test",
			owner: "user-123",
			date: new Date().toISOString(),
			is_deleted: false,
		}
		const mockCommentRepository = new CommentRepository()
		const mockThreadRepository = new ThreadRepository()
		const mockReplyRepository = new ReplyRepository()
		mockThreadRepository.getThreadById = jest.fn()
			.mockImplementation(() => Promise.resolve(mockThread))
		mockCommentRepository.getCommentById = jest.fn()
			.mockImplementation(() => Promise.resolve(mockComment))
		mockReplyRepository.addReply = jest.fn()
			.mockImplementation(() => Promise.resolve(mockCreatedReply))

		const addReplyUseCase = new AddReplyUseCase({
			commentRepository: mockCommentRepository,
			threadRepository: mockThreadRepository,
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
			.toBeCalledWith(useCasePayload.content, useCasePayload.credentialId, useCasePayload.commentId)
		expect(createdReply).toStrictEqual(new CreatedReply({
			id: "reply-123",
			content: "Test",
			owner: "user-123",
		}))
	})
})