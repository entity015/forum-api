const ThreadCommentRepository = require("../../Domains/thread_comments/ThreadCommentRepository")

class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
	constructor(pool, idGenerator) {
		super()
		this._pool = pool
		this._idGenerator = idGenerator
	}

	async addEntry(threadId, commentId) {
		const id = `thread-comment-${this._idGenerator()}`
		const query = {
			text: "INSERT INTO thread_comments VALUES($1, $2, $3)",
			values: [id, threadId, commentId],
		}

		await this._pool.query(query)
	}

	async deleteEntryByCommentId(commentId) {
		const query = {
			text: "DELETE FROM thread_comments WHERE comment_id = $1",
			values: [commentId],
		}

		await this._pool.query(query)
	}
}

module.exports = ThreadCommentRepositoryPostgres