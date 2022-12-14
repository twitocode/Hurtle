import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { UserEntity } from "../users/entities/user.entity";
import { AuthService } from "./auth.service";
import { RegisterDTO } from "./dto/register.dto";
import { LoginResult } from "./types";

@Controller("auth")
@ApiTags("Authentication")
export class AuthController {
	constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

	@UseGuards(AuthGuard("local"))
	@Post("/login")
	async login(@Req() req: Request): Promise<LoginResult> {
		return this.authService.login(req.user as UserEntity);
	}

	@Post("/register")
	async register(@Body() data: RegisterDTO): Promise<LoginResult> {
		return this.authService.register(data);
	}

	@UseGuards(AuthGuard("jwt"))
	@Get("/profile")
	getProfile(@Req() req: Request) {
		return req.user;
	}

	@Get("/google")
	@UseGuards(AuthGuard("google"))
	async googleAuth() {
		/* */
	}

	@Get("/google/callback")
	@UseGuards(AuthGuard("google"))
	googleAuthCallback(@Req() req: Request, @Res() res: Response) {
		const { token } = req.user as {
			token: string;
			user: UserEntity;
		};

		res.cookie("session", token, {
			domain: this.configService.get("CLIENT_DOMAIN"),
			path: "/",
			sameSite: false
		});
		console.log(token);

		res.redirect(this.configService.get("CLIENT_AUTH_REDIRECT") + `?token=${token}`);
	}
}
