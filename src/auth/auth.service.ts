import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  stripPasswordFromUser(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async validateUserById(id: number) {
    const user = await this.userService.findOne(id);
    if (!user) return null;
    return this.stripPasswordFromUser(user);
  }

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    if (!user || user.password !== password) return null;
    return this.stripPasswordFromUser(user);
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
