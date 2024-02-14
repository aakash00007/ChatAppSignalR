using ChatApp.Business.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ChatAppApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var result = await _userService.GetAllUsers();
            if(result.IsSuccess)
            {
                return Ok(result);
            }
            return BadRequest();
        }

        [HttpGet]
        public async Task<IActionResult> GetUserById(string userId)
        {
            var user = await _userService.GetUserById(userId);
            return Ok(new {user});
        }
    }
}
