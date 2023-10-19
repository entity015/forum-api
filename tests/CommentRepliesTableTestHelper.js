/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool")

const CommentRepliesTableTestHelper = {
	async addEntry({
		id = "comment-reply-123", commentId = "comment-123", replyId = "reply-123",
	}) {
		const query = {
			text: "INSERT INTO comment_replies VALUES($1, $2, $3)",
			values: [id, commentId, replyId],
		}

		await pool.query(query)
	},

	async findEntryById(id) {
		const query = {
			text: "SELECT * FROM comment_replies WHERE id = $1",
			values: [id],
		}

		const result = await pool.query(query)
		return result.rows
	},

	async cleanTable() {
		await pool.query("DELETE FROM comment_replies WHERE 1=1")
	},
}

module.exports = CommentRepliesTableTestHelper
