const NewComment = require("../../Domains/comments/entities/NewComment")
const CreatedComment = require("../../Domains/comments/entities/CreatedComment")

class AddCommentUseCase {
	constructor({ commentRepository, threadRepository }) {
		this._commentRepository = commentRepository
		this._threadRepository = threadRepository
	}

	async execute(useCasePayload) {
		const { content } = new NewComment(useCasePayload)
		const { threadId, credentialId: owner } = useCasePayload
		await this._threadRepository.getThreadById(threadId)
		const createdComment = await this._commentRepository.addComment(content, owner, threadId)
		return createdComment
	}
}

module.exports = AddCommentUseCase