using AutoMapper;
using ChatApp.Data.Models;
using ChatApp.Data.Models.ViewModels;
using ChatApp.Data.Repositories.GenericRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Business.RequestService
{
    public class RequestService : IRequestService
    {
        private readonly IGenericRepository<FriendRequest> _requestGenericRepository;
        private readonly IMapper _mapper;
        public RequestService(IGenericRepository<FriendRequest> requestGenericRepository,IMapper mapper)
        {
            _requestGenericRepository = requestGenericRepository;
            _mapper = mapper;
        }

        public async Task SendRequest(FriendRequestViewModel friendRequestViewModel)
        {
            var request = _mapper.Map<FriendRequest>(friendRequestViewModel);
            await _requestGenericRepository.Insert(request);
            await _requestGenericRepository.Save();
        }

        public async Task TakeActionOnRequest(FriendRequestViewModel friendRequestViewModel)
        {
            var foundRequest = await _requestGenericRepository.GetById(friendRequestViewModel.Id);
            if (foundRequest != null && foundRequest.RequestStatus == RequestStatus.Pending)
            {
                var request = _mapper.Map(friendRequestViewModel, foundRequest);
                _requestGenericRepository.Update(request);
                await _requestGenericRepository.Save();
            }
        }

        public async Task<List<FriendRequest>> GetAllRequests()
        {
            var requests = _requestGenericRepository.GetAll().Result.ToList();
            return requests;
        }
    }
}
