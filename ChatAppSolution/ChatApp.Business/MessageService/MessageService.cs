using ChatApp.Data.Models;
using ChatApp.Data.Repositories.GenericRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Business.MessageService
{
    public class MessageService : IMessageService
    {
        private readonly IGenericRepository<Message> _messageGenericRepository;
        public MessageService(IGenericRepository<Message> messageGenericRepository)
        {
            _messageGenericRepository = messageGenericRepository;
        }

        public async Task AddMessage(Message message)
        {
            await _messageGenericRepository.Insert(message);
            await _messageGenericRepository.Save();
        }

        public IEnumerable<Message> GetAllGroupMessages(int groupId)
        {
            var groupMessages = _messageGenericRepository.GetAll().Result.Where(u => u.GroupId == groupId).OrderBy(t => t.TimeStamp).ToList();
            return groupMessages;
        }

        public async Task<List<Message>> GetAllUnreadMessages()
        {
            var messages = _messageGenericRepository.GetAll().Result.Where(x => x.IsRead == false).ToList();
            return messages;
        }

        public async Task<List<Message>> GetReceiverSideMessages(string receiverId,string senderId)
        {
            var messages = _messageGenericRepository.GetAll().Result.Where(x => x.RecieverId == senderId && x.SenderId == receiverId && x.IsRead == false).ToList();
            return messages;
        }

        public async Task<int> GetUnreadMessageCount(string receiverId, string senderId)
        {
            var messages = _messageGenericRepository.GetAll().Result.Where(x => x.RecieverId == senderId && x.SenderId == receiverId && x.IsRead == false).ToList();
            return messages.Count;
        }
    }
}
