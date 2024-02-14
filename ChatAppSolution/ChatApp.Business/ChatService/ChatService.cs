using ChatApp.Data.Models.ResponseModels;
using ChatApp.Data.Repositories.ChatRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Business.ChatService
{
    public class ChatService : IChatService
    {
        private readonly IChatRepository _chatRepository;
        public ChatService(IChatRepository chatRepository)
        {
            _chatRepository = chatRepository;
        }

        public async Task<ApiResponse> GetPreviousMessages(string userId1, string userId2)
        {
            var messages = _chatRepository.GetPreviousMessages(userId1, userId2).Result;
            if(messages.Count() == 0)
            {
                return new ApiResponse
                {
                    IsSuccess = false,
                    Data = new {},
                    Message = "No Messages Found"
                };
            }
            return new ApiResponse
            {
                IsSuccess = true,
                Data = new {messages},
                Message = "Messages Fetched Successfully!"
            };
        }
    }
}
