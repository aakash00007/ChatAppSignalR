using ChatApp.Data.Models.ResponseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Business.ChatService
{
    public interface IChatService
    {
        public Task<ApiResponse> GetPreviousMessages(string userId1, string userId2);
    }
}
