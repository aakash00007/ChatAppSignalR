using ChatApp.Business.ContactService;
using ChatApp.Data.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ChatAppApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contactService;
        public ContactController(IContactService contactService)
        {
            _contactService = contactService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserContacts(string userId)
        {
            var contacts = await _contactService.GetAllContacts(userId);
            return Ok(new {contacts});
        }

        [HttpPost]
        public async Task<IActionResult> RemoveFromContacts(ContactUser contact)
        {
            await _contactService.RemoveFromContacts(contact);
            return Ok();
        }
    }
}
