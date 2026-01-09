# Chat Feature Documentation

## Overview

The chat feature enables real-time communication between players during the experiment, allowing researchers to study coordination, negotiation, and trust-building in cybersecurity information sharing.

## Features

### Real-Time Messaging
- Players can send text messages to all other players in their game
- Messages appear instantly for all participants
- Chat history is preserved throughout the game session

### Message Display
- **Own messages**: Blue bubbles on the right
- **Others' messages**: Gray bubbles on the left with sender name
- Timestamps for all messages
- Auto-scroll to latest message

### User Interface
- **Location**: Right sidebar (300px wide)
- **Layout**: Header, scrollable message area, input box
- **Input**: Text field with Send button
- **Shortcuts**: Enter to send, Shift+Enter for new line
- **Limit**: 500 characters per message

## Data Collection

### What's Recorded

Each chat message captures:
- **Message ID**: Unique identifier
- **Player ID**: Who sent it
- **Player Name**: Display name/identifier
- **Text**: Message content
- **Timestamp**: When it was sent (milliseconds since epoch)
- **Game ID**: Which game session

### Data Structure

```javascript
{
  id: "1704142800000-player123",
  playerId: "01KDXME5ABC123",
  playerName: "Participant_A",
  text: "Should we share full intelligence this round?",
  timestamp: 1704142800000
}
```

### Extraction

Chat data is automatically extracted with:

```bash
python extract_data.py
```

Output file: `data_export/chat_messages_TIMESTAMP.csv`

Columns:
- `game_id`: Game session identifier
- `message_id`: Unique message ID
- `player_id`: Sender's player ID
- `player_name`: Sender's display name
- `text`: Message content
- `timestamp`: Unix timestamp (milliseconds)

## Research Applications

### Communication Patterns

**Frequency Analysis:**
- Messages per round
- Messages per player
- Communication intensity over time

**Content Analysis:**
- Coordination attempts
- Negotiation strategies
- Trust signals
- Deception indicators

**Network Analysis:**
- Who talks to whom
- Response patterns
- Communication centrality

### Linking Chat to Behavior

**Pre-decision communication:**
```python
# Messages before disclosure decisions
round_start = round_data['start_time']
disclosure_time = round_data['disclosure_time']

pre_decision_chat = chat_data[
    (chat_data['timestamp'] >= round_start) &
    (chat_data['timestamp'] < disclosure_time)
]
```

**Coordination success:**
- Did chat lead to aligned disclosure decisions?
- Relationship between communication and cooperation rates

**Trust building:**
- Does early communication predict later cooperation?
- Impact of chat on leakage tolerance

## Analysis Examples

### Basic Statistics

```python
import pandas as pd

# Load chat data
chat = pd.read_csv('data_export/chat_messages_20260101_120000.csv')

# Messages per player
chat['player_name'].value_counts()

# Messages per game
chat.groupby('game_id').size()

# Average message length
chat['text'].str.len().mean()

# Most active time periods
chat['timestamp'] = pd.to_datetime(chat['timestamp'], unit='ms')
chat.groupby(chat['timestamp'].dt.hour).size()
```

### Content Analysis

```python
# Keyword analysis
keywords = ['share', 'cooperate', 'trust', 'leak', 'compete']

for keyword in keywords:
    count = chat['text'].str.contains(keyword, case=False).sum()
    print(f"{keyword}: {count} mentions")

# Sentiment analysis (requires textblob)
from textblob import TextBlob

chat['sentiment'] = chat['text'].apply(
    lambda x: TextBlob(x).sentiment.polarity
)

# Average sentiment per player
chat.groupby('player_name')['sentiment'].mean()
```

### Communication Networks

```python
import networkx as nx

# Build communication graph
G = nx.DiGraph()

for _, msg in chat.iterrows():
    sender = msg['player_name']
    # Assuming messages are broadcasts
    for receiver in chat['player_name'].unique():
        if receiver != sender:
            if G.has_edge(sender, receiver):
                G[sender][receiver]['weight'] += 1
            else:
                G.add_edge(sender, receiver, weight=1)

# Network metrics
nx.degree_centrality(G)
nx.betweenness_centrality(G)
```

### Linking to Outcomes

```python
# Merge chat with disclosure decisions
disclosure = pd.read_csv('data_export/disclosure_decisions_20260101_120000.csv')

# Count messages before each decision
for idx, decision in disclosure.iterrows():
    prior_messages = chat[
        (chat['player_id'] == decision['player_id']) &
        (chat['timestamp'] < decision['decision_time'])
    ]
    disclosure.loc[idx, 'prior_message_count'] = len(prior_messages)

# Correlation between communication and cooperation
import scipy.stats as stats

stats.pearsonr(
    disclosure['prior_message_count'],
    disclosure['disclosure_amount'].map({'none': 0, 'partial': 1, 'full': 2})
)
```

## Configuration Options

### Disable Chat (Optional)

If you want to run a control condition without chat:

**Option 1: Hide the component**

