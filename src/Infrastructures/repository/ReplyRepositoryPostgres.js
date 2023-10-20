const AuthorizationError = require("../../Commons/exceptions/AuthorizationError")
const NotFoundError = require("../../Commons/exceptions/NotFoundError")
const CreatedReply = require("../../Domains/replies/entities/CreatedReply")
const ReplyRepository = require("../../Domains/replies/ReplyRepository")

class ReplyRepositoryPostgres extends ReplyRepository {
	constructor(pool, idGenerator) {
		super()
		this._pool = pool
		this._idGenerator = idGenerator
	}

	async addReply(content, owner, commentId) {
		const id = `reply-${this._idGenerator()}`
		const date = new Date().toISOString()

		const query = {
			text: "INSERT INTO replies VALUES($1, $2, $3, $4, DEFAULT, $5) RETURNING id, content, owner",
			values: [id, content, owner, date, commentId],
		}

		const result = await this._pool.query(query)

		return new CreatedReply({ ...result.rows[0] })
	}

	async verifyReplyOwner(replyId, owner) {
		const query = {
			text: "SELECT * FROM replies WHERE id = $1",
			values: [replyId],
		}

		const result = await this._pool.query(query)

		if(result.rows[0].owner !== owner) {
			throw new AuthorizationError("anda tidak diizinkan mengakses balasan ini")
		}
	}

	async deleteReply(replyId) {
		const query = {
			text: "UPDATE replies SET is_deleted = TRUE WHERE id = $1",
			values: [replyId],
		}

		await this._pool.query(query)
	}

	async getReplyById(replyId) {
		const query = {
			text: "SELECT * FROM replies WHERE id = $1",
			values: [replyId],
		}

		const result = await this._pool.query(query)

		if(!result.rowCount) throw new NotFoundError("balasan tidak ditemukan")

		return result.rows[0]
	}

	async getRepliesByCommentId(commentId) {
		const query = {
			text: `SELECT replies.*, users.username FROM replies
						INNER JOIN users ON replies.owner=users.id
						WHERE replies.comment_id = $1 ORDER BY replies.date`,
			values: [commentId],
		}

		const result = await this._pool.query(query)

		return result.rows
	}
}

module.exports = ReplyRepositoryPostgres