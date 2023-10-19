class DeleteCommentUseCase {
	constructor({ commentRepository, threadRepository }) {
		this._commentRepository = commentRepository
		this._threadRepository = threadRepository
	}

	async execute(useCasePayload) {
		this._verifyPayload(useCasePayload)
		const { threadId, commentId, credentialId } = useCasePayload

		await this._threadRepository.getThreadById(threadId)
		await this._commentRepository.getCommentById(commentId)
		await this._commentRepository.verifyCommentOwner(commentId, credentialId)
		await this._commentRepository.deleteComment(commentId)
	}

	_verifyPayload({ threadId, commentId, credentialId }) {
		if(!threadId || !commentId || !credentialId) {
			throw new Error("DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY")
		}

		if(typeof threadId !== "string" || typeof commentId !== "string" || typeof credentialId !== "string") {
			throw new Error("DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION")
		}
	}
}

module.exports = DeleteCommentUseCase