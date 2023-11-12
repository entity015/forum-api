const NotFoundError = require("../../Commons/exceptions/NotFoundError")
const LikesRepository = require("../../Domains/likes/LikesRepository")

class LikesRepositoryPostgres extends LikesRepository {
	constructor(pool) {
		super()
		this._pool = pool
	}

	async checkLike(owner, commentId) {
		const query = {
			text: "SELECT * from likes WHERE owner = $1 AND comment_id = $2",
			values: [owner, commentId],
		}

		const result = await this._pool.query(query)

		if(!result.rowCount) throw new NotFoundError()
	}

	async addLike(owner, commentId) {
		const query = {
			text: "INSERT INTO likes VALUES($1, DEFAULT, $2)",
			values: [owner, commentId],
		}

		await this._pool.query(query)
	}

	async disLike(owner, commentId) {
		const query = {
			text: "UPDATE likes SET is_liked = FALSE WHERE owner = $1 AND comment_id = $2",
			values: [owner, commentId],
		}

		await this._pool.query(query)
	}

	async getLikesByCommentId(commentId) {
		const query = {
			text: "SELECT * FROM likes WHERE comment_id = $1",
			values: [commentId],
		}

		const result = await this._pool.query(query)

		return result.rows
	}
}

module.exports = LikesRepositoryPostgres