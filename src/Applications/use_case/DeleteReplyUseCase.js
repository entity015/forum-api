class DeleteReplyUseCase {
	constructor({ replyRepository, commentRepository, threadRepository }) {
		this._replyRepository = replyRepository
		this._commentRepository = commentRepository
		this._threadRepository = threadRepository
	}

	async execute(useCasePayload) {
		this._verifyPayload(useCasePayload)
		const { threadId, commentId, replyId, credentialId } = useCasePayload

		await this._threadRepository.getThreadById(threadId)
		await this._commentRepository.getCommentById(commentId)
		await this._replyRepository.getReplyById(replyId)
		await this._replyRepository.verifyReplyOwner(replyId, credentialId)
		await this._replyRepository.deleteReply(replyId)
	}

	_verifyPayload({ threadId, commentId, replyId, credentialId }) {
		if(!threadId || !commentId  || !replyId || !credentialId) {
			throw new Error("DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY")
		}

		if(typeof threadId !== "string" || typeof commentId !== "string" || typeof replyId !== "string" || typeof credentialId !== "string") {
			throw new Error("DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION")
		}
	}
}

module.exports = DeleteReplyUseCase