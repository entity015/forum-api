class DeleteCommentUseCase {
	constructor({ commentRepository, threadRepository }) {
		this._commentRepository = commentRepository
		this._threadRepository = threadRepository
	}

	async execute(useCasePayload) {
		const { threadId, commentId, credentialId } = useCasePayload

		await this._threadRepository.getThreadById(threadId)
		await this._commentRepository.getCommentById(commentId)
		await this._commentRepository.verifyCommentOwner(commentId, credentialId)
		await this._commentRepository.deleteComment(commentId)
	}
}

module.exports = DeleteCommentUseCase