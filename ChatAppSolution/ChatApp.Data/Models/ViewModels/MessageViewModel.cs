using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Data.Models.ViewModels
{
    public class MessageViewModel
    {
        public int? Id { get; set; }
        public string MessageContent { get; set; }
        public DateTime TimeStamp { get; set; }
        public bool IsRead { get; set; }
        public string? SenderId { get; set; }
        public string? RecieverId { get; set; }
        public int? GroupId { get; set;}
    }
}
