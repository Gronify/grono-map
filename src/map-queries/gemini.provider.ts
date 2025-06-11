import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';

export const GeminiModelProvider: Provider<ChatGoogleGenerativeAI> = {
  provide: ChatGoogleGenerativeAI,
  useFactory: (configService: ConfigService<AllConfigType>) => {
    return new ChatGoogleGenerativeAI({
      apiKey: configService.getOrThrow('mapQuery.apiKey', {
        infer: true,
      }),
      model: configService.getOrThrow('mapQuery.model', {
        infer: true,
      }),
      temperature: configService.getOrThrow('mapQuery.temperature', {
        infer: true,
      }),
    });
  },
  inject: [ConfigService],
};
