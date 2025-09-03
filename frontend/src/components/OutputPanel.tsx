import React from 'react';
import { usePromptStore } from '../stores/promptStore';
import { useSession } from '../hooks/useSession';

const OutputPanel: React.FC = () => {
  const { generatedPrompts } = usePromptStore();
  const { sessionData, addToFavorites, removeFromFavorites, error } = useSession();
  
  const favorites = sessionData?.favorites || [];
  
  const generatedJSON = JSON.stringify(generatedPrompts, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedJSON);
    alert('Copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([generatedJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated-prompts.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleFavorite = async (promptId: string) => {
    try {
      if (favorites.includes(promptId)) {
        await removeFromFavorites(promptId);
      } else {
        await addToFavorites(promptId);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // Show user-friendly error - could implement a toast notification here
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Generated Prompts ({generatedPrompts.length})</h2>
      
      {error && (
        <div className="mb-4 text-red-600 bg-red-50 p-2 rounded border">
          Session error: {error}
        </div>
      )}
      
      {generatedPrompts.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No prompts generated yet. Use the generator panel to create some prompts.
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
            {generatedPrompts.map((prompt) => (
              <div key={prompt.id} className="bg-white p-3 rounded border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{prompt.description}</p>
                    {prompt.negativePrompt && (
                      <p className="text-gray-600 text-xs mt-1">
                        <span className="font-medium">Negative:</span> {prompt.negativePrompt}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleFavorite(prompt.id)}
                    className={`ml-2 p-1 rounded ${
                      favorites.includes(prompt.id)
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : 'text-gray-400 hover:text-yellow-500'
                    }`}
                    title={favorites.includes(prompt.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    ★
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <textarea
            value={generatedJSON}
            readOnly
            className="w-full h-32 p-2 border border-gray-300 rounded-md resize-none mb-4 text-xs font-mono"
            placeholder="Generated prompts JSON will appear here..."
          />
          
          <div className="flex space-x-4">
            <button
              onClick={handleCopy}
              disabled={!generatedJSON}
              className={`py-2 px-4 rounded-md ${generatedJSON ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Copy JSON
            </button>
            <button
              onClick={handleDownload}
              disabled={!generatedJSON}
              className={`py-2 px-4 rounded-md ${generatedJSON ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Download JSON
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OutputPanel;
