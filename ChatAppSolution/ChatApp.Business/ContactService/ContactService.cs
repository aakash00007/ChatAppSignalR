using ChatApp.Data.Models;
using ChatApp.Data.Repositories.GenericRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Business.ContactService
{
    public class ContactService : IContactService
    {
        private readonly IGenericRepository<ContactUser> _contactGenericRepository;
        private readonly IGenericRepository<FriendRequest> _friendRequestGenericRepository;
        public ContactService(IGenericRepository<ContactUser> contactGenericRepository, IGenericRepository<FriendRequest> friendRequestGenericRepository)
        {
            _contactGenericRepository = contactGenericRepository;
            _friendRequestGenericRepository = friendRequestGenericRepository;
        }

        public async Task<List<ContactUser>> GetAllContacts(string userId)
        {
            var contacts = _contactGenericRepository.GetAll().Result.Where(x=> (x.UserId == userId) || (x.FriendId == userId)).ToList();
            return contacts;
        }

        public async Task RemoveFromContacts(ContactUser contact)
        {
            await _contactGenericRepository.Delete(contact.Id);
            await _contactGenericRepository.Save();
            var mutualRequestsList = _friendRequestGenericRepository.GetAll().Result.Where(x=> x.SenderId == contact.UserId || x.SenderId == contact.FriendId).ToList();
            foreach (var request in mutualRequestsList)
            {
                await _friendRequestGenericRepository.Delete(request.Id);
                await _friendRequestGenericRepository.Save();
            }
        }
    }
}
