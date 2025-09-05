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
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
        <span>✨</span>
        Generated Prompts ({generatedPrompts.length})
      </h2>
      
      {error && (
        <div className="mb-6 text-red-800 bg-red-50 p-4 rounded-lg border border-red-200">
          Session error: {error}
        </div>
      )}
      
      {generatedPrompts.length === 0 ? (
        <div className="text-slate-500 text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
          <div className="text-4xl mb-3">🎨</div>
          <p className="text-lg font-medium">No prompts generated yet</p>
          <p className="text-sm">Use the generator panel to create some magical prompts</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6 max-h-80 overflow-y-auto bg-slate-50 rounded-lg p-4 border border-slate-200">
            {generatedPrompts.map((prompt) => (
              <div key={prompt.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 leading-relaxed">{prompt.description}</p>
                    {prompt.negativePrompt && (
                      <p className="text-slate-600 text-sm mt-2 bg-slate-50 p-2 rounded">
                        <span className="font-semibold text-slate-700">Negative:</span> {prompt.negativePrompt}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleFavorite(prompt.id)}
                    className={`ml-3 p-2 rounded-lg transition-colors ${
                      favorites.includes(prompt.id)
                        ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50'
                        : 'text-slate-400 hover:text-yellow-500 hover:bg-yellow-50'
                    }`}
                    title={favorites.includes(prompt.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <span className="text-lg">★</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <textarea
            value={generatedJSON}
            readOnly
            className="w-full h-40 p-4 border-2 border-slate-300 rounded-lg resize-none mb-6 text-sm font-mono
                     bg-slate-50 text-slate-800 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all"
            placeholder="Generated prompts JSON will appear here..."
          />
          
          <div className="flex gap-4">
            <button
              onClick={handleCopy}
              disabled={!generatedJSON}
              className={`py-3 px-6 rounded-lg font-semibold transition-all ${
                generatedJSON 
                  ? 'bg-violet-500 text-white hover:bg-violet-600 shadow-md hover:shadow-lg transform hover:scale-105' 
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              📋 Copy JSON
            </button>
            <button
              onClick={handleDownload}
              disabled={!generatedJSON}
              className={`py-3 px-6 rounded-lg font-semibold transition-all ${
                generatedJSON 
                  ? 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg transform hover:scale-105' 
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              💾 Download JSON
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OutputPanel;
