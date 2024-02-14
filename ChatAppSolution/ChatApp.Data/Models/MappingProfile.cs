using AutoMapper;
using ChatApp.Data.Models.ViewModels;

namespace ChatApp.Data.Models
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<RegistrationViewModel, User>();
            CreateMap<MessageViewModel, Message>();
            CreateMap<FriendRequestViewModel, FriendRequest>();
        }
    }
}
