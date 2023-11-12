const LikesRepository = require("../LikesRepository")

describe("LikesRepository interface", () => {
	it("should throw error when invoke unimplemented method", async () => {
		// Arrange
		const likesRepository = new LikesRepository()

		// Action & Assert
		await expect(likesRepository.checkLike("","")).rejects.toThrowError("LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED")
		await expect(likesRepository.addLike("","")).rejects.toThrowError("LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED")
		await expect(likesRepository.disLike("","")).rejects.toThrowError("LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED")
		await expect(likesRepository.getLikesByCommentId("")).rejects.toThrowError("LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED")
	})
})