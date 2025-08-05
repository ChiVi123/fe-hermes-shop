# API Naming Conventions

This document outlines the naming conventions for API calls within the project to ensure consistency and clarity.

> **Note:** The examples use Axios for illustration, but you can replace it with any other API calling library or function, such as `fetch`.

---

## Client (Browser) to Next.js Server (API Route)

- **Convention:** `clientApi()`

### Example

```ts
// file: services/user.ts
import axios from 'axios';

export const getUsersClientApi = async () => {
  const response = await axios.get('/api/users');
  return response.data;
};
```

---

## Client (Browser) to External Server (Backend)

- **Convention:** `externalApi()`

### Example

```ts
// file: services/posts.ts
import axios from 'axios';

export const getPostsExternalApi = async () => {
  const response = await axios.get('https://my-backend.com/posts');
  return response.data;
};
```

---

## Next.js Server (API Route) to External Server (Backend)

- **Convention:** `serverApi()`

### Example

```ts
// file: app/api/products/route.ts (API route handler)
import axios from 'axios';

export const updateProductServerApi = async (req: Request) => {
  const { productId, newPrice } = await req.json();
  const response = await axios.put(`https://my-backend.com/products/${productId}`, { newPrice });
  return Response.json(response.data);
};
```

---

## Using Server Actions

- **Convention:** `action()`

### Example

```ts
// file: actions/user.ts
"use server";
import { db } from "@/lib/db";

export async function createUserAction(formData: FormData) {
  const name = formData.get('name');
  // Logic to create a user in the database
  await db.user.create({ data: { name } });
}
```