export interface NotionPage {
  id: string;
  title: string;
  description: string;
  pubDate: Date;
  status: string;
  content: string;
}

export interface NotionFilter {
  property: string;
  [key: string]: any;
}

/**
 * Loads and converts Notion database pages to markdown format
 * @param notionAPIKey - Your Notion API integration token
 * @param notionDatabaseId - The ID of the Notion database to query
 * @param filter - Optional filter object to apply to the database query
 * @returns Promise that resolves to an array of converted pages
 */
export declare function loader(
  notionAPIKey: string,
  notionDatabaseId: string,
  filter?: NotionFilter
): Promise<NotionPage[]>; 


export declare function getCollction({notionAPIKey, notionDatabaseId, filter = {}}): {
  loader: () => Promise<NotionPage[]>;
  schema: ({ image }: { image: any }) => z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    pubDate: z.ZodDate;
    status: z.ZodString;
    content: z.ZodString;
  }>;
};