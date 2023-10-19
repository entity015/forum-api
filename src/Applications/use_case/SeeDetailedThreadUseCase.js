class SeeDetailedThreadUseCase {
	constructor({ threadRepository, commentRepository , replyRepository }) {
		this._threadRepository = threadRepository
		this._commentRepository = commentRepository
		this._replyRepository = replyRepository
	}

	async execute(useCasePayload) {
		this._verifyPayload(useCasePayload)

		const { threadId } = useCasePayload
		const thread = this._translateThreadModel(await this._threadRepository.getThreadById(threadId))
		const comments = await this._commentRepository.getCommentsByThreadId(threadId)
		// const mappedComments = comments.map(this._translateCommentModel)
		this._translateCommentModel = this._translateCommentModel.bind(this)
		this._translateReplyModel = this._translateReplyModel.bind(this)
		const mappedComments = await Promise.all(comments.map(this._translateCommentModel))

		return {
			...thread,
			comments: mappedComments,
		}
	}

	_verifyPayload({ threadId }) {
		if(!threadId) throw new Error("SEE_DETAILED_THREAD_USE_CASE.NOT_CONTAIN_THREAD_ID")

		if(typeof threadId !== "string") throw new Error("SEE_DETAILED_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION")
	}

	_translateThreadModel({ owner, ...rest }) {
		return {
			...rest,
		}
	}

	async _translateCommentModel({ owner, is_deleted, content, id, ...rest }) {
		// istanbul ignore next
		content = is_deleted ? "**komentar telah dihapus**" : content
		const replies = await this._replyRepository.getRepliesByCommentId(id)
		const mappedReplies = replies.map(this._translateReplyModel)
		return {
			id,
			...rest,
			content,
			replies: mappedReplies,
		}
	}

	_translateReplyModel({ owner, is_deleted, content, ...rest }) {
		// istanbul ignore next
		content = is_deleted ? "**balasan telah dihapus**" : content
		return {
			...rest,
			content,
		}
	}
}

module.exports = SeeDetailedThreadUseCase