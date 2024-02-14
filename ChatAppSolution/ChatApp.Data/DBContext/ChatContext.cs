using ChatApp.Data.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Data.DBContext
{
    public class ChatContext : IdentityDbContext<User>
    {
        public ChatContext(DbContextOptions<ChatContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }

        public DbSet<Message> Messages { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<UserGroup> UserGroups { get; set; }
        public DbSet<FriendRequest> FriendRequests { get; set; }
        public DbSet<ContactUser> ContactUsers { get; set; }
    }
}
