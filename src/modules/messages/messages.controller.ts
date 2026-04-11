import { Controller, Get, Post, Body, Param, Query, Patch, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

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

  @Get('contact')
  async getContactMessages(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('status') status?: string,
  ) {
    return this.messagesService.getContactMessages(Number(page), Number(limit), status);
  }

  @Patch('contact/:id/status')
  async updateContactStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.messagesService.updateContactStatus(id, status);
  }

  @Delete('contact/:id')
  async deleteContactMessage(@Param('id') id: string) {
    return this.messagesService.deleteContactMessage(id);
  }
}
