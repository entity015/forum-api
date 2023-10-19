const ThreadCommentRepository = require("../ThreadCommentRepository")

describe("ThreadCommentRepository interface", () => {
	it("should throw error when invoke unimplemented method", async () => {
		// Arrange
		const threadCommentRepository = new ThreadCommentRepository()

		// Action & Assert
		await expect(threadCommentRepository.addEntry("")).rejects.toThrowError("THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED")
		await expect(threadCommentRepository.deleteEntry("")).rejects.toThrowError("THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED")
	})
})