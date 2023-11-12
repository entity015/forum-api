class SwitchLikeUseCase {
	constructor({ threadRepository, commentRepository, likesRepository }) {
		this._threadRepository = threadRepository
		this._commentRepository = commentRepository
		this._likesRepository = likesRepository
	}

	async execute(useCasePayload) {
		const { threadId, commentId, credentialId: owner } = useCasePayload
		await this._threadRepository.getThreadById(threadId)
		await this._commentRepository.getCommentById(commentId)
		try {
			await this._likesRepository.checkLike(owner, commentId)
			await this._likesRepository.disLike(owner, commentId)
		} catch(error) {
			await this._likesRepository.addLike(owner, commentId)
		}
	}
}

module.exports = SwitchLikeUseCase
