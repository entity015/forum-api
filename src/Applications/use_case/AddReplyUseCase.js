const NewReply = require("../../Domains/replies/entities/NewReply")
const CreatedReply = require("../../Domains/replies/entities/CreatedReply")

class AddReplyUseCase {
	constructor({ commentRepository, threadRepository, replyRepository }) {
		this._commentRepository = commentRepository
		this._threadRepository = threadRepository
		this._replyRepository = replyRepository
	}

	async execute(useCasePayload) {
		const { content } = new NewReply(useCasePayload)
		const { threadId, commentId, credentialId: owner } = useCasePayload
		await this._threadRepository.getThreadById(threadId)
		await this._commentRepository.getCommentById(commentId)
		const createdReply = await this._replyRepository.addReply(content, owner, commentId)
		return createdReply
	}
}

module.exports = AddReplyUseCase