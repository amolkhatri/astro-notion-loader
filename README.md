# Astro Notion Loader

A simple and efficient loader for fetching content from Notion databases and converting it to markdown format. Perfect for Astro static site generators and other content management workflows.

## Features

- 🚀 **Easy Integration**: Simple API for loading Notion content
- 📝 **Markdown Conversion**: Automatically converts Notion pages to markdown
- 🔧 **Flexible Filtering**: Support for Notion database filters
- ⚡ **Fast Performance**: Efficient batch processing of pages
- 🛡️ **Error Handling**: Robust error handling for failed conversions
- 📦 **TypeScript Support**: Full TypeScript definitions included

## Installation

```bash
npm install astro-notion-loader
```

## Setup

### 1. Create a Notion Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name and associate it with your workspace
4. Copy the **Internal Integration Token** (this is your API key)

### 2. Share Your Database

1. Open your Notion database
2. Click the "Share" button in the top right
3. Click "Invite" and search for your integration name
4. Select your integration and click "Invite"

### 3. Get Your Database ID

Your database ID is the 32-character string in your database URL:
```
https://notion.so/your-workspace/DATABASE_ID?v=...
```

## Usage

### Basic Usage

```javascript
import { loader } from 'astro-notion-loader';

const pages = await loader(
  'your-notion-api-key',
  'your-database-id'
);

console.log(pages);
```

### With Astro Content Collections

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import { loader } from 'astro-notion-loader';

export default defineConfig({
  // ... other config
  experimental: {
    contentCollectionCache: true,
  },
});
```

```javascript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { loader } from 'astro-notion-loader';

const blog = defineCollection({
  loader: () => loader(
    process.env.NOTION_API_KEY,
    process.env.NOTION_DATABASE_ID
  ),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    status: z.string(),
    content: z.string(), // HTML content
  }),
});

export const collections = { blog };
```

### With Filtering

```javascript
import { loader } from 'astro-notion-loader';

// Only fetch published posts
const publishedPosts = await loader(
  'your-notion-api-key',
  'your-database-id',
  {
    property: 'Status',
    status: {
      equals: 'Published'
    }
  }
);
```

### Environment Variables

Create a `.env` file in your project root:

```env
NOTION_API_KEY=your_notion_integration_token
NOTION_DATABASE_ID=your_database_id
```

Then use in your code:

```javascript
import { loader } from 'astro-notion-loader';

const pages = await loader(
  process.env.NOTION_API_KEY,
  process.env.NOTION_DATABASE_ID
);
```

## API Reference

### `loader(notionAPIKey, notionDatabaseId, filter?)`

#### Parameters

- **`notionAPIKey`** (string): Your Notion integration token
- **`notionDatabaseId`** (string): The ID of your Notion database
- **`filter`** (object, optional): Notion database filter object

#### Returns

Promise that resolves to an array of page objects:

```typescript
interface NotionPage {
  id: string;           // Notion page ID
  title: string;        // Page title from Title property
  description: string;  // Description from Description property
  pubDate: Date;        // Date from "Published Date" property
  status: string;       // Status from Status property
  content: string;      // HTML content converted from markdown
}
```

## Database Schema Requirements

Your Notion database should have these properties (case-sensitive):

- **Title** (Title): The page title
- **Description** (Rich Text): Page description/summary
- **Published Date** (Date): Publication date
- **Status** (Status): Page status (e.g., "Draft", "Published")

## Error Handling

The loader includes robust error handling:

- Pages that fail to convert will still be included with empty content
- Errors are logged to console for debugging
- Missing properties are handled gracefully with default values

## Examples

### Blog with Astro

```javascript
// src/pages/blog/[...slug].astro
---
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
---

<html>
  <head>
    <title>{post.data.title}</title>
  </head>
  <body>
    <h1>{post.data.title}</h1>
    <p>{post.data.description}</p>
    <time>{post.data.pubDate.toLocaleDateString()}</time>
    <div set:html={post.data.content} />
  </body>
</html>
```

### Filtering Examples

```javascript
// Only published posts
const filter = {
  property: 'Status',
  status: { equals: 'Published' }
};

// Posts from last month
const filter = {
  property: 'Published Date',
  date: {
    after: '2024-01-01'
  }
};

// Combine multiple filters
const filter = {
  and: [
    {
      property: 'Status',
      status: { equals: 'Published' }
    },
    {
      property: 'Published Date',
      date: { after: '2024-01-01' }
    }
  ]
};
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 📖 [Notion API Documentation](https://developers.notion.com/)
- 🚀 [Astro Documentation](https://docs.astro.build/)
- 🐛 [Report Issues](https://github.com/yourusername/astro-notion-loader/issues) 