const AuthorizationError = require("../../Commons/exceptions/AuthorizationError")
const NotFoundError = require("../../Commons/exceptions/NotFoundError")
const CreatedComment = require("../../Domains/comments/entities/CreatedComment")
const CommentRepository = require("../../Domains/comments/CommentRepository")

class CommentRepositoryPostgres extends CommentRepository {
	constructor(pool, idGenerator) {
		super()
		this._pool = pool
		this._idGenerator = idGenerator
	}

	async addComment(content, owner, threadId) {
		const id = `comment-${this._idGenerator()}`
		const date = new Date().toISOString()

		const query = {
			text: "INSERT INTO comments VALUES($1, $2, $3, $4, DEFAULT, $5) RETURNING id, content, owner",
			values: [id, content, owner, date, threadId],
		}

		const result = await this._pool.query(query)

		return new CreatedComment({ ...result.rows[0] })
	}

	async verifyCommentOwner(commentId, owner) {
		const query = {
			text: "SELECT * FROM comments WHERE id = $1",
			values: [commentId],
		}

		const result = await this._pool.query(query)

		if(result.rows[0].owner !== owner) {
			throw new AuthorizationError("anda tidak diizinkan mengakses komentar ini")
		}
	}

	async deleteComment(commentId) {
		const query = {
			text: "UPDATE comments SET is_deleted = TRUE WHERE id = $1",
			values: [commentId],
		}

		await this._pool.query(query)
	}

	async getCommentById(commentId) {
		const query = {
			text: "SELECT * FROM comments WHERE id = $1",
			values: [commentId],
		}

		const result = await this._pool.query(query)

		if(!result.rowCount) throw new NotFoundError("komentar tidak ditemukan")

		return result.rows[0]
	}

	async getCommentsByThreadId(threadId) {
		const query = {
			text: `SELECT comments.*, users.username FROM comments
						INNER JOIN users ON comments.owner=users.id
						WHERE comments.thread_id = $1 ORDER BY comments.date`,
			values: [threadId],
		}

		const result = await this._pool.query(query)

		return result.rows
	}
}

module.exports = CommentRepositoryPostgres