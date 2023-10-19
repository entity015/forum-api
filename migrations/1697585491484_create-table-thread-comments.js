/* eslint-disable camelcase */
exports.up = pgm => {
	pgm.createTable("thread_comments", {
		id: {
			type: "VARCHAR(50)",
			primaryKey: true,
		},
		thread_id: {
			type: "VARCHAR(50)",
			notNull: true,
		},
		comment_id: {
			type: "VARCHAR(50)",
			notNull: true,
		},
	})

	pgm.addConstraint("thread_comments", "fk_thread_comments.thread_id_threads.id", "FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE")
	pgm.addConstraint("thread_comments", "fk_thread_comments.comment_id_comments.id", "FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE")
}

exports.down = pgm => {
	pgm.dropTable("thread_comments")
}
