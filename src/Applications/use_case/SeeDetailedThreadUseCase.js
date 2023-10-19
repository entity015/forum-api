class SeeDetailedThreadUseCase {
	constructor({ threadRepository, commentRepository }) {
		this._threadRepository = threadRepository
		this._commentRepository = commentRepository
	}

	async execute(useCasePayload) {
		this._verifyPayload(useCasePayload)

		const { threadId } = useCasePayload
		const thread = this._translateThreadModel(await this._threadRepository.getThreadById(threadId))
		const comments = await this._commentRepository.getCommentsByThreadId(threadId)
		const mappedComments = comments.map(this._translateCommentModel)

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

	_translateCommentModel({ owner, is_deleted, content, ...rest }) {
		// istanbul ignore next
		content = is_deleted ? "**komentar telah dihapus**" : content
		return {
			...rest,
			content,
		}
	}
}

module.exports = SeeDetailedThreadUseCase