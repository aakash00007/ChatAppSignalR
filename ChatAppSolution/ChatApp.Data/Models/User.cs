using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Data.Models
{
    public class User : IdentityUser
    {
        public bool IsOnline { get; set; } = false;
        public bool IsDeleted { get; set; } = false;
        [NotMapped]
        public bool HasTakenAction { get; set; } = false;
        public string? ImageUrl { get; set; }
    }
}
