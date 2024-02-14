using ChatApp.Business.GroupService;
using ChatApp.Data.Models;
using ChatApp.Data.Models.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ChatAppApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class GroupController : ControllerBase
    {
        private readonly IGroupService _groupService;
        public GroupController(IGroupService groupService)
        {
            _groupService = groupService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllGroups()
        {
            try
            {
                var groups = await _groupService.GetAllGroups();
                return Ok(groups);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public IActionResult HasUserJoinedGroup(string userId,int groupId)
        {
            try
            {
                bool hasJoined = _groupService.HasUserJoinedGroup(userId, groupId);
                return Ok(new {hasJoined});
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllGroupMembers(int groupId)
        {
            try
            {
                var members = await _groupService.GetGroupMembers(groupId);
                return Ok(new {members});
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateGroup(Group group)
        {
            try
            {
                await _groupService.CreateNewGroup(group);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> JoinGroup(UserGroupViewModel userGroupViewModel)
        {
            try
            {
                await _groupService.AddUserToGroup(userGroupViewModel.UserId, userGroupViewModel.GroupId);
                return Ok();
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveUserFromGroup(int groupId,string userId)
        {
            try
            {
                await _groupService.RemoveUserFromGroup(groupId, userId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
