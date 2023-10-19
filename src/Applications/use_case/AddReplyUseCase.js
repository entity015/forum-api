const CreatedReply = require("../../Domains/replies/entities/CreatedReply")

class AddReplyUseCase {
	constructor({
		commentRepository,
		threadRepository,
		commentReplyRepository,
		replyRepository,
	}) {
		this._commentRepository = commentRepository
		this._threadRepository = threadRepository
		this._commentReplyRepository = commentReplyRepository
		this._replyRepository = replyRepository
	}

	async execute(useCasePayload) {
		this._verifyPayload(useCasePayload)
		const { content, threadId, commentId, credentialId: owner } = useCasePayload
		await this._threadRepository.getThreadById(threadId)
		await this._commentRepository.getCommentById(commentId)
		const createdReply = await this._replyRepository.addReply(content, owner)
		await this._commentReplyRepository.addEntry(commentId, createdReply.id)
		return createdReply
	}

	_verifyPayload({ content, credentialId, threadId, commentId }) {
		if(!content || !credentialId || !threadId || !commentId) {
			throw new Error("ADD_REPLY_USE_CASE.NOT_CONTAIN_CONTENT")
		}

		if(typeof content !== "string" || typeof credentialId !== "string" || typeof threadId !== "string" || typeof commentId !== "string") {
			throw new Error("ADD_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION")
		}
	}
}

module.exports = AddReplyUseCase