Edit `client/src/Game.tsx`:
```typescript
// Comment out the chat panel
// <ChatPanel position="right" />
```

**Option 2: Conditional rendering**

```typescript
const enableChat = game.get("enableChat") as boolean;

{enableChat && <ChatPanel position="right" />}
```

Then set in treatment:
```yaml
- name: "No-Chat-Control"
  factors:
    enableChat: false
    # ... other factors
```

### Change Position

Edit `client/src/Game.tsx`:

**Bottom panel:**
```typescript
<ChatPanel position="bottom" />
```

**Adjust width:**

Edit `client/src/components/ChatPanel.tsx`:
```typescript
// Change from w-80 (320px) to desired width
<div className="w-96 h-full border-l border-gray-200">
```

### Message Limits

Edit `client/src/components/Chat.tsx`:

**Character limit:**
```typescript
maxLength={500}  // Change to desired limit
```

**Rate limiting:**
```typescript
const [lastMessageTime, setLastMessageTime] = useState(0);

const handleSend = () => {
  const now = Date.now();
  if (now - lastMessageTime < 2000) {  // 2 second cooldown
    alert("Please wait before sending another message");
    return;
  }
  // ... send message
  setLastMessageTime(now);
};
```

## Privacy Considerations

### Anonymization

For anonymous treatments, modify player names:

```typescript
playerName: `Firm ${player.id.slice(-2)}`,  // "Firm 23" instead of real name
```

### Content Moderation

Add profanity filter (optional):

```typescript
import Filter from 'bad-words';
const filter = new Filter();

const handleSend = () => {
  if (filter.isProfane(message)) {
    alert("Please keep messages professional");
    return;
  }
  // ... send message
};
```

### Data Storage

Chat messages are stored in:
- **During game**: Empirica's real-time database
- **After game**: `.empirica/local/tajriba.json`
- **Exported**: `data_export/chat_messages_*.csv`

Ensure compliance with:
- IRB protocols for recording conversations
- Informed consent about chat logging
- Data retention policies

## Best Practices

### For Researchers

1. **Inform participants**: Clearly state chat is recorded
2. **Pilot test**: Check chat works with multiple browsers
3. **Monitor**: Watch for technical issues or inappropriate content
4. **Code systematically**: Use consistent coding schemes for content analysis
5. **Inter-rater reliability**: Have multiple coders for qualitative analysis

### For Participants

Include in instructions:
- Chat is visible to all players in your game
- All messages are recorded for research
- Keep communication professional and on-topic
- Use chat to coordinate strategies

### Technical

1. **Test with multiple players**: Open multiple browser windows
2. **Check timestamps**: Verify synchronization across clients
3. **Monitor performance**: Large chat histories may slow down
4. **Backup data**: Export immediately after sessions

## Troubleshooting

### Messages not appearing

**Check:**
- WebSocket connection (browser console)
- Empirica server running
- No JavaScript errors

**Fix:**
- Refresh browser
- Check network connectivity
- Restart Empirica server

### Messages out of order

**Cause:** Client-side timestamp differences

**Fix:** Use server-side timestamps:

```javascript
// In callbacks.js
Empirica.on("attribute", "chatHistory", ({ attribute }) => {
  const messages = attribute.value;
  const lastMessage = messages[messages.length - 1];
  lastMessage.serverTimestamp = Date.now();
});
```

### Chat history lost

**Cause:** Game state not persisting

**Check:**
- `.empirica/local/` directory exists
- No errors in server logs
- Data being written to tajriba.json

## Future Enhancements

### Possible additions:

1. **Private messaging**: Direct messages between specific players
2. **Channels**: Separate chat rooms for different topics
3. **Rich formatting**: Bold, italics, links
4. **Reactions**: Emoji reactions to messages
5. **File sharing**: Share documents or images
6. **Voice chat**: Audio communication
7. **Translation**: Auto-translate for international studies
8. **Moderation tools**: Flag/report inappropriate messages

### Implementation example (private messaging):

```typescript
interface ChatMessage {
  // ... existing fields
  recipientId?: string;  // undefined = broadcast, string = private
}

const handleSend = (recipientId?: string) => {
  const newMessage: ChatMessage = {
    // ... existing fields
    recipientId: recipientId,
  };
  // ... save message
};
```

## References

### Related Research

- **Coordination in commons dilemmas**: How communication affects cooperation
- **Cheap talk theory**: When pre-play communication influences behavior
- **Trust building**: Role of communication in establishing trust
- **Network formation**: How communication patterns emerge

### Empirica Documentation

- [Empirica Chat Example](https://docs.empirica.ly/examples/chat)
- [Real-time Data Sync](https://docs.empirica.ly/guides/data-sync)
- [Player Communication](https://docs.empirica.ly/guides/player-interaction)

## Support

For issues or questions:
1. Check browser console for errors
2. Review Empirica server logs
3. Test with solo player first
4. Consult Empirica documentation
5. Check this guide's troubleshooting section
