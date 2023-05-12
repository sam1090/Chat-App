import { useEffect, useState } from 'react';
import { baseUrl, getRequest } from '../utils/services';

export const useFetchRecipientUser = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  const recipientId = chat?.members.find((id) => id !== user?.data?.user?._id);

  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) return null;

      const response = await getRequest(`${baseUrl}/users/getUser/${recipientId}`);

      if (response.error) {
        setError(response.error);
      } else {
        setRecipientUser(response);
      }
    };

    getUser();
  }, [recipientId]);

  return { recipientUser, error };
};
