
import { Channel } from '../types';

export const fetchAndParseM3U = async (url: string): Promise<Channel[]> => {
  try {
    const response = await fetch(url);
    const text = await response.text();
    return parseM3U(text);
  } catch (error) {
    console.error('Failed to fetch M3U:', error);
    return [];
  }
};

const parseM3U = (m3uContent: string): Channel[] => {
  const lines = m3uContent.split('\n');
  const channels: Channel[] = [];
  let currentChannel: Partial<Channel> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('#EXTINF:')) {
      // Parse metadata
      // Example: #EXTINF:-1 tvg-id="CNN.us" tvg-name="CNN" tvg-logo="https://..." group-title="News",CNN
      const nameMatch = line.match(/,(.*)$/);
      const logoMatch = line.match(/tvg-logo="([^"]*)"/);
      const idMatch = line.match(/tvg-id="([^"]*)"/);
      const groupMatch = line.match(/group-title="([^"]*)"/);

      currentChannel = {
        name: nameMatch ? nameMatch[1].trim() : 'Unknown Channel',
        logo: logoMatch ? logoMatch[1] : '',
        id: idMatch ? idMatch[1] : Math.random().toString(36).substr(2, 9),
        category: groupMatch ? groupMatch[1] : 'General',
        source: 'IPTV-ORG'
      };
    } else if (line.startsWith('http')) {
      // The line after #EXTINF is usually the URL
      currentChannel.url = line;
      if (currentChannel.name && currentChannel.url) {
        channels.push(currentChannel as Channel);
      }
      currentChannel = {};
    }
  }

  return channels;
};

/**
 * Robust search and filter functionality
 */
export const filterChannels = (
  channels: Channel[],
  query: string,
  category: string
): Channel[] => {
  return channels.filter((channel) => {
    const matchesQuery = !query || 
      channel.name.toLowerCase().includes(query.toLowerCase()) ||
      channel.category.toLowerCase().includes(query.toLowerCase());
    
    const matchesCategory = category === 'all' || 
      channel.category.toLowerCase() === category.toLowerCase();

    return matchesQuery && matchesCategory;
  });
};
