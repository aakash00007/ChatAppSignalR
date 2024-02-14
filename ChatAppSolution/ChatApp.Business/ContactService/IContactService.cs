using ChatApp.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Business.ContactService
{
    public interface IContactService
    {
        public Task<List<ContactUser>> GetAllContacts(string userId);
        public Task RemoveFromContacts(ContactUser contact);
    }
}
