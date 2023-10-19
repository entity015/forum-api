const CommentReplyRepository = require("../../Domains/comment_replies/CommentReplyRepository")

class CommentReplyRepositoryPostgres extends CommentReplyRepository {
	constructor(pool, idGenerator) {
		super()
		this._pool = pool
		this._idGenerator = idGenerator
	}

	async addEntry(commentId, replyId) {
		const id = `comment-reply-${this._idGenerator()}`
		const query = {
			text: "INSERT INTO comment_replies VALUES($1, $2, $3)",
			values: [id, commentId, replyId],
		}

		await this._pool.query(query)
	}

	async deleteEntryByReplyId(replyId) {
		const query = {
			text: "DELETE FROM comment_replies WHERE reply_id = $1",
			values: [replyId],
		}

		await this._pool.query(query)
	}
}

module.exports = CommentReplyRepositoryPostgres