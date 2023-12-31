const ReplyRepository = require("../../../Domains/replies/ReplyRepository")
const CommentRepository = require("../../../Domains/comments/CommentRepository")
const ThreadRepository = require("../../../Domains/threads/ThreadRepository")
const LikesRepository = require("../../../Domains/likes/LikesRepository")
const SeeDetailedThreadUseCase = require("../SeeDetailedThreadUseCase")

describe("SeeDetailedThreadUseCase", () => {
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
		const mockReplies = [
			{
				id: "reply-123",
				content: "Test",
				owner: "user-123",
				date: now,
				is_deleted: false,
				username: "testing",
			}
		]
		const mockLikes = [
			{
				owner: "user-456",
				is_liked: true,
				comment_id: "comment-123",
			},
			{
				owner: "user-123",
				is_liked: false,
				comment_id: "comment-123",
			}
		]
		const mockThreadRepository = new ThreadRepository()
		const mockCommentRepository = new CommentRepository()
		const mockReplyRepository = new ReplyRepository()
		const mockLikesRepository = new LikesRepository()
		mockThreadRepository.getThreadById = jest.fn()
			.mockImplementation(() => Promise.resolve(mockThread))
		mockCommentRepository.getCommentsByThreadId = jest.fn()
			.mockImplementation(() => Promise.resolve(mockComments))
		mockReplyRepository.getRepliesByCommentId = jest.fn()
			.mockImplementation(() => Promise.resolve(mockReplies))
		mockLikesRepository.getLikesByCommentId = jest.fn()
			.mockImplementation(() => Promise.resolve(mockLikes))

		const seeDetailedThreadUseCase = new SeeDetailedThreadUseCase({
			threadRepository: mockThreadRepository,
			commentRepository: mockCommentRepository,
			replyRepository: mockReplyRepository,
			likesRepository: mockLikesRepository,
		})
		const spyTranslateComment = jest.spyOn(seeDetailedThreadUseCase, "_translateCommentModel")
		const spyTranslateReply = jest.spyOn(seeDetailedThreadUseCase, "_translateReplyModel")

		// Action
		const detailedThread = await seeDetailedThreadUseCase.execute(useCasePaylod)

		// Assert
		expect(mockThreadRepository.getThreadById)
			.toBeCalledWith(useCasePaylod.threadId)
		expect(mockCommentRepository.getCommentsByThreadId)
			.toBeCalledWith(useCasePaylod.threadId)
		expect(spyTranslateComment)
			.toHaveBeenCalledTimes(1)
		expect(spyTranslateReply)
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
					replies: [
						{
							id: "reply-123",
							content: "Test",
							username: "testing",
							date: now,
						}
					],
					likeCount: 1,
				}
			],
		})
	})
})