using ChatApp.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Data.Repositories.ChatRepository
{
    public interface IChatRepository
    {
        Task<IEnumerable<Message>> GetPreviousMessages(string senderId, string recieverId);
    }
}
