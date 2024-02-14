using ChatApp.Business.RequestService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ChatAppApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class RequestController : ControllerBase
    {
        private readonly IRequestService _requestService;
        public RequestController(IRequestService requestService)
        {
            _requestService = requestService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllRequests()
        {
            var requests = await _requestService.GetAllRequests();
            return Ok(new {requests});
        }
    }
}
