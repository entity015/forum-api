const InvariantError = require("./InvariantError")

const DomainErrorTranslator = {
	translate(error) {
		return DomainErrorTranslator._directories[error.message] || error
	},
}

DomainErrorTranslator._directories = {
	"REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError("tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada"),
	"REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("tidak dapat membuat user baru karena tipe data tidak sesuai"),
	"REGISTER_USER.USERNAME_LIMIT_CHAR": new InvariantError("tidak dapat membuat user baru karena karakter username melebihi batas limit"),
	"REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER": new InvariantError("tidak dapat membuat user baru karena username mengandung karakter terlarang"),
	"USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError("harus mengirimkan username dan password"),
	"USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("username dan password harus string"),
	"REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN": new InvariantError("harus mengirimkan token refresh"),
	"REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("refresh token harus string"),
	"DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN": new InvariantError("harus mengirimkan token refresh"),
	"DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("refresh token harus string"),
	"NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError("tidak dapat membuat thread karena properti tidak lengkap"),
	"NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("tidak dapat membuat thread karena tipe data tidak sesuai"),
	"ADD_COMMENT_USE_CASE.NOT_CONTAIN_CONTENT": new InvariantError("harus mengirimkan komentar dan id thread"),
	"ADD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("komentar harus berupa string"),
	"DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError("harus mengirimkan id komentar dan id thread"),
	"DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("id komentar dan thread harus berupa string"),
	"SEE_DETAILED_THREAD_USE_CASE.NOT_CONTAIN_THREAD_ID": new InvariantError("harus mengirimkan id thread"),
	"SEE_DETAILED_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("id thread harus berupa string"),
}

module.exports = DomainErrorTranslator
