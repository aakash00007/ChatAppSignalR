using ChatApp.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Business.GroupService
{
    public interface IGroupService
    {
        Task AddUserToGroup(string userId, int groupId);
        Task CreateNewGroup(Group group);
        Task<IEnumerable<Group>> GetAllGroups();
        bool HasUserJoinedGroup(string userId,int groupId);
        public Task<IEnumerable<User>> GetGroupMembers(int groupId);
        public Task RemoveUserFromGroup(int groupId, string userId);

    }
}
