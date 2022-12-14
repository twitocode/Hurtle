import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "@auth/auth.module";
import { DatabaseModule } from "@database/database.module";
import { UsersModule } from "@users/users.module";
import { FlashCardModule } from "./flashcard/flash-card.module";

@Module({
	imports: [ConfigModule.forRoot(), UsersModule, DatabaseModule, AuthModule, FlashCardModule]
})
export class AppModule {}
