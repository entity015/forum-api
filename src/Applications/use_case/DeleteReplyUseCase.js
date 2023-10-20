class DeleteReplyUseCase {
	constructor({ replyRepository, commentRepository, threadRepository }) {
		this._replyRepository = replyRepository
		this._commentRepository = commentRepository
		this._threadRepository = threadRepository
	}

	async execute(useCasePayload) {
		const { threadId, commentId, replyId, credentialId } = useCasePayload

		await this._threadRepository.getThreadById(threadId)
		await this._commentRepository.getCommentById(commentId)
		await this._replyRepository.getReplyById(replyId)
		await this._replyRepository.verifyReplyOwner(replyId, credentialId)
		await this._replyRepository.deleteReply(replyId)
	}
}

module.exports = DeleteReplyUseCase