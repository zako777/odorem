import User from '#models/user'
import {
  Arg,
  Authorized,
  CurrentUser,
  Field,
  ID,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@foadonis/graphql'

import { LoginUser } from '../../user/application/login_user.js'
import { RegisterUser } from '../../user/application/register_user.js'
import { LucidUserRepository } from '../../user/infrastructure/persistence/lucid_user_repository.js'
import { loginValidator, signupValidator } from '#validators/user'

@InputType()
class RegisterUserInput {
  @Field()
  email!: string

  @Field()
  password!: string

  @Field()
  passwordConfirmation!: string

  @Field(() => String, { nullable: true })
  fullName?: string | null
}

@InputType()
class LoginUserInput {
  @Field()
  email!: string

  @Field()
  password!: string
}

@ObjectType()
class UserPublicProfile {
  @Field(() => ID)
  id!: number

  @Field()
  email!: string

  @Field(() => String, { nullable: true })
  fullName!: string | null
}

@ObjectType()
class AuthPayload {
  @Field(() => UserPublicProfile)
  user!: UserPublicProfile

  @Field()
  token!: string
}

@Resolver()
export default class UserResolver {
  private readonly registerUser = new RegisterUser(new LucidUserRepository())
  private readonly loginUser = new LoginUser(new LucidUserRepository())

  @Mutation(() => AuthPayload)
  async register(@Arg('input', () => RegisterUserInput) input: RegisterUserInput) {
    const validatedInput = await signupValidator.validate({
      ...input,
      passwordConfirmation: input.passwordConfirmation,
    })
    const user = await this.registerUser.execute(validatedInput)
    const persistedUser = await User.findOrFail(user.id)
    const token = await User.accessTokens.create(persistedUser)

    return {
      user: user.toPublic(),
      token: token.value!.release(),
    }
  }

  @Mutation(() => AuthPayload)
  async login(@Arg('input', () => LoginUserInput) input: LoginUserInput) {
    const user = await this.loginUser.execute(await loginValidator.validate(input))
    const persistedUser = await User.findOrFail(user.id)
    const token = await User.accessTokens.create(persistedUser)

    return {
      user: user.toPublic(),
      token: token.value!.release(),
    }
  }

  @Authorized()
  @Query(() => UserPublicProfile)
  async me(@CurrentUser() currentUser: User) {
    return {
      id: currentUser.id,
      email: currentUser.email,
      fullName: currentUser.fullName,
    }
  }
}
