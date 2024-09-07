import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { uuid } from 'uuidv4';

@Injectable()
export class CometChatService {
  constructor(private readonly httpService: HttpService) { }

  async createCometChatUser({ name }: { name: string }): Promise<any> {
    const uuidKey = uuid();

    const headers = {
      apiKey: '39f981597c1f1342e237145284b5065f8479fb19',
      accept: 'application/json',
      'content-type': 'application/json',
    };

    const data = {
      uid: uuidKey, // Assuming createPageDto contains uuidKey
      name: name,
    };
    const url = 'https://2633795789fab3b8.api-us.cometchat.io/v3/users';

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, data, { headers }),
      );
      return {
        uuidKey: uuidKey,
        response: response.data
      }
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }
}

