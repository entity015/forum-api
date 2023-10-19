/* eslint-disable camelcase */
exports.up = pgm => {
	pgm.createTable("replies", {
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

	pgm.addConstraint("replies", "fk_replies.owner_users.id", "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE")
}

exports.down = pgm => {
	pgm.dropTable("replies")
}
