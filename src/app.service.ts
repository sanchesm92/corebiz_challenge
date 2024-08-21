import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '©2024 - Felipe Sanches Meirelles All Rights Reserved!';
  }
}
