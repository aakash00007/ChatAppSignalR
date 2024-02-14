using ChatApp.Data.Models;
using ChatApp.Data.Models.ResponseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Business.UserService
{
    public interface IUserService
    {
        Task<ApiResponse> GetAllUsers();
        Task<User> GetUserById(string userId);
    }
}
