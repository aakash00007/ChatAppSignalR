using Azure.Core;
using ChatApp.Data.Models;
using ChatApp.Data.Models.ResponseModels;
using ChatApp.Data.Repositories.GenericRepository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Business.UserService
{
    public class UserService : IUserService
    {
        private readonly IGenericRepository<User> _genericUserRepository;
        private readonly IGenericRepository<FriendRequest> _requestGenericRepository;
        private readonly IGenericRepository<ContactUser> _contactUserGenericRepository;
        private readonly IHttpContextAccessor _context;
        public UserService(IGenericRepository<User> genericUserRepository,IGenericRepository<FriendRequest> requestGenericRepository,IGenericRepository<ContactUser> contactUserGenericRepository, IHttpContextAccessor context)
        {
            _genericUserRepository = genericUserRepository;
            _requestGenericRepository = requestGenericRepository;
            _contactUserGenericRepository = contactUserGenericRepository;
            _context = context;
        }

        public async Task<ApiResponse> GetAllUsers()
        {
            string userId = _context.HttpContext.User.FindFirstValue("id");
            List<string> excludedUserList = _contactUserGenericRepository.GetAll().Result.Where(x=> x.FriendId == userId || x.UserId == userId).Select(x=> x.UserId == userId ? x.FriendId : x.UserId).ToList();
            List<string> requestUserIdList = _requestGenericRepository.GetAll().Result.Where(x=> x.SenderId == userId && x.IsDeleted == false).Select(x=> x.ReceiverId).ToList();
            var userList = _genericUserRepository.GetAll().Result.Where(x=> !excludedUserList.Contains(x.Id)).ToList();
            foreach(var user in userList) 
            {
                if (requestUserIdList.Contains(user.Id))
                {
                    user.HasTakenAction = true;
                }
            }
            if(userList.Count() == 0)
            {
                return new ApiResponse
                {
                    IsSuccess = false,
                    Message = "Users not found"
                };
            }
            return new ApiResponse
            {
                IsSuccess = true,
                Data = userList,
                Message = "Users Fetched Successfully!"
            };
        }

        public async Task<User> GetUserById(string userId)
        {
            var user = await _genericUserRepository.GetById(userId);
            return user;
        }
    }
}
