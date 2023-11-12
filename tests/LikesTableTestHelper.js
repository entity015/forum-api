/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool")

const LikesTableTestHelper = {
	async addLike(owner, commentId) {
		const query = {
			text: "INSERT INTO likes VALUES ($1, DEFAULT, $2)",
			values: [owner, commentId],
		}

		await pool.query(query)
	},

	async findLike(owner, commentId) {
		const query = {
			text: "SELECT * FROM likes WHERE owner = $1 AND comment_id = $2",
			values: [owner, commentId],
		}

		const result = await pool.query(query)
		return result.rows[0]
	},

	async findLikesByCommentId(commentId) {
		const query = {
			text: "SELECT * FROM likes WHERE comment_id = $1",
			values: [commentId],
		}

		const result = await pool.query(query)
		return result.rows
	},

	async cleanTable() {
		await pool.query("DELETE FROM likes WHERE 1=1")
	},
}

module.exports = LikesTableTestHelper
