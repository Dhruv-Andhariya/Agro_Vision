# Server Structure

This folder is the backend for AgroVision.

## Folder Tree

```text
server/
├── .env
├── package.json
├── package-lock.json
├── README.md
├── ai-service/
│   ├── app.py
│   ├── classes.py
│   ├── requirements.txt
│   └── model/
│       └── agroguard_model.keras
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── prediction.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── upload.middleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── prediction.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── health.routes.js
│   │   └── prediction.routes.js
│   ├── services/
│   │   └── ai.service.js
│   └── utils/
└── uploads/
```

## Purpose Of Each Part

- `src/app.js`: Express app setup, middleware, and route mounting.
- `src/server.js`: Starts the backend server.
- `src/config/db.js`: MongoDB connection setup.
- `src/controllers/`: Request handlers for auth and predictions.
- `src/middleware/`: Auth and upload middleware.
- `src/models/`: MongoDB schemas.
- `src/routes/`: API route definitions.
- `src/services/`: External service integration, including AI service calls.
- `src/utils/`: Shared helper functions, if needed later.
- `ai-service/`: Python inference service for crop/prediction logic.
- `uploads/`: Stored uploaded images.

## Minimal Design Notes

- Keep route files thin and move logic into controllers.
- Keep reusable logic in services or utils.
- Keep AI inference isolated in `ai-service/` so the Node server stays focused on API orchestration.
- Use `uploads/` only for temporary or processed image files.
