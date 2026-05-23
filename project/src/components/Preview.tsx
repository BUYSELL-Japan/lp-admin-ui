interface PreviewProps {
  sectionData: any;
  isAuthenticated?: boolean;
  subdomain?: string | null;
}

export default function Preview({ sectionData, isAuthenticated = false, subdomain }: PreviewProps) {
  const previewUrl = subdomain ? `https://${subdomain}.neural-seeds.com` : '';

  console.log('Preview - Subdomain:', subdomain);
  console.log('Preview - URL:', previewUrl);

  return (
    <div className="h-screen flex flex-col bg-white relative">
      <div className="flex-shrink-0 bg-gray-800 text-white px-4 py-2 text-sm">
        プレビュー {subdomain && <span className="text-gray-300">- {subdomain}.neural-seeds.com</span>}
      </div>
      {previewUrl ? (
        <iframe
          src={previewUrl}
          className="flex-1 w-full border-0"
          title="Preview"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p className="mb-2">プレビューを表示するには、E/p>
            <p>保存�Eタンを押してください</p>
          </div>
        </div>
      )}
    </div>
  );
}
