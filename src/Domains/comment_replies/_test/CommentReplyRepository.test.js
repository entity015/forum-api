const CommentReplyRepository = require("../CommentReplyRepository")

describe("CommentReplyRepository interface", () => {
	it("should throw error when invoke unimplemented method", async () => {
		// Arrange
		const commentReplyRepository = new CommentReplyRepository()

		// Action & Assert
		await expect(commentReplyRepository.addEntry("")).rejects.toThrowError("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED")
		await expect(commentReplyRepository.deleteEntry("")).rejects.toThrowError("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED")
	})
})