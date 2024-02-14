using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Data.Models
{
    public class FriendRequest : BaseEntity
    {
        public string SenderId { get; set; }
        public string ReceiverId { get; set; }
        public virtual User? Sender { get; set; }
        public virtual User? Receiver { get; set; }
        public RequestStatus RequestStatus { get; set; } = RequestStatus.Pending;
    }

    public enum RequestStatus
    {
        Accepted,
        Rejected,
        Pending
    }
}
