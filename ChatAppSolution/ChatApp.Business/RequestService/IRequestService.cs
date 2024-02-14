using ChatApp.Data.Models;
using ChatApp.Data.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Business.RequestService
{
    public interface IRequestService
    {
        public Task SendRequest(FriendRequestViewModel friendRequestViewModel);
        public Task TakeActionOnRequest(FriendRequestViewModel friendRequestViewModel);
        public Task<List<FriendRequest>> GetAllRequests();
    }
}
