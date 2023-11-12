/* istanbul ignore file */

const { createContainer } = require("instances-container")

// external agency
const { nanoid } = require("nanoid")
const bcrypt = require("bcrypt")
const Jwt = require("@hapi/jwt")
const pool = require("./database/postgres/pool")

// service (repository, helper, manager, etc)
const UserRepository = require("../Domains/users/UserRepository")
const UserRepositoryPostgres = require("./repository/UserRepositoryPostgres")
const AuthenticationRepository = require("../Domains/authentications/AuthenticationRepository")
const AuthenticationRepositoryPostgres = require("./repository/AuthenticationRepositoryPostgres")
const ThreadRepository = require("../Domains/threads/ThreadRepository")
const ThreadRepositoryPostgres = require("./repository/ThreadRepositoryPostgres")
const CommentRepository = require("../Domains/comments/CommentRepository")
const CommentRepositoryPostgres = require("./repository/CommentRepositoryPostgres")
const ReplyRepository = require("../Domains/replies/ReplyRepository")
const ReplyRepositoryPostgres = require("./repository/ReplyRepositoryPostgres")
const LikesRepository = require("../Domains/likes/LikesRepository")
const LikesRepositoryPostgres = require("./repository/LikesRepositoryPostgres")

const PasswordHash = require("../Applications/security/PasswordHash")
const BcryptPasswordHash = require("./security/BcryptPasswordHash")
const AuthenticationTokenManager = require("../Applications/security/AuthenticationTokenManager")
const JwtTokenManager = require("./security/JwtTokenManager")

// use case
const AddUserUseCase = require("../Applications/use_case/AddUserUseCase")
const LoginUserUseCase = require("../Applications/use_case/LoginUserUseCase")
const LogoutUserUseCase = require("../Applications/use_case/LogoutUserUseCase")
const RefreshAuthenticationUseCase = require("../Applications/use_case/RefreshAuthenticationUseCase")
const CreateThreadUseCase = require("../Applications/use_case/CreateThreadUseCase")
const AddCommentUseCase = require("../Applications/use_case/AddCommentUseCase")
const DeleteCommentUseCase = require("../Applications/use_case/DeleteCommentUseCase")
const AddReplyUseCase = require("../Applications/use_case/AddReplyUseCase")
const DeleteReplyUseCase = require("../Applications/use_case/DeleteReplyUseCase")
const SeeDetailedThreadUseCase = require("../Applications/use_case/SeeDetailedThreadUseCase")
const SwitchLikeUseCase = require("../Applications/use_case/SwitchLikeUseCase")

// creating container
const container = createContainer()

// registering services and repository
container.register([
	{
		key: UserRepository.name,
		Class: UserRepositoryPostgres,
		parameter: {
			dependencies: [
				{
					concrete: pool,
				},
				{
					concrete: nanoid,
				},
			],
		},
	},
	{
		key: AuthenticationRepository.name,
		Class: AuthenticationRepositoryPostgres,
		parameter: {
			dependencies: [
				{
					concrete: pool,
				},
			],
		},
	},
	{
		key: PasswordHash.name,
		Class: BcryptPasswordHash,
		parameter: {
			dependencies: [
				{
					concrete: bcrypt,
				},
			],
		},
	},
	{
		key: AuthenticationTokenManager.name,
		Class: JwtTokenManager,
		parameter: {
			dependencies: [
				{
					concrete: Jwt.token,
				},
			],
		},
	},
	{
		key: ThreadRepository.name,
		Class: ThreadRepositoryPostgres,
		parameter: {
			dependencies: [
				{ concrete: pool },
				{ concrete: nanoid },
			]
		}
	},
	{
		key: CommentRepository.name,
		Class: CommentRepositoryPostgres,
		parameter: {
			dependencies: [
				{ concrete: pool },
				{ concrete: nanoid },
			]
		}
	},
	{
		key: ReplyRepository.name,
		Class: ReplyRepositoryPostgres,
		parameter: {
			dependencies: [
				{ concrete: pool },
				{ concrete: nanoid },
			]
		}
	},
	{
		key: LikesRepository.name,
		Class: LikesRepositoryPostgres,
		parameter: {
			dependencies: [
				{ concrete: pool },
			]
		}
	},
])

