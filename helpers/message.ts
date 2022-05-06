const messages: any[] = [];

export const newMessage = (data: any): any => {
  const message = {
    id: [data?.from?.sub, data?.to?.sub].sort().join(""),
    from: data?.from,
    to: data?.to,
    message: data?.message,
  };
  messages.push(message);
};

export const getMessages = (chatId: string): any => {
  return messages?.filter((m) => m.id === chatId);
};
