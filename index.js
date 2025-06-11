import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { marked } from 'marked';
  
export async function loader({notionAPIKey, notionDatabaseId, filter = {}}) {
  const notion = new Client({ auth: notionAPIKey });

  const n2m = new NotionToMarkdown({ notionClient: notion });

  const response = await notion.databases.query({
    database_id: notionDatabaseId,
    filter: filter,
  });

  const pagesWithContent = await Promise.all(
    response.results
      .filter((page) => 'properties' in page)
      .map(async (page) => {
        try {
          // Get the page content as markdown
          const mdBlocks = await n2m.pageToMarkdown(page.id);
          const mdString = n2m.toMarkdownString(mdBlocks);
          
          // Debug logging for problematic pag
          
          // Handle different possible structures from notion-to-md
          let content = '';
          if (typeof mdString === 'string') {
            content = mdString;
          } else if (mdString && typeof mdString === 'object') {
            content = mdString.parent || mdString.toString() || '';
          }
          
          return {
            id: page.id,
            title: (page.properties.Title)?.title[0]?.plain_text ?? '',
            description: (page.properties.Description)?.rich_text[0]?.plain_text ?? '',
            pubDate: (page.properties["Published Date"])?.date?.start ? new Date((page.properties["Published Date"])?.date?.start) : new Date(),
            status: (page.properties["Status"])?.status?.name ?? '',
            content: marked.parse(content),
          };
        } catch (error) {
          console.error(`Error converting page ${page.id} to markdown:`, error);
        }
      })
  );

  return pagesWithContent;
}


export async function getCollction({notionAPIKey, notionDatabaseId, filter = {}}){
  return {
    loader: async () => await loader({notionAPIKey, notionDatabaseId, filter}),
    schema: ({ image }) => z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      status: z.string(),
      content: z.string()
	})
  }

}