// registering use cases
container.register([
	{
		key: AddUserUseCase.name,
		Class: AddUserUseCase,
		parameter: {
			injectType: "destructuring",
			dependencies: [
				{
					name: "userRepository",
					internal: UserRepository.name,
				},
				{
					name: "passwordHash",
					internal: PasswordHash.name,
				},
			],
		},
	},
	{
		key: LoginUserUseCase.name,
		Class: LoginUserUseCase,
		parameter: {
			injectType: "destructuring",
			dependencies: [
				{
					name: "userRepository",
					internal: UserRepository.name,
				},
				{
					name: "authenticationRepository",
					internal: AuthenticationRepository.name,
				},
				{
					name: "authenticationTokenManager",
					internal: AuthenticationTokenManager.name,
				},
				{
					name: "passwordHash",
					internal: PasswordHash.name,
				},
			],
		},
	},
	{
		key: LogoutUserUseCase.name,
		Class: LogoutUserUseCase,
		parameter: {
			injectType: "destructuring",
			dependencies: [
				{
					name: "authenticationRepository",
					internal: AuthenticationRepository.name,
				},
			],
		},
	},
	{
		key: RefreshAuthenticationUseCase.name,
		Class: RefreshAuthenticationUseCase,
		parameter: {
			injectType: "destructuring",
			dependencies: [
				{
					name: "authenticationRepository",
					internal: AuthenticationRepository.name,
				},
				{
					name: "authenticationTokenManager",
					internal: AuthenticationTokenManager.name,
				},
			],
		},
	},
	{
		key: CreateThreadUseCase.name,
		Class: CreateThreadUseCase,
		parameter: {
			injectType: "destructuring",
			dependencies: [
				{
					name: "threadRepository",
					internal: ThreadRepository.name,
				},
			]
		}
	},
	{
		key: AddCommentUseCase.name,
		Class: AddCommentUseCase,
		parameter: {
			injectType: "destructuring",
			dependencies: [
				{
					name: "commentRepository",
					internal: CommentRepository.name,
				},
				{
					name: "threadRepository",
					internal: ThreadRepository.name,
				},
			]
		}
	},
	{
		key: DeleteCommentUseCase.name,
		Class: DeleteCommentUseCase,
		parameter: {
			injectType: "destructuring",
			dependencies: [
				{
					name: "commentRepository",
					internal: CommentRepository.name,
				},
				{
					name: "threadRepository",
					internal: ThreadRepository.name,
				},
			]
		}
	},
	{
		key: AddReplyUseCase.name,
		Class: AddReplyUseCase,
		parameter: {
			injectType: "destructuring",
			dependencies: [
				{
					name: "commentRepository",
					internal: CommentRepository.name,
				},
				{
					name: "threadRepository",
					internal: ThreadRepository.name,
				},
				{
					name: "replyRepository",
					internal: ReplyRepository.name,
				},
			]
		}
	},
	{
		key: DeleteReplyUseCase.name,
		Class: DeleteReplyUseCase,
		parameter: {
			injectType: "destructuring",
			dependencies: [
				{
					name: "replyRepository",
					internal: ReplyRepository.name,
				},
				{
					name: "commentRepository",
					internal: CommentRepository.name,
				},
				{
					name: "threadRepository",
					internal: ThreadRepository.name,
				},
			]
		}
	},
	{
		key: SeeDetailedThreadUseCase.name,
		Class: SeeDetailedThreadUseCase,
		parameter: {
			injectType: "destructuring",
			dependencies: [
				{
					name: "threadRepository",
					internal: ThreadRepository.name,
				},
				{
					name: "commentRepository",
					internal: CommentRepository.name,
				},
				{
					name: "replyRepository",
					internal: ReplyRepository.name,
				},
				{
					name: "likesRepository",
					internal: LikesRepository.name,
				},
			]
		}
	},
	{
		key: SwitchLikeUseCase.name,
		Class: SwitchLikeUseCase,
		parameter: {
			injectType: "destructuring",
			dependencies: [
				{
					name: "threadRepository",
					internal: ThreadRepository.name,
				},
				{
					name: "commentRepository",
					internal: CommentRepository.name,
				},
				{
					name: "likesRepository",
					internal: LikesRepository.name,
				},
			]
		}
	},
])

module.exports = container
