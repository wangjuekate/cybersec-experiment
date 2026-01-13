import React, { useState } from 'react';

interface AddBotsButtonProps {
  gameId?: string;
  lobbyId?: string;
  currentPlayers: number;
  requiredPlayers: number;
}

export function AddBotsButton({ 
  gameId, 
  lobbyId, 
  currentPlayers, 
  requiredPlayers 
}: AddBotsButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState('');

  const neededBots = Math.max(0, requiredPlayers - currentPlayers);

  const handleAddBots = async () => {
    if (neededBots === 0) {
      setMessage('Game is already full!');
      return;
    }

    setIsAdding(true);
    setMessage('');

    try {
      const response = await fetch('/admin/add-bots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId,
          lobbyId,
          count: neededBots
        })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`✓ Added ${result.botsAdded} bot(s) successfully!`);
        // Refresh the page after 1 second to show new bots
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setMessage(`✗ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`✗ Failed to add bots: ${error.message}`);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div style={{ 
      display: 'inline-block', 
      marginLeft: '1rem',
      verticalAlign: 'middle'
    }}>
      <button
        onClick={handleAddBots}
        disabled={isAdding || neededBots === 0}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: 'white',
          background: neededBots > 0 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
            : '#9ca3af',
          border: 'none',
          borderRadius: '6px',
          cursor: neededBots > 0 && !isAdding ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
          boxShadow: neededBots > 0 ? '0 2px 8px rgba(102,126,234,0.3)' : 'none',
          opacity: isAdding ? 0.7 : 1
        }}
        onMouseEnter={(e) => {
          if (neededBots > 0 && !isAdding) {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102,126,234,0.4)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = neededBots > 0 ? '0 2px 8px rgba(102,126,234,0.3)' : 'none';
        }}
      >
        {isAdding ? (
          '⏳ Adding Bots...'
        ) : neededBots > 0 ? (
          `🤖 Add ${neededBots} Bot${neededBots > 1 ? 's' : ''}`
        ) : (
          '✓ Full'
        )}
      </button>
      
      {message && (
        <div style={{
          marginTop: '0.5rem',
          fontSize: '0.75rem',
          color: message.startsWith('✓') ? '#059669' : '#dc2626',
          fontWeight: '500'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}
