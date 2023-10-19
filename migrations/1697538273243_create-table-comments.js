/* eslint-disable camelcase */
// STRICT
exports.up = pgm => {
	pgm.createTable("comments", {
		id: {
			type: "VARCHAR(50)",
			primaryKey: true,
		},
		content: {
			type: "TEXT",
			notNull: true,
		},
		owner: {
			type: "VARCHAR(50)",
			notNull: true,
		},
		date: {
			type: "VARCHAR(50)",
			notNull: true,
		},
		is_deleted: {
			type: "BOOLEAN",
			default: false,
		},
	})

	pgm.addConstraint("comments", "fk_comments.owner_users.id", "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE")
}

exports.down = pgm => {
	pgm.dropTable("comments")
}
