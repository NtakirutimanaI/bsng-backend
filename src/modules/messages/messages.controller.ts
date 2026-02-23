import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversations')
  async getConversations(@Query('userId') userId: string) {
    return this.messagesService.getConversations(userId);
  }

  @Get('chat/:otherUserId')
  async getChat(
    @Query('userId') userId: string,
    @Param('otherUserId') otherUserId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    return this.messagesService.getChat(
      userId,
      otherUserId,
      Number(page),
      Number(limit),
    );
  }

  @Post()
  async sendMessage(
    @Body() body: { senderId: string; receiverId: string; content: string },
  ) {
    return this.messagesService.sendMessage(
      body.senderId,
      body.receiverId,
      body.content,
    );
  }

  @Post('contact')
  async submitContact(@Body() body: any) {
    return this.messagesService.createContactMessage(body);
  }
}
