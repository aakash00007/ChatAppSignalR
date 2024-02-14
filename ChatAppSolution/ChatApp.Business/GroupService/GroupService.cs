using ChatApp.Data.Models;
using ChatApp.Data.Repositories.GenericRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Business.GroupService
{
    public class GroupService : IGroupService
    {
        private readonly IGenericRepository<UserGroup> _userGroupGenericRepository;
        private readonly IGenericRepository<Group> _groupGenericRepository;
        public GroupService(IGenericRepository<UserGroup> userGroupGenericRepository, IGenericRepository<Group> groupGenericRepository)
        {
            _userGroupGenericRepository = userGroupGenericRepository;
            _groupGenericRepository = groupGenericRepository;
        }

        public async Task AddUserToGroup(string userId, int groupId)
        {
            var userGroup = new UserGroup
            {
                UserId = userId,
                GroupId = groupId
            };
            await _userGroupGenericRepository.Insert(userGroup);
            await _userGroupGenericRepository.Save();
        }

        public async Task RemoveUserFromGroup(int groupId,string userId)
        {
            var userGroup = _userGroupGenericRepository.GetAll().Result.Where(x=> x.GroupId == groupId && x.UserId == userId).FirstOrDefault();
            await _userGroupGenericRepository.Delete(userGroup.Id);
            await _userGroupGenericRepository.Save();
        }

        public async Task CreateNewGroup(Group group)
        {
            await _groupGenericRepository.Insert(group);
            await _groupGenericRepository.Save();
            var createdGroup = _groupGenericRepository.GetAll().Result.Where(x=> x.Name == group.Name).FirstOrDefault();
            var userGroup = new UserGroup
            {
                UserId = group.CreatedBy,
                GroupId = createdGroup.Id
            };
            await _userGroupGenericRepository.Insert(userGroup);
            await _userGroupGenericRepository.Save();
        }

        public async Task<IEnumerable<Group>> GetAllGroups()
        {
            var groupList = await _groupGenericRepository.GetAll();
            return groupList;
        }

        public bool HasUserJoinedGroup(string userId,int groupId)
        {
            var user = _userGroupGenericRepository.GetAll().Result.Where(x=> x.GroupId == groupId && x.UserId == userId).FirstOrDefault();
            if(user == null)
            {
                return false;
            }
            return true;
        }

        public async Task<IEnumerable<User>> GetGroupMembers(int groupId)
        {
            var members = _userGroupGenericRepository.GetAll().Result.Where(x=> x.GroupId == groupId).Select(x=> x.User).ToList();
            return members;
        }


    }
}
