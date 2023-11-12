class LikesRepository {
	async checkLike(owner, commentId) {
		throw new Error("LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED")
	}

	async addLike(owner, commentId) {
		throw new Error("LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED")
	}

	async disLike(owner, commentId) {
		throw new Error("LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED")
	}

	async getLikesByCommentId(commentId) {
		throw new Error("LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED")
	}
}

module.exports = LikesRepository