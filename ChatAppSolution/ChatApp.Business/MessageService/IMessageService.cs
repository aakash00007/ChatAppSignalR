using ChatApp.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Business.MessageService
{
    public interface IMessageService
    {
        public Task AddMessage(Message message);
        public IEnumerable<Message> GetAllGroupMessages(int groupId);
        public Task<List<Message>> GetReceiverSideMessages(string receiverId, string senderId);
        public Task<int> GetUnreadMessageCount(string receiverId, string senderId);
        public Task<List<Message>> GetAllUnreadMessages();
    }
}
