'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getMessages } from '@/services/api';
import { Message } from '@/types';

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, token, logout } = useAuth();

  useEffect(() => {
    // Wait for auth state to be initialized
    if (user === null && token === null) {
      // Check if we're still loading auth state
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (!storedUser || !storedToken) {
        console.log('No stored credentials found');
        router.push('/');
        return;
      }
      // If we have stored credentials, wait for AuthContext to initialize
      return;
    }

    if (!user || !token) {
      console.log('Not authenticated');
      router.push('/');
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await getMessages(user.id, token);
        console.log('Messages response:', response);
        setMessages(response);
      } catch (err) {
        console.log('Error fetching messages:', err);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user, token, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {messages.map((message) => (
              <li key={message.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {message.subject}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {message.recipient}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    {message.content?.html ? (
                      <div
                        className="text-sm text-gray-500"
                        dangerouslySetInnerHTML={{ __html: message.content.html }}
                      />
                    ) : (
                      <p className="text-sm text-gray-500">{message.content?.text || ""}</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 