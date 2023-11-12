const LikesRepository = require("../../../Domains/likes/LikesRepository")
const CommentRepository = require("../../../Domains/comments/CommentRepository")
const ThreadRepository = require("../../../Domains/threads/ThreadRepository")
const SwitchLikeUseCase = require("../SwitchLikeUseCase")

describe("SwitchLikeUseCase", () => {
	it("should orchestrating switch like action correctly", async () => {
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
		const mockLikesRepository = new LikesRepository()
		const mockCommentRepository = new CommentRepository()
		const mockThreadRepository = new ThreadRepository()
		mockThreadRepository.getThreadById = jest.fn()
			.mockImplementation(() => Promise.resolve(mockThread))
		mockCommentRepository.getCommentById = jest.fn()
			.mockImplementation(() => Promise.resolve(mockComment))
		mockLikesRepository.addLike = jest.fn()
			.mockImplementation(() => Promise.resolve())
		mockLikesRepository.checkLike = jest.fn()
			.mockImplementation(() => Promise.reject())

		const switchLikeUseCase = new SwitchLikeUseCase({
			threadRepository: mockThreadRepository,
			commentRepository: mockCommentRepository,
			likesRepository: mockLikesRepository,
		})

		// Action
		await switchLikeUseCase.execute(useCasePayload)

		// Assert
		expect(mockThreadRepository.getThreadById)
			.toBeCalledWith(useCasePayload.threadId)
		expect(mockCommentRepository.getCommentById)
			.toBeCalledWith(useCasePayload.commentId)
		expect(mockLikesRepository.checkLike)
			.toBeCalledWith(useCasePayload.credentialId, useCasePayload.commentId)
		expect(mockLikesRepository.addLike)
			.toBeCalledWith(useCasePayload.credentialId, useCasePayload.commentId)
	})

	it("should orchestrating switch like action correctly", async () => {
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
		const mockLikesRepository = new LikesRepository()
		const mockCommentRepository = new CommentRepository()
		const mockThreadRepository = new ThreadRepository()
		mockThreadRepository.getThreadById = jest.fn()
			.mockImplementation(() => Promise.resolve(mockThread))
		mockCommentRepository.getCommentById = jest.fn()
			.mockImplementation(() => Promise.resolve(mockComment))
		mockLikesRepository.disLike = jest.fn()
			.mockImplementation(() => Promise.resolve())
		mockLikesRepository.checkLike = jest.fn()
			.mockImplementation(() => Promise.resolve())

		const switchLikeUseCase = new SwitchLikeUseCase({
			threadRepository: mockThreadRepository,
			commentRepository: mockCommentRepository,
			likesRepository: mockLikesRepository,
		})

		// Action
		await switchLikeUseCase.execute(useCasePayload)

		// Assert
		expect(mockThreadRepository.getThreadById)
			.toBeCalledWith(useCasePayload.threadId)
		expect(mockCommentRepository.getCommentById)
			.toBeCalledWith(useCasePayload.commentId)
		expect(mockLikesRepository.checkLike)
			.toBeCalledWith(useCasePayload.credentialId, useCasePayload.commentId)
		expect(mockLikesRepository.disLike)
			.toBeCalledWith(useCasePayload.credentialId, useCasePayload.commentId)
	})
})