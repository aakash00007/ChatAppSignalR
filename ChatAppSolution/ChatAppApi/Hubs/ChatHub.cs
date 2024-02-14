using ChatApp.Business.MessageService;
using ChatApp.Data.Models;
using ChatApp.Data.Models.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using ChatApp.Business.GroupService;
using ChatApp.Data.Repositories.GenericRepository;
using ChatApp.Business.RequestService;
using Microsoft.EntityFrameworkCore;
using ChatApp.Business.ContactService;

namespace ChatAppApi.Hubs
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class ChatHub : Hub 
    {
        private readonly IMessageService _messageService;
        private readonly IGroupService _groupService;
        private readonly IContactService _contactService;
        private readonly IGenericRepository<Message> _messageGenericRepository;
        private readonly IGenericRepository<User> _userGenericRepository;
        private readonly IGenericRepository<ContactUser> _contactGenericRepository;
        private readonly IGenericRepository<FriendRequest> _friendRequestGenericRepository;
        private readonly IRequestService _requestService;
        private readonly IMapper _mapper;
        public ChatHub(IMessageService messageService,IGroupService groupService,IContactService contactService,IGenericRepository<FriendRequest> friendRequestGenericRepository, IGenericRepository<ContactUser> contactGenericRepository,IGenericRepository<Message> messageGenericRepository,IGenericRepository<User> userGenericRepository,IMapper mapper,IRequestService requestService)
        {
            _messageService = messageService;
            _groupService = groupService;
            _contactService = contactService;
            _messageGenericRepository = messageGenericRepository;
            _userGenericRepository = userGenericRepository;
            _contactGenericRepository = contactGenericRepository;
            _friendRequestGenericRepository = friendRequestGenericRepository;
            _requestService = requestService;
            _mapper = mapper;
        }

        static IList<UserConnection> Users = new List<UserConnection>();

        public override async Task OnConnectedAsync()
        {
            string userId = Context.User.FindFirstValue("id");

            var existingUser = Users.FirstOrDefault(x => x.UserId == userId);
            var indexOfExistingUser = Users.IndexOf(existingUser);

            UserConnection user = new UserConnection
            {
                UserId = userId,
                ConnectionId = Context.ConnectionId
            };

            if (!Users.Contains(existingUser))
            {
                Users.Add(user);
            }
            else
            {
                Users[indexOfExistingUser] = user;
            }

            await Clients.All.SendAsync("GetUsersOnConnect", Users);

            await base.OnConnectedAsync();

        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            string userId = Context.User.FindFirstValue("id");
            var users = Users.Where(x => x.UserId == userId).ToList();
            foreach (var user in users)
            {
                Users.Remove(user);
            }
            Clients.All.SendAsync("GetUsersOnDisconnect", Users);
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(MessageViewModel messageViewModel)
        {
            if(messageViewModel.GroupId != null)
            {
                var groupMessage = _mapper.Map<Message>(messageViewModel);
                await _messageService.AddMessage(groupMessage);
                var currentUserConnectionId = Users.Where(u => u.UserId == messageViewModel.SenderId).Select(c => c.ConnectionId).FirstOrDefault();
                await Clients.GroupExcept(messageViewModel.GroupId.ToString(), currentUserConnectionId).SendAsync("ReceiveGroupMessage", messageViewModel);
            }
            else
            {
                var reciever = Users.FirstOrDefault(x => x.UserId == messageViewModel.RecieverId);
                var connectionId = reciever == null ? "offline" : reciever.ConnectionId;
                var message = _mapper.Map<Message>(messageViewModel);
                await _messageService.AddMessage(message);
                await Clients.Client(connectionId).SendAsync("ReceiveMessage", messageViewModel);
            }
        }

        public async Task SendRequest(FriendRequestViewModel friendRequestViewModel)
        {
            await _requestService.SendRequest(friendRequestViewModel);
            var receiver = await _userGenericRepository.GetById(friendRequestViewModel.ReceiverId);
            _userGenericRepository.Update(receiver);
            await _userGenericRepository.Save();
            await Clients.All.SendAsync("GetNewRequest", friendRequestViewModel);
        }

        public async Task TakeActionOnRequest(FriendRequestViewModel friendRequestViewModel)
        {
            await _requestService.TakeActionOnRequest(friendRequestViewModel);
            if(friendRequestViewModel.RequestStatus == RequestStatus.Accepted)
            {
                ContactUser contact = new ContactUser
                {
                    UserId = friendRequestViewModel.SenderId,
                    FriendId = friendRequestViewModel.ReceiverId
                };
                await _contactGenericRepository.Insert(contact);
                await _contactGenericRepository.Save();
                var receiver = Users.FirstOrDefault(x=> x.UserId == friendRequestViewModel.ReceiverId);
                var sender = Users.FirstOrDefault(x => x.UserId == friendRequestViewModel.SenderId);
                var receiverConnectionId = receiver == null ? "offline" : receiver.ConnectionId;
                var senderConnectionId = sender == null ? "offline" : sender.ConnectionId;

                var newContact = _contactGenericRepository.GetData().
                    Include(x=> x.User).
                    Include(x=> x.Friend).
                    Where(x => x.UserId == friendRequestViewModel.SenderId && x.FriendId == friendRequestViewModel.ReceiverId).
                    FirstOrDefault();

                await Clients.Client(receiverConnectionId).SendAsync("GetNewContact", newContact);
                await Clients.Client(senderConnectionId).SendAsync("GetNewContact", newContact);
            }
            if(friendRequestViewModel.RequestStatus == RequestStatus.Rejected)
            {
                await _friendRequestGenericRepository.Delete(friendRequestViewModel.Id);
                await _friendRequestGenericRepository.Save();
            }
        }

        public async Task RemoveFromContacts(ContactUser contact)
        {
            await _contactService.RemoveFromContacts(contact);
            var sender = Users.FirstOrDefault(x=> x.UserId == contact.UserId);
            var receiver = Users.FirstOrDefault(x=> x.UserId == contact.FriendId);
            var senderConnectionId = sender == null ? "offline" : sender.ConnectionId;
            var receiverConnectionId = receiver == null ? "offline" : receiver.ConnectionId;
            await Clients.Client(senderConnectionId).SendAsync("GetRemovedContact", contact);
            await Clients.Client(receiverConnectionId).SendAsync("GetRemovedContact", contact);
        }

        //public async Task<List<FriendRequest>> GetAllRequests()
        //{
        //    var requests = await _requestService.GetAllRequests();
        //    return requests;
        //}

        public async Task CreateNewGroup(Group group)
        {
            await _groupService.CreateNewGroup(group);
            //var groupList = _groupService.GetAllGroups().Result.ToList();
            await Clients.All.SendAsync("GetNewGroup", group);
        }

        public async Task JoinGroup(int groupId,string userId)
        {
            //await _groupService.AddUserToGroup(userId, groupId);
            await Groups.AddToGroupAsync(Context.ConnectionId,groupId.ToString());
        }

        //public async Task RemoveUserFromGroup(int groupId,string userId)
        //{
        //    await _groupService.RemoveUserFromGroup(groupId, userId);
        //    var members = await _groupService.GetGroupMembers(groupId);
        //    await Clients.All.SendAsync("GetGroupMembers",members);
        //}

        public async Task MarkMessagesAsRead(string recieverId,string senderid)
        {
            var messages = _messageService.GetReceiverSideMessages(recieverId,senderid).Result;
            foreach (var message in messages)
            {
                message.IsRead = true;
                _messageGenericRepository.Update(message);
                await _messageGenericRepository.Save();
            }
            
            //await Clients.User(Context.UserIdentifier).SendAsync("MessageRead", messageId);
        }

        public void DisconnectUser(string userId)
        {
            //string userId = Context.User.FindFirstValue("id");
            var users = Users.Where(x => x.UserId == userId).ToList();
            foreach (var user in users)
                Users.Remove(user);

            Clients.All.SendAsync("GetUsersOnDisconnect", Users);
        }
    }
}
