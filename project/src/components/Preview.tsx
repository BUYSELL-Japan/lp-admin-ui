interface PreviewProps {
  sectionData: any;
  isAuthenticated?: boolean;
}

export default function Preview({ sectionData, isAuthenticated = false }: PreviewProps) {
  return (
    <div className="h-screen flex flex-col bg-white relative">
      <div className="flex-shrink-0 bg-gray-800 text-white px-4 py-2 text-sm">
        プレビュー
      </div>
      <iframe
        className="flex-1 w-full border-0"
        title="Preview"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
