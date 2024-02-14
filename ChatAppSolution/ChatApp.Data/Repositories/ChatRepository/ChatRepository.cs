using ChatApp.Data.DBContext;
using ChatApp.Data.Models;
using ChatApp.Data.Repositories.GenericRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Data.Repositories.ChatRepository
{
    public class ChatRepository : GenericRepository<Message>, IChatRepository
    {
        public ChatRepository(ChatContext context) : base(context)
        {
            
        }
        public async Task<IEnumerable<Message>> GetPreviousMessages(string userId1,string userId2)
        {
            return await _context.Messages.
                Where(x => (x.SenderId == userId1 && x.RecieverId == userId2) ||
                (x.SenderId == userId2 && x.RecieverId == userId1)).
                OrderBy(x => x.TimeStamp).ToListAsync();
               
        }
    }
}
