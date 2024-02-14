using ChatApp.Business.ChatService;
using ChatApp.Business.MessageService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ChatAppApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;
        private readonly IMessageService _messageService;
        public ChatController(IChatService chatService,IMessageService messageService)
        {
            _chatService = chatService;
            _messageService = messageService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPreviousChat([FromQuery] string userId1, string userId2)
        {
            var result = await _chatService.GetPreviousMessages(userId1, userId2);
            return Ok(result);
        }

        [HttpGet]
        public IActionResult GetGroupMessages(int groupId)
        {
            try
            {
                var groupMessages = _messageService.GetAllGroupMessages(groupId);
                return Ok(new {groupMessages});
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public IActionResult GetAllUnreadMessages()
        {
            try
            {
                var messages = _messageService.GetAllUnreadMessages().Result;
                return Ok(new {messages});
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
