const CreatedComment = require("../../Domains/comments/entities/CreatedComment")

class AddCommentUseCase {
	constructor({ commentRepository, threadRepository, threadCommentRepository }) {
		this._commentRepository = commentRepository
		this._threadRepository = threadRepository
		this._threadCommentRepository = threadCommentRepository
	}

	async execute(useCasePayload) {
		this._verifyPayload(useCasePayload)
		const { content, threadId, credentialId: owner } = useCasePayload
		await this._threadRepository.getThreadById(threadId)
		const createdComment = await this._commentRepository.addComment(content, owner)
		await this._threadCommentRepository.addEntry(threadId, createdComment.id)
		return createdComment
	}

	_verifyPayload({ content, credentialId, threadId }) {
		if(!content || !credentialId || !threadId) {
			throw new Error("ADD_COMMENT_USE_CASE.NOT_CONTAIN_CONTENT")
		}

		if(typeof content !== "string" || typeof credentialId !== "string" || typeof threadId !== "string") {
			throw new Error("ADD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION")
		}
	}
}

module.exports = AddCommentUseCase