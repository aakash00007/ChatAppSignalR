using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Data.Models.ViewModels
{
    public class FriendRequestViewModel
    {
        public int? Id { get; set; }
        public string? SenderId { get; set; }
        public string? ReceiverId { get; set; }
        public RequestStatus RequestStatus { get; set; }
    }
}
