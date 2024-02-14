using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Data.Models
{
    public class ContactUser : BaseEntity
    {
        public string UserId { get; set; }
        public string FriendId { get; set; }
        public virtual User? User { get; set; }
        public virtual User? Friend { get; set; }
    }
}
