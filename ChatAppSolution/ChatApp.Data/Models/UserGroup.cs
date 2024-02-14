using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Data.Models
{
    public class UserGroup : BaseEntity
    {
        public int? GroupId { get; set; }
        public string? UserId { get; set; }
        public virtual User? User { get; set; }
        public virtual Group? Group { get; set; }
    }
}
