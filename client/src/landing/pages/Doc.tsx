import Link from "next/link";

const NotionPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-4xl font-bold mb-4">Documentation</h1>
        <p className="text-gray-300 mb-8">
          Visit the full documentation for more information.
        </p>
        <Link href="https://www.notion.so/your-notion-url">
          <a
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Go to Notion
          </a>
        </Link>
      </div>
    </div>
  );
};

export default NotionPage;
