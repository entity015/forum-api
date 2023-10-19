/* eslint-disable camelcase */
exports.up = pgm => {
	pgm.createTable("comment_replies", {
		id: {
			type: "VARCHAR(50)",
			primaryKey: true,
		},
		comment_id: {
			type: "VARCHAR(50)",
			notNull: true,
		},
		reply_id: {
			type: "VARCHAR(50)",
			notNull: true,
		},
	})

	pgm.addConstraint("comment_replies", "fk_comment_replies.comment_id_comments.id", "FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE")
	pgm.addConstraint("comment_replies", "fk_comment_replies.reply_id_replies.id", "FOREIGN KEY(reply_id) REFERENCES replies(id) ON DELETE CASCADE")
}

exports.down = pgm => {
	pgm.dropTable("comment_replies")
}
