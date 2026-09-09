import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Karaoke App API",
      version: "1.0.0",
      description: "API documentation for the Karaoke room management system",
    },
    servers: [
      {
        // Update this if your port changes
        url: "http://localhost:3000/api", 
        description: "Local development server",
      },
    ],
  },
  // Tells Swagger where to look for your route documentation
  apis: ["./src/modules/**/presentation/*Routes.ts", "./src/modules/**/presentation/dtos/*.ts"], 
};

export const swaggerSpec = swaggerJsdoc(options);