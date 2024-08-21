import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Documentation')
    .setDescription(
      `
      Steps for Authentication and API Access:
    
      1. Create a User:
         - Make a \`POST\` request to the \`/users\` endpoint with the necessary data to create a new user (e.g., \`name\`, \`email\`, \`password\`).
         - Example request body:
         {
           "name": "John Doe",
           "email": "john.doe@example.com",
           "password": "yourpassword"
         }
    
         - This will create a new user in the database.
    
      2. Login:
         - To authenticate, make a \`POST\` request to the \`/auth\` endpoint with the \`email\` and \`password\` of the user you just created.
         - Example request body:
         {
           "email": "john.doe@example.com",
           "password": "yourpassword"
         }
    
         - The response will include an \`accessToken\`, which is a JWT token. This token will be required to access the protected API endpoints.
    
      3. Include the Token in the Authorization Header:
         - To access protected endpoints, add the JWT token in the \`Authorization\` header of each request.
         - The format should be:
    
         Authorization: Bearer YourToken
    
         - Be sure to replace \`YourToken\` with the token you received during login.
    
      4. Token Validity:
         - The JWT token is valid for 60 minutes. After this period, you will need to log in again to obtain a new token.
    
      5. Authentication Required for All Requests:
         - For all requests to the protected API endpoints, you must be authenticated with a valid JWT token. If the token is not provided or is invalid/expired, the API will return an authorization error.
      `,
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: `Retrieve the access token from the auth endpoint and insert it here to authenticate your requests.`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'auth-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
